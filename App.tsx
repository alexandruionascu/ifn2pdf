import * as React from "react";
import { Navbar } from "./components/Navbar";
import "./App.css";
import "@mantine/core/styles.css";
import { Contract } from "./models/Contract";
import { MultiTab } from "./components/Multitab";
import { NewContractPage } from "./pages/NewContractPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ExtendContractPage } from "./pages/ExtendContractPage";
import { HomePage } from "./pages/HomePage";
import { DeleteDataPage } from "./pages/DeleteDataPage";
import { ImportDataPage } from "./pages/ImportDataPage";
import { ExportDataPage } from "./pages/ExportDataPage";

// This is initial data.

/*generate({ template, inputs }).then((pdf) => {

    // Browser
    //const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    //window.open(URL.createObjectURL(blob));
  });
  */

//const form = new Form({ domContainer, template, inputs });

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
    label: "GREUTATE / GR",
    key: "GREUTATE / GR",
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

const addContract = (newContract) => {
  let contracts: any = localStorage.getItem("contractss");
  if (!contracts) {
    contracts = [];
  } else {
    console.log(contracts);
    contracts = JSON.parse(newContract);
  }
  contracts.push(newContract);
  localStorage.setItem("contractss", JSON.stringify(contracts));
};

const getContracts = () => {
  let contracts: any = localStorage.getItem("contractss");
  if (!contracts) {
    return [];
  }

  return JSON.parse(contracts);
};

export const App = () => {
  const [pageIdx, setPageIdx] = React.useState(0);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Navbar
        onChange={function (idx: number): void {
          console.log("new page idx", idx);
          setPageIdx(idx);
        }}
      />
      <div style={{ height: "100%", width: "100%", overflow: 'scroll', maxWidth: '100%' }}>
        <MultiTab tabIdx={pageIdx}>
          <HomePage />
          <NewContractPage />
          <ExtendContractPage />
          <div>Iesire contract</div>
          <div>
            <h2>Raport de gesiune</h2>
          </div>
          <div>
            <h2>Nota de contabilitate</h2>
          </div>
          <ImportDataPage />
          <ExportDataPage />
          <div>
            <DeleteDataPage />
          </div>
          <div>
            <SettingsPage />
          </div>
        </MultiTab>
      </div>
    </div>
  );
};
