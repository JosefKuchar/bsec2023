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
  IconButton,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { useState, useEffect } from "react";
import { URL } from "./config";
import Navigation from "./Navigation";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import AfterDialog from "./AfterDialog";
import BolusInfo from "./BolusInfo";

const filter = createFilterOptions<any>();

interface IState {
  sugar: string | null;
  restaurant: any | null;
  food: any | null;
  bolus: string | null;
}

export default function NewEntry() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [sugar, setSugar] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [food, setFood] = useState<any | null>(null);
  const [bolus, setBolus] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<any>([]);
  const [foods, setFoods] = useState<any>([]);
  const [ok, setOk] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [key, setKey] = useState<any>(null);
  const [bolusInfoOpen, setBolusInfoOpen] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    fetch(`${URL}/restaurants`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
      });
  }, []);

  useEffect(() => {
    if (food?.id && sugar) {
      fetch(`${URL}/calculate_bolus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initial_value: Number(sugar),
          food_id: food.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setBolus(data.recommended_bolus);
          setEdited(false);
          setOk(data.predicted_by !== "all");
        });
    } else {
      setOk(null);
      // setBolus(null);
    }
  }, [food?.id, sugar]);

  useEffect(() => {
    if (!restaurant?.id) return;

    fetch(`${URL}/food?restaurant_id=${restaurant?.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
      });
  }, [restaurant?.id]);

  const handleNew = () => {
    fetch(`${URL}/newrecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        datetime: new Date().toISOString(),
        initial_value: sugar,
        food_id: food.id,
        bolus: bolus,
        after_value: null,
      }),
    }).then(() => {
      setKey(Math.random());
      setSuccessOpen(true);
      setSugar(null);
      setFood(null);
      setRestaurant(null);
      setBolus(null);
    });
  };

  return (
    <>
      <div className="font-heading font-medium text-3xl p-4">Nov?? z??znam</div>
      <Container className="p-2">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              label="Sou??asn?? hladina cukru v krvi"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">mmol/L</InputAdornment>
                ),
              }}
              type="number"
              fullWidth
              value={sugar ?? ""}
              onChange={(e) => setSugar(e.target.value)}
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
              value={restaurant}
              onChange={(e, value: any) => {
                setRestaurant(value);
                setFood(null);
              }}
              //   filterOptions={(options, params) => {
              //     const filtered = filter(options, params);
              //     if (params.inputValue !== "") {
              //       filtered.push({
              //         inputValue: params.inputValue,
              //         title: `P??idat "${params.inputValue}"`,
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
              renderInput={(params) => <TextField {...params} label="J??dlo" />}
              value={food}
              onChange={(e, value: any) => setFood(value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              label="Bolus"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">Jednotek</InputAdornment>
                ),
              }}
              fullWidth
              value={bolus ?? ""}
              onChange={(e) => {
                setBolus(e.target.value);
                setEdited(true);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton
              color="primary"
              size="large"
              onClick={() => setBolusInfoOpen(true)}
              disabled={ok === null || edited}
            >
              {ok === true || ok === null || edited ? (
                <InfoIcon />
              ) : (
                <WarningIcon style={{ color: "#e8bf09" }} />
              )}
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleNew}
            >
              Vytvo??it z??znam
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          open={successOpen}
          autoHideDuration={6000}
          onClose={() => setSuccessOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccessOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Z??znam vytvo??en
          </Alert>
        </Snackbar>
      </Container>
      <AfterDialog key={key} />
      <BolusInfo
        open={bolusInfoOpen}
        onClose={() => setBolusInfoOpen(false)}
        foodId={food?.id}
      />
      <Navigation />
    </>
  );
}
