import * as React from "react";
import { IFormTemplate } from "../formTemplates/IFormTemplate";
import { Contract } from "../models/Contract";
import { DataSheetGrid, keyColumn, textColumn } from "react-datasheet-grid";
import { databox } from "../models/DataBox";
import { Center, Switch } from "@mantine/core";

interface Props {
  inputJson: Object[];
  onOutputJson: (output: Object) => void;
  formTemplate: IFormTemplate<any>;
}

export const ExportAndSaveStep: React.FC<Props> = ({
  inputJson,
  onOutputJson,
  formTemplate,
}) => {
  const [exportEntry, setExportEntry] = React.useState({});
  React.useEffect(() => {
    const newExportEntry = { ...exportEntry };
    for (let field of formTemplate) {
      if (!field.export) continue;
      let result = inputJson[field.key];
      if (field.export.fn) {
        try {
          result = field.export.fn(inputJson);
        } catch (err) {
          console.log(err);
        }
      }
      newExportEntry[field.export.key] = result;
    }
    setExportEntry(newExportEntry);
  }, [inputJson]);
  const columns = Contract.spreadsheetFields.map((x) => ({
    ...keyColumn(x.key, textColumn),
    title: x.key,
    minWidth: 300,
  }));

  React.useEffect(() => {
    databox.contracts.load().then((dataa) => {
      setData(dataa);
    });
  }, []);

  const [data, setData] = React.useState(databox.contracts.data);
  const [err, setErr] = React.useState("Apasa aici pentru a salva.");
  return (
    <div>
      <Center p="xl">
        <Switch
          checked={err == null ? true : false}
          label="Confirma datele"
          onClick={() => {
            databox.contracts.add(exportEntry as any);
            databox.contracts.commit(() => {
                setErr(null);
            })
  
          }}
          error={err}
        />
      </Center>
      <DataSheetGrid
        height={4000}
        rowHeight={50}
        addRowsComponent={false}
        value={[exportEntry]}
        columns={columns}
      />
    </div>
  );
};
