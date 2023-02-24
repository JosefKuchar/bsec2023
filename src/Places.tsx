import {
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { URL } from "./config";
import AfterDialog from "./AfterDialog";

export default function Places() {
  const [restaurants, setRestaurants] = useState<any>([]);

  const getRestaurants = () => {
    fetch(`${URL}/restaurants`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
      });
  };

  useEffect(getRestaurants, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");

  const navigate = useNavigate();

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogText("");
  };

  const handleAdd = () => {
    fetch(`${URL}/create_restaurant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dialogText,
      }),
    })
      .then(() => closeDialog())
      .then(() => getRestaurants());
  };

  const handleCancel = () => {
    closeDialog();
  };

  return (
    <>
      <div className="font-heading font-medium text-3xl p-4">
        Restaurace & místa
      </div>
      <List
        style={{
          paddingBottom: "56px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {restaurants.map((restaurant: any) => (
          <>
            <ListItemButton
              onClick={() => navigate(`/places/${restaurant.id}`)}
            >
              <ListItemText primary={restaurant.name} />
            </ListItemButton>
            <Divider />
          </>
        ))}
      </List>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
        }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Nová restaurace</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Název restaurace"
            fullWidth
            variant="standard"
            value={dialogText}
            onChange={(e) => setDialogText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Zrušit</Button>
          <Button onClick={handleAdd}>Přidat</Button>
        </DialogActions>
      </Dialog>
      <Navigation />
      <AfterDialog />
    </>
  );
}
