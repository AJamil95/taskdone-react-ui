import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import type { MenuType } from "./types";

interface Props {
  username?: string;
  menuOptions: MenuType[];
  logout: () => void;
}

export const Header = ({ username, menuOptions, logout }: Props) => {
  const getPageTitle = () => {
    const currentOption = menuOptions.find(
      (option) => option.path === location.pathname,
    );
    return /*currentOption?.text ||*/ "Task Done App";
  };

  return (
    <AppBar position="fixed" elevation={2}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="white">
          {getPageTitle()}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light" }}>
            {username?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }} color="white">
            {username || "Usuario"}
          </Typography>
          <Button
            color="inherit"
            onClick={logout}
            startIcon={<LogoutIcon />}
            sx={{ color: "white" }}
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
