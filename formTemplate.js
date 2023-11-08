import { parseAddress } from "./utils";
import { generateWords } from "./utils";

export const formTemplate = [
  {
    key: "NR CONTRACT",
    coords: [0, 0],
    fn: (row, formData) => {
      return row["NR CONTRACT / DATA"].split("-")[0].trim();
    },
  },
  {
    key: "DIN",
    coords: [0, 0],
    break: true,
    fn: (row, formData) => {
      return row["NR CONTRACT / DATA"].split("-")[1].trim();
    },
  },
  {
    key: "NUME",
    col: "A",
    coords: [567, 646],
  },
  {
    key: "CNP",
    col: "B",
    letterSpacing: 80,
    coords: [260, 726],
  },
  {
    key: "JUDET",
    col: "E",
    coords: [1890, 725],
  },
  {
    key: "LOCALITATEA",
    coords: [354, 800],
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["city"];
    },
  },
  {
    key: "STRADA",
    coords: [920, 800],
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["street"];
    },
  },
  {
    key: "NUMARUL STRAZII",
    coords: [1320, 800],
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["streetNo"];
    },
  },
  {
    key: "BLOC",
    coords: [0, 0],
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["block"];
    },
  },
  {
    key: "SCARA",
    coords: [0, 0],
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["staircase"];
    },
  },
  {
    key: "APARTAMENT",
    coords: [0, 0],
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["apartment"];
    },
  },
  {
    key: "LEGITIMAT CU",
    coords: [571, 870],
    fn: (_) => "CI",
  },
  {
    key: "SERIE CI",
    coords: [845, 870],
    fn: (row, _) => {
      return row["ACT IDENTITATE"].split(".")[0].trim();
    },
  },
  {
    key: "NR CI",
    coords: [1105, 870],
    fn: (row, _) => {
      return row["ACT IDENTITATE"].split(".")[1].trim();
    },
  },
  {
    key: "ELIBERAT DE",
    coords: [1748, 870],
    break: true,
    col: "D",
  },
  {
    key: "NR ZILE",
    placeholder: "Completeaza numarul",
    coords: [710, 1225],
  },
  {
    key: "DATA SCADENTA",
    placeholder: "Completeaza data",
    coords: [1005, 1225],
  },
  {
    key: "COMISION",
    placeholder: "Completeaza comisionul",
    coords: [1500, 1225],
  },
  {
    key: "SUMA DE RESTITUIT",
    placeholder: "Completeaza suma",
    coords: [1945, 1225],
  },
  {
    key: "GARANTII",
    coords: [242, 1375],
    type: "textarea",
    fn: (rows) => {
      let garantii = [];
      for (let i = 0; i < Math.min(rows.length, 5); i++) {
        garantii.push(
          `${rows[i][colToIdx("I")]} - ${rows[i][colToIdx("K")]} - ${
            rows[i][colToIdx("J")]
          }g`
        );
      }
      let res = garantii.join("\n");
      if (rows.length > 5) {
        res += "\n" + ".............";
      }
      return res;
    },
  },
  {
    key: "DISPOZITIE DE PLATA NUMARUL",
    coords: [805, 1686],
    placeholder: "Completeaza",
  },
  {
    key: "DISPOZITIE DE PLATA DIN",
    coords: [0, 0],
    fn: (rows) => {
      let row = rows[0];
      let idx = colToIdx("G");
      return row[idx].split("-")[1].trim();
    },
  },
  {
    key: "VALOARE IMPRUMUT",
    coords: [1285, 945],
    placeholder: "Completeaza suma",
    triggers: ["AM PLATIT SUMA DE", "AM PLATIT SUMA DE IN SCRIS"]
  },
  {
    key: "AM PLATIT SUMA DE",
    coords: [0, 0],
    readonly: true,
    fn: (row, formData) => {
      return formData["VALOARE IMPRUMUT"];
    },
  },
  {
    key: "AM PLATIT SUMA DE IN SCRIS",
    coords: [0, 0],
    fn: (row, formData) => {
      return generateWords(
        parseFloat(formData["VALOARE IMPRUMUT"])
      ).toLocaleUpperCase();
    },
  },
];
