import * as React from "react";
import { DataTable } from "../components/DataTable";
import { Contract } from "../models/Contract";
import { TextInput } from "@mantine/core";
import { formTemplate } from "../formTemplate";

interface Props {
  inputJson: Object[];
  onContractSelect: (output: Object) => void;
}

export const SelectContractStep: React.FC<Props> = ({
    inputJson,
    onContractSelect,
}) => {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [data, setData] = React.useState(inputJson);
  const [searchInput, setSearchInput] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);
  // table data
  const current = filteredData.length > 0 ? filteredData[0] : null;
  // computed data
  const [currentFn, setCurrentFn] = React.useState({});


  const updateFnData = (key: string, newValue: string) => {
    if (key) {
      let newFnData = { ...currentFn, [key]: newValue };
      let templateField = formTemplate.find((x) => x.key == key);
      if (templateField && templateField.triggers) {
        for (let trigger of templateField.triggers) {
          let triggerField = formTemplate.find((x) => x.key == trigger);
          console.log("update trigger", trigger, templateField);
          let result;
          try {
            result = triggerField.fn(current, newFnData);
          } catch (err) {
            console.log(err);
          } finally {
            newFnData = { ...newFnData, [triggerField.key]: result };
          }
        }
      }
      setCurrentFn(newFnData);
      return;
    }
  };
  React.useEffect(() => {
    setFilteredData(
      data.filter(
        (x) => Object.values(x).join("").toLowerCase().indexOf(searchInput) > -1
      )
    );
    updateFnData(null, null);
    setSelectedIdx(0);
  }, [searchInput, data]);

  React.useEffect(() => {
    if (filteredData.length > 0) {
      onContractSelect(filteredData[selectedIdx]);
    }
  }, [selectedIdx, filteredData]);

  return (
    <div style={{ padding: "1rem" }}>
      <TextInput
        type="text"
        onChange={(e) => setSearchInput(e.target.value.toLocaleLowerCase())}
        placeholder="Search"
        style={{
          width: "100%",
          display: "block",
          margin: "0 auto",
          padding: "0.5rem",
          textAlign: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      />
      <DataTable
        selectedIdx={selectedIdx}
        onSelectChange={(newIdx) => setSelectedIdx(newIdx)}
        fields={Contract.spreadsheetFields}
        data={filteredData}
      />
    </div>
  );
};
