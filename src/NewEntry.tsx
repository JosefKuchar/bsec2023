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
import { useState, useEffect } from "react";
import { URL } from "./config";
import Navigation from "./Navigation";

const filter = createFilterOptions<any>();

interface IState {
  sugar: string | null;
  restaurant: any | null;
  food: any | null;
  bolus: string | null;
}

export default function NewEntry() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [state, setState] = useState<IState>({
    sugar: null,
    restaurant: null,
    food: null,
    bolus: "",
  });
  const [restaurants, setRestaurants] = useState<any>([]);
  const [foods, setFoods] = useState<any>([]);

  useEffect(() => {
    fetch(`${URL}/restaurants`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
      });
  }, []);

  useEffect(() => {
    if (state?.food?.id && state?.sugar) {
      fetch(`${URL}/calculate_bolus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
        .then((res) => res.json())
        .then((data) => {
          setState({ ...state, bolus: data.recommended_bolus });
        });
    }
  }, [state?.food?.id, state?.sugar]);

  useEffect(() => {
    if (!state?.restaurant?.id) return;

    fetch(`${URL}/food?restaurant_id=${state.restaurant.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
      });
  }, [state?.restaurant?.id]);

  const handleNew = () => {
    fetch(`${URL}/newrecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        datetime: new Date().toISOString(),
        initial_value: state.sugar,
        food_id: state.food.id,
        bolus: state.bolus,
        after_value: null,
      }),
    });
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
              label="Současná hladina cukru v krvi"
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
              options={restaurants}
              renderInput={(params) => (
                <TextField {...params} label="Restaurace" />
              )}
              fullWidth
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              getOptionLabel={(option: any) => option.name}
              value={state.restaurant}
              onChange={(e, value: any) =>
                setState({ ...state, restaurant: value, food: null })
              }
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
              options={foods}
              getOptionLabel={(option: any) => option.name}
              renderInput={(params) => <TextField {...params} label="Jídlo" />}
              value={state.food}
              onChange={(e, value: any) => setState({ ...state, food: value })}
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
              value={state.bolus}
              onChange={(e) => setState({ ...state, bolus: e.target.value })}
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
