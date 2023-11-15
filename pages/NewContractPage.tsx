import * as React from "react";
import { formTemplate } from "../formTemplate";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { useDisclosure } from "@mantine/hooks";
import { DataTable } from "../components/DataTable";
import { Button, Input, Paper, TextInput, Textarea } from "@mantine/core";
import Split from "@uiw/react-split";
import { generate } from "@pdfme/generator";
import { Contract } from "../models/Contract";
import * as template from "../template.json";
import { databox } from "../models/DataBox";

databox.contracts.load().then((x) => {
  console.log("loaded");
});

export const NewContractPage = () => {
  const dbIsCached = localStorage.getItem("db");
  const cachedDb = JSON.parse(localStorage.getItem("db"));
  const [flowOpen, setFlowOpen] = React.useState(!dbIsCached);
  const [data, setData] = React.useState({
    all: dbIsCached ? cachedDb.all : [],
    validData: dbIsCached ? cachedDb.validData : [],
    invalidData: [],
  });
  const [searchInput, setSearchInput] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data.all);
  const [openned, { open, close }] = useDisclosure(false);
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
    const newFnData = {};
    for (let field of formTemplate) {
      let result;
      try {
        if (current) result = field.fn(current, newFnData);
        else result = null;
      } catch (err) {
        console.log("error", field);
        console.log(err);
      } finally {
        newFnData[field.key] = result;
      }
    }
    setCurrentFn(newFnData);
  };

  const getFormValue = (key: string) => {
    console.log("getformvalue for", key);
    if (!current) {
      return "";
    }
    if (currentFn[key]) {
      return currentFn[key];
    }

    if (current[key]) {
      return current[key];
    }

    return "";
  };

  React.useEffect(() => {
    setFilteredData(
      data.all.filter(
        (x) => Object.values(x).join("").toLowerCase().indexOf(searchInput) > -1
      )
    );
    updateFnData(null, null);
  }, [searchInput, data]);
  return (
    <div>
      <ReactSpreadsheetImport
        isOpen={flowOpen}
        onClose={() => {
          setFlowOpen(false);
        }}
        onSubmit={(data, file) => {
          setData(data);
          const dbAsStr = JSON.stringify(data);
          localStorage.setItem("db", dbAsStr);
          setFlowOpen(false);
        }}
        fields={Contract.spreadsheetFields}
      />
      <Split>
        <div
          style={{
            width: "calc(70% - 80px)",
            minWidth: 400,
            padding: 30,
          }}
        >
          <TextInput
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
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
          <div style={{ height: "100%", overflow: "scroll" }}>
            <DataTable
              fields={Contract.spreadsheetFields}
              data={filteredData}
            />
          </div>
        </div>
        <div
          style={{
            width: "calc(20% + 30px)",
            minWidth: 200,
            padding: 20,
          }}
        >
          <Paper title="Formular Contract">
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "scroll",
                maxHeight: "100vh",
              }}
            >
              {formTemplate.map((field, i) => (
                <div key={i} style={{ padding: "0.5rem" }}>
                  <Input.Wrapper description={field.key}>
                    {field.type == "textarea" ? (
                      <Textarea
                        placeholder={field.placeholder}
                        value={getFormValue(field.key)}
                        onChange={(e) =>
                          updateFnData(field.key, e.target.value)
                        }
                      />
                    ) : (
                      <TextInput
                        placeholder={field.placeholder}
                        value={getFormValue(field.key)}
                        variant={field.placeholder ? undefined : "filled"}
                        onChange={(e) =>
                          updateFnData(field.key, e.target.value)
                        }
                      />
                    )}
                  </Input.Wrapper>
                </div>
              ))}
              <Button
                style={{
                  display: "block",
                  margin: "0 auto",
                  marginTop: 50,
                  marginBottom: 50,
                  background: "#5D55FA",
                }}
                variant="filled"
                onClick={() => {
                  let inputs = {};
                  const formKeys = formTemplate.map((x) => x.key);
                  for (let key of formKeys) {
                    if (!current) continue;
                    let field = formTemplate.find((x) => x.key == key);
                    let value;
                    if (field.fn || currentFn[key]) {
                      value = currentFn[key];
                    } else {
                      value = current[key];
                    }

                    inputs[key] = value;
                    if (field.alias) {
                      for (let alias of field.alias) {
                        inputs[alias] = value;
                        if (!inputs[alias]) {
                          inputs[alias] = "";
                        }
                      }
                    }

                    if (!inputs[key]) {
                      inputs[key] = "";
                    }
                  }

                  inputs = [inputs];
                  console.log(inputs);
                  databox.contracts.push({
                    ...current,
                    ...currentFn,
                    ...(inputs[0] as any),
                  });
                  databox.contracts.commit((cb) => {
                    console.log("commited");
                  });
                  generate({ template, inputs } as any).then((pdf) => {
                    const blob = new Blob([pdf.buffer], {
                      type: "application/pdf",
                    });
                    window.open(URL.createObjectURL(blob));
                  });
                }}
              >
                Genereaza contract
              </Button>
            </div>
          </Paper>
        </div>
      </Split>
    </div>
  );
};
