import * as React from "react";
import { databox } from "../models/DataBox";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { Contract } from "../models/Contract";
import { DataSheetGrid, keyColumn, textColumn } from "react-datasheet-grid";

interface Props {
  inputJson: Object;
  onOutputJson: (output: Object) => void;
}

export const SelectDataStep: React.FC<Props> = ({ inputJson, onOutputJson }) => {
  const [data, setData] = React.useState(databox.contracts.data);
  const [flowOpen, setFlowOpen] = React.useState(false);
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
      />
      <div>
        <div style={{ }}>
          <DataSheetGrid
            addRowsComponent={false}
            value={data}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
};
