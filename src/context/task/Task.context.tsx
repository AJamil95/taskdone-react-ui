import { createContext } from "react";
import type { Task } from "../../interfaces";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;

  total: number;
  page: number;
  pageSize: number;
  search: string;
  filterDone: boolean | null;

  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setFilterDone: (done: boolean | null) => void;

  loadTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  toggleDoneTask: (id: number, task: Partial<Task>) => void;
  removeTask: (id: number) => void;
}

export const TaskContext = createContext<TaskContextType | null>(null);
