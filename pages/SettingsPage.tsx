import * as React from "react";
import { databox } from "../models/DataBox";
import { Button, Text, Title } from "@mantine/core";
import { Contract } from "../models/Contract";
import {
  textColumn,
  keyColumn,
} from "react-datasheet-grid";
import "react-datasheet-grid/dist/style.css";

export const SettingsPage = () => {
  const columns = Contract.spreadsheetFields.map((x) => ({
    ...keyColumn(x.key, textColumn),
    title: x.key,
  }));

  const [flowOpen, setFlowOpen] = React.useState(false);
  React.useEffect(() => {
    databox.contracts.load().then((dataa) => {
      console.log("loaded", dataa);
      setData(dataa);
    });
  }, []);

  const [data, setData] = React.useState(databox.contracts.data);
  return (
    <div style={{ padding: "1.25rem" }}>
      <Title order={2}>Setari</Title>
    </div>
  );
};
