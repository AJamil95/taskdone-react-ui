import { useState, useEffect, type ReactNode } from "react";
import { TaskContext } from "./Task.context";
import type { Task } from "../../interfaces";
import { useAuth } from "../../hooks/useAuth";
import { useAxios } from "../../hooks/useAxios";

interface Props {
  children: ReactNode;
}

export const TaskProvider = ({ children }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [filterDone, setFilterDone] = useState<boolean | null>(null);

  const { token } = useAuth();
  const axios = useAxios();

  const loadTasks = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const params: any = {
        page: pageSize === -1 ? 1 : page + 1,
        limit: pageSize === -1 ? 999999 : pageSize,
      };

      if (search) {
        params.search = search;
      }

      if (filterDone !== null) {
        params.done = filterDone;
      }

      const response = await axios.get("/tasks", { params });

      const payload = response.data;

      setTasks(payload.data ?? []);
      setTotal(payload.total ?? 0);
    } catch (error) {
      setTasks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // Reset to page 0 when search or filter changes
      setPage(0);
    }
  }, [search, filterDone, token]);

  useEffect(() => {
    if (token) {
      loadTasks();
    }
  }, [token, page, pageSize, search, filterDone]);

  const addTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setTotal((prev) => prev + 1);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  };

  const toggleDoneTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setTotal((prev) => Math.max(prev - 1, 0));
  };

  return (
    <TaskContext.Provider
      value={{
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
        addTask,
        updateTask,
        toggleDoneTask,
        removeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
