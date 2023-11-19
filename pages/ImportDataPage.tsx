import * as React from "react";
import { Contract } from "../models/Contract";
import { databox } from "../models/DataBox";
import { DataSheetGrid, keyColumn, textColumn } from "react-datasheet-grid";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { Button, Group, Paper, Title } from "@mantine/core";
import { IconTableImport } from "@tabler/icons-react";
import classes from "./stepper.module.css";

export const ImportDataPage: React.FC<any> = ({}) => {
  const columns = Contract.spreadsheetFields.map((x) => ({
    ...keyColumn(x.key, textColumn),
    title: x.key,
    minWidth: 300
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
    <div>
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
        customTheme={{
          components: {
            Button: {
             defaultProps: {
                colorScheme: "blue",
              },
            },
          },
        }}
      />
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
          rightSection={<IconTableImport size={14} />}
          onClick={() => {
            setFlowOpen(true);
          }}
        >
          Actualizeaza date Excel
        </Button>
      </Group>
    </div>
  );
};
