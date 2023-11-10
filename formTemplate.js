import { parseAddress } from "./utils";
import { generateWords } from "./utils";

export const formTemplate = [
  {
    key: "NR CONTRACT",
    alias: ["NR CONTRACT1"],
    coords: [0, 0],
    fn: (row, formData) => {
      return row["NR CONTRACT / DATA"].split("-")[0].trim();
    },
  },
  {
    key: "DIN",
    coords: [0, 0],
    alias: ["DIN1", "DIN2"],
    break: true,
    fn: (row, formData) => {
      return row["NR CONTRACT / DATA"].split("-")[1].trim();
    },
  },
  {
    key: "NUME",
    alias: ["NUME1"],
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
    alias: ["LEGITIMAT CU1"],
    coords: [571, 870],
    fn: (_) => "CI",
  },
  {
    key: "SERIE CI",
    alias: ["SERIE CI1"],
    coords: [845, 870],
    fn: (row, _) => {
      return row["ACT IDENTITATE"].split(".")[0].trim();
    },
  },
  {
    key: "NR CI",
    alias: ["NR CI1"],
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
    key: "VALOARE IMPRUMUT",
    alias: ["VALOARE IMPRUMUT1", "VALOARE IMPRUMUT2", "VALOARE IMPRUMUT3"],
    coords: [1285, 945],
    placeholder: "Completeaza suma",
    triggers: [
      "SUMA DE RESTITUIT",
      "AM PLATIT SUMA DE",
      "VALOARE IMPRUMUT IN SCRIS",
    ],
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
    key: "VALOARE IMPRUMUT IN SCRIS",
    coords: [0, 0],
    fn: (row, formData) => {
      return (
        generateWords(
          parseFloat(formData["VALOARE IMPRUMUT"])
        ).toLocaleUpperCase() + " LEI"
      );
    },
  },
  {
    key: "DATA SCADENTA",

    placeholder: "Completeaza data",
    coords: [1005, 1225],
  },
  {
    key: "NR ZILE",
    // data din  data scadenta - contract = nr zile
    // validare daca e duminica
    placeholder: "Completeaza numarul",
    coords: [710, 1225],
    fn: (row, formData) => {
      return "30";
      //return (new Date(formData["DATA SCADENTA"] - new Date(formData["DIN"]).days;
    },
  },
  {
    key: "COMISION",
    placeholder: "Completeaza comisionul",
    coords: [1500, 1225],
    triggers: ["SUMA DE RESTITUIT"],
  },
  {
    key: "SUMA DE RESTITUIT",
    placeholder: "Completeaza suma",
    coords: [1945, 1225],
    fn: (row, formData) => {
      return (parseFloat(formData["COMISION"]) + parseFloat(formData["VALOARE IMPRUMUT"])).toString();
    },
  },
  {
    key: "GARANTII",
    coords: [242, 1375],
    type: "textarea",
    fn: (rows) => {
      /*let garantii = [];
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
      return res;*/
    },
  },
  {
    key: "DISPOZITIE DE PLATA NUMARUL",
    coords: [805, 1686],
    placeholder: "Completeaza",
  },
];
