import * as React from "react";
import { databox } from "../models/DataBox";
import { Button, Text, Title } from "@mantine/core";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { Contract } from "../models/Contract";
import * as ExcelJS from "exceljs";
import {
  DataSheetGrid,
  checkboxColumn,
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
      <hr style={{ padding: "1rem" }} />
      <Title order={3}>Contracte</Title>
      <Button
        onClick={() => {
          setFlowOpen(true);
        }}
      >
        Actualizeaza .xls pentru contracte
      </Button>
      <br />

      <ReactSpreadsheetImport
        isOpen={flowOpen}
        onClose={() => {
          setFlowOpen(false);
        }}
        onSubmit={(data, file) => {
          console.log(data, file);
          databox.contracts.importFromJSONList(data.validData, (done) => {
            setData(data.validData as any);
            setFlowOpen(false);
          });
        }}
        fields={Contract.spreadsheetFields}
      />
      <div>
        <div style={{ padding: "1.25rem", maxWidth: "85%" }}>
          <DataSheetGrid
            addRowsComponent={false}
            value={data}
            columns={columns}
          />
        </div>
      </div>
      <Title order={2}>Export</Title>
      <Button
        onClick={() => {
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Sheet1");

          // Add headers
          const headers = Contract.spreadsheetFields.map((x) => x.key);
          sheet.addRow(headers);

          // Add data
          databox.contracts.data.forEach((item) => {
            const row = [];
            headers.forEach((header) => {
              row.push(item[header]);
            });
            sheet.addRow(row);
          });

          workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const dateTimeString = new Date()
              .toLocaleString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
              .replace(/[\/,:\s]/g, "_");

            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${dateTimeString}.xls`;
            anchor.click();
            window.URL.revokeObjectURL(url);
          });
        }}
      >
        Salveaza contracte in format .xls
      </Button>
    </div>
  );
};
