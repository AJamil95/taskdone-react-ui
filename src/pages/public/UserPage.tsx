import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import type { ActionState } from "../../interfaces";
import { schemaUser, type UserFormValues } from "../../models/user.model";
import { createInitialState, handleZodError } from "../../helpers";
import { useActionState } from "react";
import { useAlert, useAxios } from "../../hooks";

export type UserActionState = ActionState<UserFormValues>;
const initialState = createInitialState<UserFormValues>();

export const UserPage = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const axios = useAxios();

  const createUserApi = async (
    _: UserActionState | undefined,
    formData: FormData,
  ): Promise<UserActionState | undefined> => {
    const rawData: UserFormValues = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };
    try {
      schemaUser.parse(rawData);
      await axios.post("/users", {
        username: rawData.username,
        password: rawData.password,
      });
      showAlert("Usuario creado", "success");
      navigate("/login");
    } catch (error) {
      // console.error(error);
      const err = handleZodError<UserFormValues>(error, rawData);
      showAlert(err.message, "error");
      return err;
    }
    return;
  };

  const [state, submitAction, isPending] = useActionState(
    createUserApi,
    initialState,
  );
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component={"h1"} variant="h4" gutterBottom>
            NUEVO USUARIO
          </Typography>

          <Box component={"form"} action={submitAction} sx={{ width: "100%" }}>
            <TextField
              name="username"
              required
              fullWidth
              label="usuario"
              type="text"
              autoComplete="username"
              autoFocus
              defaultValue={state?.formData?.username}
              error={!!state?.errors.username}
              helperText={!!state?.errors.username}
              disabled={isPending}
              sx={{ mb: "30px" }}
            />
            <TextField
              name="password"
              required
              fullWidth
              label="Contraseña"
              type="password"
              autoComplete="password"
              autoFocus
              defaultValue={state?.formData?.password}
              error={!!state?.errors.password}
              helperText={!!state?.errors.password}
              disabled={isPending}
              sx={{ mb: "30px" }}
            />
            <TextField
              name="confirmPassword"
              required
              fullWidth
              label="Repetir contraseña"
              type="password"
              autoComplete="password"
              autoFocus
              defaultValue={state?.formData?.confirmPassword}
              error={!!state?.errors.confirmPassword}
              helperText={!!state?.errors.confirmPassword}
              disabled={isPending}
              sx={{ mb: "30px" }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 48 }}
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isPending ? "Registrando in..." : "Registrar"}
            </Button>
            <Link to={"/login"}>Regresar a Login</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
