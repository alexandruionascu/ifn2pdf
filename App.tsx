import * as React from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import type { Template } from "@pdfme/common";
import { Form } from "@pdfme/ui";
import { generate } from "@pdfme/generator";
import { Input, Paper, Table, Textarea } from "@mantine/core";
import { Modal, Drawer, Button } from "@mantine/core";
import { formTemplate } from "./formTemplate";
import { TextInput } from "@mantine/core";
import Split from "@uiw/react-split";
import "@mantine/core/styles.css";

// core styles are required for all packages

import * as template from "./template.json";
import { useDisclosure } from "@mantine/hooks";

const domContainer = document.getElementById("container");

// This is initial data.
const inputs = [{ cnp: "1960410375475" }];

/*generate({ template, inputs }).then((pdf) => {

    // Browser
    //const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    //window.open(URL.createObjectURL(blob));
  });
  */

//const form = new Form({ domContainer, template, inputs });

const elements = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];
const fields = [
  {
    label: "NUME",
    key: "NUME",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "CNP",
    key: "CNP",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "ACT IDENTITATE",
    key: "ACT IDENTITATE",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "ELIBERAT DE",
    key: "ELIBERAT DE",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "JUDET",
    key: "JUDET",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "ADRESA",
    key: "ADRESA",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "NR CONTRACT / DATA",
    key: "NR CONTRACT / DATA",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "DATA",
    key: "DATA",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "OBIECTE",
    key: "OBIECTE",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "TITLU",
    key: "TITLU",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "GREUTATE / GRAM",
    key: "GREUTATE / GRAM",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "NR ZILE",
    key: "NR ZILE",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "DATA SCADENTA",
    key: "DATA SCADENTA",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "DATA IESIRII",
    key: "DATA IESIRII",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "VALOARE INITIALA",
    key: "VALOARE INITIALA",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "VALOARE IMPRUMUT - RON",
    key: "VALOARE IMPRUMUT - RON",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "COMISION - RON",
    key: "COMISION - RON",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "SUMA DE RESTITUIT",
    key: "SUMA DE RESTITUIT",
    fieldType: {
      type: "input",
    },
  },
] as const;

function DataTable(props: { data: any[] }) {
  const rows = props.data.map((element, i) => (
    <Table.Tr key={i}>
      {fields.map((field, i) => (
        <Table.Td key={i}>{element[field.key]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Table className="table">
      <Table.Thead>
        <Table.Tr className="table-data">
          {fields.map((f, i) => (
            <Table.Th key={i}>{f.label}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
export const App = () => {
  const [sizes, setSizes] = React.useState([100, "30%"]);

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
      console.log(formTemplate)
      let templateField = formTemplate.find(x => x.key == key);
        console.log(templateField)
      if (templateField && templateField.triggers) {
        for (let trigger of templateField.triggers) {
            let triggerField = formTemplate.find(x => x.key == trigger);
            console.log('update trigger', trigger, templateField )
          let result;
          try {
            result = triggerField.fn(current, newFnData);
            console.log(result);
          } catch (err) {
            console.log(err);
          } finally {
            newFnData = {...newFnData, [trigger]: result };
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
        result = field.fn(current, newFnData);
      } catch (err) {
        console.log(err);
      } finally {
        newFnData[field.key] = result;
      }
    }
    setCurrentFn(newFnData);
  };

  const getFormValue = (key: string) => {
    if (!current) {
      return "";
    }
    if (current[key]) {
      return current[key];
    }

    if (currentFn[key]) {
      return currentFn[key];
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
        fields={fields}
      />
      <Split>
        <div style={{ width: "80%", minWidth: 300 }}>
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
          <div
            style={{ height: "100%", overflow: "scroll", maxHeight: "100vh" }}
          >
            <DataTable data={filteredData} />
          </div>
        </div>
        <div style={{ width: "20%", minWidth: 100 }}>
          <Paper title="Formular Contract" position="right">
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
                }}
                variant="filled"
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
