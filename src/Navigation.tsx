import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    console.log(location);

    if (location.pathname === "/") setValue(0);
    else if (location.pathname === "/overview") setValue(1);
    else setValue(2);
  }, [location]);

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels value={value}>
        <BottomNavigationAction
          label="Nový záznam"
          icon={<AddIcon />}
          onClick={() => navigate("/")}
        />
        <BottomNavigationAction
          label="Přehled"
          icon={<TimelineIcon />}
          onClick={() => navigate("/overview")}
        />
        <BottomNavigationAction
          label="Místa"
          icon={<RestaurantMenuIcon />}
          onClick={() => navigate("/places")}
        />
      </BottomNavigation>
    </Paper>
  );
}
