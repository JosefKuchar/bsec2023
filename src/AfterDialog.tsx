import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import { URL, WAIT_TIME } from "./config";

export default function AfterDialog() {
  const [sugar, setSugar] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<any>(null);

  useEffect(() => {
    fetch(`${URL}/get_first`)
      .then((res) => res.json())
      .then((data) => {
        if (data.after_value === null) {
          setId(data.id);
          const now = new Date();
          const then = new Date(data.datetime + "Z");
          const diff = now.getTime() - then.getTime();
          if (diff <= WAIT_TIME) {
            show();
          } else {
            setTimeout(show, WAIT_TIME - diff);
          }
        }
      });
  }, []);

  const show = () => {
    setOpen(true);
  };

  const handleUpdate = () => {
    fetch(`${URL}/add_last_value`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        record_id: id,
        after_value: Number(sugar),
      }),
    }).then(() => setOpen(false));
  };

  return (
    <Dialog open={open} maxWidth="lg" fullWidth>
      <DialogTitle>Doplnění údajů</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ marginBottom: 8 }}>
          Uběhly 2h od posledního jídla. Vyplňte aktuální hladinu cukru v krvi
          (mmol/L)
        </DialogContentText>
        <TextField
          label="Současná hladina cukru v krvi"
          type="number"
          fullWidth
          value={sugar}
          onChange={(e) => setSugar(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpdate}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
