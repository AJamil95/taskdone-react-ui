import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useState, useActionState } from "react";
import { useAxios, useAlert, useTask } from "../../hooks";
import {
  schemaCreateTask,
  type CreateTaskFormValues,
} from "../../models/task.model";
import { createInitialState, handleZodError } from "../../helpers";
import type { ActionState } from "../../interfaces";
import type { Task } from "../../interfaces";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

type TaskActionState = ActionState<CreateTaskFormValues>;
const initialState = createInitialState<CreateTaskFormValues>();

export const TaskPage = () => {
  const axios = useAxios();
  const { showAlert } = useAlert();
  const {
    tasks,
    loading,
    total,
    page,
    pageSize,
    search,
    filterDone,
    setPage,
    setPageSize,
    setSearch,
    setFilterDone,
    loadTasks,
    updateTask,
    removeTask,
  } = useTask();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [realTimeError, setRealTimeError] = useState("");

  const validateNameInRealTime = (value: string) => {
    const result = schemaCreateTask.safeParse({ name: value });
    if (!result.success) {
      const errors = result.error.issues;
      if (errors.length > 0) {
        setRealTimeError(errors[0].message);
      }
    } else {
      setRealTimeError("");
    }
  };

  const taskAction = async (
    state: TaskActionState | undefined,
    formData: FormData,
  ): Promise<TaskActionState> => {
    const name = formData.get("name") as string;

    const validated = schemaCreateTask.safeParse({ name });

    if (!validated.success) {
      return handleZodError(validated.error);
    }

    try {
      if (editingTask) {
        await axios.put(`/tasks/${editingTask.id}`, validated.data);
        showAlert("Tarea actualizada", "success");
        updateTask(editingTask.id, { name: validated.data.name });
      } else {
        await axios.post("/tasks", validated.data);
        showAlert("Tarea creada", "success");
      }

      setOpenDialog(false);
      setEditingTask(null);
      await loadTasks();

      return {
        ok: true,
        data: validated.data,
        errors: {},
      };
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Error al guardar tarea";
      showAlert(errorMsg, "error");

      return {
        ok: false,
        data: validated.data,
        errors: { form: errorMsg },
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    taskAction,
    initialState,
  );

  const deleteTask = async (id: number, name: string) => {
    if (confirm(`¿Eliminar tarea "${name}"?`)) {
      try {
        await axios.delete(`/tasks/${id}`);
        showAlert("Tarea eliminada", "success");
        removeTask(id);
      } catch (error) {
        showAlert("Error al eliminar tarea", "error");
      }
    }
  };

  const toggleDoneTask = async (task: Task) => {
    try {
      await axios.patch(`/tasks/${task.id}`, { done: !task.done });
      updateTask(task.id, { done: !task.done });
      showAlert("Estado actualizado", "success");
    } catch (error) {
      showAlert("Error al actualizar el estado de la tarea", "error");
    }
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setCharCount(0);
    setRealTimeError("");
    setOpenDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCharCount(task.name.length);
    setRealTimeError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setCharCount(0);
    setRealTimeError("");
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 3,
    },
    {
      field: "done",
      headerName: "Estado",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Switch
            checked={params.value}
            onChange={() => toggleDoneTask(params.row)}
            color={params.value ? "success" : "warning"}
            size="small"
          />
          <Typography
            variant="body2"
            sx={{
              color: params.value ? "" : "",
              fontWeight: "medium",
              minWidth: 70,
            }}
          >
            {params.value ? "Finalizado" : "Pendiente"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditTask(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => deleteTask(params.row.id, params.row.name)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardHeader
          title="Gestión de Tareas"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewTask}
              sx={{ color: "white" }}
            >
              Agregar Tarea
            </Button>
          }
        />

        <CardContent>
          <Box sx={{ width: "100%" }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  label="Buscar tareas"
                  placeholder="Ingresa el nombre de la tarea"
                  variant="outlined"
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ flex: 1, minWidth: 250 }}
                />
              </Box>
            </Stack>

            <DataGrid
              rows={tasks}
              columns={columns}
              loading={loading}
              rowCount={total}
              paginationModel={{ pageSize, page }}
              onPaginationModelChange={(newModel) => {
                setPage(newModel.page);
                setPageSize(newModel.pageSize);
              }}
              pageSizeOptions={[
                5,
                10,
                25,
                50,
                100,
                { value: -1, label: "All" },
              ]}
              paginationMode="server"
              disableRowSelectionOnClick
              disableColumnMenu
              localeText={{
                noRowsLabel: "No hay registros para mostrar",
                paginationRowsPerPage: "Registros por página:",
              }}
              sx={{
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingTask ? "Editar Tarea" : "Nueva Tarea"}
        </DialogTitle>

        <form action={formAction}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Nombre
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: charCount > 255 ? "error.main" : "text.secondary",
                    }}
                  >
                    {charCount}/255
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ingresa el nombre de la tarea"
                  name="name"
                  defaultValue={editingTask?.name || ""}
                  error={!!state?.errors?.name || !!realTimeError}
                  disabled={isPending}
                  autoFocus
                  inputProps={{
                    maxLength: 255,
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCharCount(value.length);
                    validateNameInRealTime(value);
                  }}
                  helperText={
                    realTimeError ||
                    (typeof state?.errors?.name === "string"
                      ? state.errors.name
                      : state?.errors?.name?.[0] || "")
                  }
                />
              </Box>

              {state?.errors?.form && (
                <Typography color="error" variant="body2">
                  {state.errors.form}
                </Typography>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
