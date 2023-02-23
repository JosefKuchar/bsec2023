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
import Navigation from "./Navigation";
import { useEffect, useState } from "react";
import { URL } from "./config";
import moment from "moment";

function addHours(date: any, hours: number) {
  // 👇 Make copy with "Date" constructor.
  const dateCopy = new Date(date);
  dateCopy.setHours(dateCopy.getHours() + hours);
  return dateCopy;
}

export default function Overview() {
  const [records, setRecords] = useState<any>([]);

  useEffect(() => {
    fetch(`${URL}/records`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
      });
  }, []);

  const data = records
    .filter((item: any, index: number) => index < 14)
    .flatMap((record: any) => {
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

  return (
    <>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={data}>
          <XAxis
            dataKey="time"
            domain={["auto", "auto"]}
            type="number"
            tickFormatter={(unixTime) => moment(unixTime).format("HH:mm Do")}
          />
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          <CartesianGrid stroke="#f5f5f5" />
          <Bar dataKey="bolus" barSize={5} fill="#413ea0" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ff7300"
            // colorRendering={}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <Navigation />
    </>
  );
}
