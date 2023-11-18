import * as React from "react";
import { Contract } from "../models/Contract";
import { databox } from "../models/DataBox";
import { DataSheetGrid, keyColumn, textColumn } from "react-datasheet-grid";
import { Button, Group } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import * as ExcelJS from "exceljs";
import classes from "./stepper.module.css";

export const ExportDataPage: React.FC<any> = ({}) => {
  const columns = Contract.spreadsheetFields.map((x) => ({
    ...keyColumn(x.key, textColumn),
    title: x.key,
  }));

  React.useEffect(() => {
    databox.contracts.load().then((dataa) => {
      console.log("loaded", dataa);
      setData(dataa);
    });
  }, []);

  const [data, setData] = React.useState(databox.contracts.data);
  return (
    <div>
      <div>
        <DataSheetGrid
          height={4000}
          rowHeight={50}
          addRowsComponent={false}
          value={data}
          columns={columns}
        />
      </div>
      <Group justify="center" mt="xl" className={classes.bottomGroup}>
        <Button
          style={{ display: "block", margin: "0 auto" }}
          rightSection={<IconDownload size={14} />}
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
          Salveaza date Excel
        </Button>
      </Group>
    </div>
  );
};
