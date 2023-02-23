import {
  TextField,
  Container,
  Grid,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";

export default function NewEntry() {
  const [successOpen, setSuccessOpen] = useState(false);

  const options = [
    { label: "MC Donalds", id: 1 },
    { label: "KFC", id: 2 },
  ];

  const chalky = [
    { label: "Chalka", id: 1 },
    { label: "Piti", id: 2 },
  ];

  const handleNew = () => {
    setSuccessOpen(true);
  };

  return (
    <>
      <Container className="p-2">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Současná hladina cukru v krvy"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">mmol/L</InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              options={options}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Restaurace" />
              )}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              options={chalky}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Jídlo" />}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bolus"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">Jednotek</InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleNew}
            >
              Vytvořit záznam
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          open={successOpen}
          autoHideDuration={6000}
          onClose={() => setSuccessOpen(false)}
        >
          <Alert
            onClose={() => setSuccessOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Záznam vytvořen
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
