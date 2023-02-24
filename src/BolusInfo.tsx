import { useParams } from "react-router-dom";
import Navigation from "./Navigation";
import { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  TableBody,
  Container,
  Typography,
} from "@mui/material";
import moment from "moment";
import { URL } from "./config";
import AfterDialog from "./AfterDialog";

export default function BulusInfo() {
  const params = useParams();
  const [records, setRecords] = useState<any>([]);
  const [foodName, setFoodName] = useState("");

  useEffect(() => {
    fetch(`${URL}/food_records?food_id=${params.foodId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
      });
    fetch(`${URL}/food_name?food_id=${params.foodId}`)
      .then((res) => res.json())
      .then((data) => {
        setFoodName(data);
      });
  }, []);

  return (
    <>
      <div className="font-heading font-medium text-3xl p-4">
        Jak byl bolus vypočítán?
      </div>
      <Container>
        {records.length < 3 ? (
          <Typography>
            Pro jídlo <span className="font-bold">{foodName}</span> není
            dostatek dat k vypočtení bolusu. Byla doporučena průměrná hodnota z
            historie.
          </Typography>
        ) : (
          <>
            <Typography style={{ paddingBottom: 8 }}>
              Pro jídlo <span className="font-bold">{foodName}</span> byl bolus
              vypočítán z následujících dat linearní regresí.
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Datum a čas</TableCell>
                    <TableCell align="right">Bolus</TableCell>
                    <TableCell align="right">Cukr před</TableCell>
                    <TableCell align="right">Cukr po</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records
                    .slice(0)
                    .reverse()
                    .map((row: any) => {
                      const date = moment(row.datetime).format(
                        "DD. MM. YYYY HH:mm"
                      );

                      return (
                        <TableRow
                          key={row.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="right">{date}</TableCell>
                          <TableCell align="right">{row.bolus}</TableCell>
                          <TableCell align="right">
                            {row.initial_value}
                          </TableCell>
                          <TableCell align="right">{row.value_2h}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        <Navigation />
        <AfterDialog />
      </Container>
    </>
  );
}
