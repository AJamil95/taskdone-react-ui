import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouter } from "./routes/AppRoutes.tsx";
import { AlertProvider } from "./context/alert/Alert.provider.tsx";
import { AuthProvider } from "./context/auth/Auth.provider.tsx";
import { TaskProvider } from "./context/task/Task.provider.tsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgba(48, 163, 220, 1)",
    },
    secondary: {
      main: "rgba(249, 53, 232, 1)",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AlertProvider>
          <TaskProvider>
            <AppRouter />
            <CssBaseline />
            <App />
          </TaskProvider>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
