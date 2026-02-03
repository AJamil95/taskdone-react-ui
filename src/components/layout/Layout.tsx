import type { ReactNode } from "react";
import { useAuth } from "../../hooks";
import type { MenuType } from "./types";
import { Person as PersonIcon, Task as TaskIcon } from "@mui/icons-material";
import { Box, Container, Toolbar } from "@mui/material";
import { Header } from "./Header";
import { Menu } from "./Menu";
import { Footer } from "./Footer";

interface Props {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { logout, user } = useAuth();

  const menuOptions: MenuType[] = [
    {
      text: "Mi Perfil",
      icon: <PersonIcon />,
      path: "/perfil",
    },
    {
      text: "Mis tareas",
      icon: <TaskIcon />,
      path: "/tasks",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Header
        logout={logout}
        menuOptions={menuOptions}
        username={user?.username}
      />

      <Toolbar />

      <Box sx={{ flex: 1, display: "flex", width: "100%", overflow: "hidden" }}>
        <Menu menuOptions={menuOptions} />

        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            py: 3,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Container>
      </Box>

      <Footer message="2026 Mi app" />
    </Box>
  );
};
