import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Container,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import Navigation from "./Navigation";
import { useEffect, useState } from "react";
import { URL } from "./config";
import moment from "moment";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import AfterDialog from "./AfterDialog";

function addHours(date: any, hours: number) {
  // 👇 Make copy with "Date" constructor.
  const dateCopy = new Date(date);
  dateCopy.setHours(dateCopy.getHours() + hours);
  return dateCopy;
}

export default function Overview() {
  const [records, setRecords] = useState<any>([]);
  const [range, setRange] = useState(30);
  const [endDate, setEndDate] = useState<any>(moment());

  useEffect(() => {
    fetch(`${URL}/records`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
      });
  }, []);

  const filtered = records.filter((item: any) => {
    const date = new Date(item.datetime);
    const now = new Date();
    console.log(endDate);
    now.setDate(endDate.toDate().getDate() - range);

    return date > now && date < endDate.toDate();
  });

  const data = filtered.flatMap((record: any) => {
    const date = new Date(record.datetime);
    return [
      {
        value: record.initial_value,
        bolus: record.bolus,
        time: date.getTime(),
      },
      {
        value: record.after_value,
        time: addHours(date, 2).getTime(),
      },
    ];
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      console.log(payload[0].payload);
      console.log(payload[1]?.payload);

      return (
        <div className="bg-white p-2 border-2 border-gray-300">
          <p>{moment(payload[0].payload.time).format("DD. MM. HH:mm")}</p>
          <p>Cukr: {payload[0].payload.value}</p>
          {payload[0].payload.bolus && <p>Bolus: {payload[0].payload.bolus}</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="font-heading font-medium text-3xl p-4">Přehled</div>
      <Container className="p-2" style={{ paddingBottom: "64px" }}>
        <Grid container spacing={2} style={{ paddingBottom: 8 }}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="range">Časový rozsah</InputLabel>
              <Select
                label="Časový rozsah"
                labelId="range"
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
              >
                <MenuItem value={30}>30 dní</MenuItem>
                <MenuItem value={7}>7 dní</MenuItem>
                <MenuItem value={1}>1 den</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <MobileDatePicker
              label="Koncové datum"
              inputFormat="MM/DD/YYYY"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
        </Grid>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <XAxis
              dataKey="time"
              domain={["auto", "auto"]}
              type="number"
              // Show day and month
              tickFormatter={(unixTime) => moment(unixTime).format("DD. MM.")}
            />
            <YAxis width={20} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <CartesianGrid stroke="#f5f5f5" />
            <Bar dataKey="bolus" barSize={5} fill="#413ea0" name="Bolus" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#ff7300"
              name="Cukr (mmol/L)"
              // colorRendering={}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Datum&nbsp;a&nbsp;čas</TableCell>
                <TableCell align="right">Bolus</TableCell>
                <TableCell align="right">Cukr před</TableCell>
                <TableCell align="right">Cukr po</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered
                .slice(0)
                .reverse()
                .map((row: any) => {
                  const date2 = new Date(row.datetime + "Z");
                  const date = moment(date2.toISOString()).format(
                    "DD. MM. HH:mm"
                  );

                  return (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{date}</TableCell>
                      <TableCell align="right">{row.bolus}</TableCell>
                      <TableCell align="right">{row.initial_value}</TableCell>
                      <TableCell align="right">{row.after_value}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Navigation />
        <AfterDialog />
      </Container>
    </>
  );
}
