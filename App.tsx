import * as React from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import type { Template } from "@pdfme/common";
import { Form } from "@pdfme/ui";
import { generate } from "@pdfme/generator";
import { Table } from "@mantine/core";
import { Modal, Button } from "@mantine/core";

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
  console.log(props.data);
  const rows = props.data.map((element, i) => (
    <Table.Tr key={i}>
      {fields.map((field) => (
        <Table.Td>{element[field.key]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Table className="table">
      <Table.Thead>
        <Table.Tr className="table-data">
          {fields.map((f) => (
            <Table.Th key={f.label}>{f.label}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
export const App = () => {
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
  const [modalOpened, { open, close }] = useDisclosure(false); 

  React.useEffect(() => {
    setFilteredData(
      data.all.filter(
        (x) => Object.values(x).join("").toLowerCase().indexOf(searchInput) > -1
      )
    );
    open();
  }, [searchInput]);

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
      <input
        type="text"
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search"
        style={{
          padding: "0.5rem",
          margin: "0.5rem",
          width: "100%",
          textAlign: "center",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      />
      <DataTable data={filteredData} />
    </div>
  );
};
