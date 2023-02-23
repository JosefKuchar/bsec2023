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

export default function Places() {
  useEffect(() => {
    fetch("http://127.0.0.1:5000/restaurants")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");

  const navigate = useNavigate();

  const restaurants = [
    { name: "Lorem ipsum", id: 1 },
    { name: "Hasdf", id: 2 },
    { name: "Hasdf", id: 2 },
    { name: "Lorem ipsum", id: 1 },
    { name: "Hasdf", id: 2 },
    { name: "Hasdf", id: 2 },
    { name: "Lorem ipsum", id: 1 },
    { name: "Hasdf", id: 2 },
    { name: "Hasdf", id: 2 },
    { name: "Lorem ipsum", id: 1 },
    { name: "Hasdf", id: 2 },
    { name: "Hasdf", id: 2 },
    { name: "Lorem ipsum", id: 1 },
    { name: "Hasdf", id: 2 },
    { name: "Hasdf", id: 2 },
    { name: "Lorem ipsum", id: 1 },
    { name: "Hasdf", id: 2 },
    { name: "Hasdf", id: 2 },
  ];

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogText("");
  };

  const handleAdd = () => {
    closeDialog();
  };

  const handleCancel = () => {
    closeDialog();
  };

  return (
    <>
      <List>
        {restaurants.map((restaurant) => (
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
        color="secondary"
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Zrušit</Button>
          <Button onClick={handleAdd}>Přidat</Button>
        </DialogActions>
      </Dialog>
      <Navigation />
    </>
  );
}
