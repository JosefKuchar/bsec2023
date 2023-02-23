import {
  TextField,
  Container,
  Grid,
  Button,
  Snackbar,
  Alert,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import Navigation from "./Navigation";

const filter = createFilterOptions<any>();

interface IState {
  sugar: string | null;
  restaurant: number | null;
  food: number | null;
  bolus: string | null;
}

export default function NewEntry() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [state, setState] = useState<IState>({
    sugar: null,
    restaurant: null,
    food: null,
    bolus: null,
  });

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
      <AppBar position="static" className="mb-6">
        <Toolbar>
          <Typography variant="h6">Nový záznam</Typography>
        </Toolbar>
      </AppBar>
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
              type="number"
              fullWidth
              value={state.sugar}
              onChange={(e) => setState({ ...state, sugar: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              options={options}
              renderInput={(params) => (
                <TextField {...params} label="Restaurace" />
              )}
              fullWidth
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              //   filterOptions={(options, params) => {
              //     const filtered = filter(options, params);
              //     if (params.inputValue !== "") {
              //       filtered.push({
              //         inputValue: params.inputValue,
              //         title: `Přidat "${params.inputValue}"`,
              //       });
              //     }
              //     return filtered;
              //   }}
              //freeSolo
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              options={chalky}
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
      <Navigation />
    </>
  );
}
