import {
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Fab,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "./Navigation";
import { useEffect, useState } from "react";
import { URL } from "./config";
import AddIcon from "@mui/icons-material/Add";

export default function Items() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");

  const getItems = () => {
    fetch(`${URL}/food?restaurant_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      });
  };

  useEffect(getItems, []);

  const [items, setItems] = useState<any>([]);

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogText("");
  };

  const handleAdd = () => {
    fetch(`${URL}/create_food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dialogText,
        restaurant_id: id,
      }),
    })
      .then(() => closeDialog())
      .then(() => getItems());
  };

  const handleCancel = () => {
    closeDialog();
  };

  return (
    <>
      <List>
        {items.map((item: any) => (
          <>
            <ListItemButton
              onClick={() => navigate(`/places/${id}/${item.id}`)}
            >
              <ListItemText primary={item.name} />
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
        <DialogTitle>Nové jídlo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Název jídla"
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
    </>
  );
}
