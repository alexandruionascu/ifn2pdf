import { parseAddress } from "./utils";
import { generateWords } from "./utils";

export const formTemplate = [
  {
    key: "NR CONTRACT",
    alias: ["NR CONTRACT1"],
    fn: (row, formData) => {
      return row["NR CONTRACT / DATA"].split("-")[0].trim();
    },
  },
  {
    key: "DIN",
    alias: ["DIN1", "DIN2"],
    break: true,
    fn: (row, formData) => {
      return row["NR CONTRACT / DATA"].split("-")[1].trim();
    },
  },
  {
    key: "NUME",
    alias: ["NUME1"],
  },
  {
    key: "CNP",
  },
  {
    key: "JUDET",
  },
  {
    key: "LOCALITATEA",
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["city"];
    },
  },
  {
    key: "STRADA",
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["street"];
    },
  },
  {
    key: "NUMARUL STRAZII",
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["streetNo"];
    },
  },
  {
    key: "BLOC",
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["block"];
    },
  },
  {
    key: "SCARA",
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["staircase"];
    },
  },
  {
    key: "APARTAMENT",
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["apartment"];
    },
  },
  {
    key: "LEGITIMAT CU",
    alias: ["LEGITIMAT CU1"],
    fn: (_) => "CI",
  },
  {
    key: "SERIE CI",
    alias: ["SERIE CI1"],
    fn: (row, _) => {
      return row["ACT IDENTITATE"].split(".")[0].trim();
    },
  },
  {
    key: "NR CI",
    alias: ["NR CI1"],
    fn: (row, _) => {
      return row["ACT IDENTITATE"].split(".")[1].trim();
    },
  },
  {
    key: "ELIBERAT DE",
    break: true,
  },
  {
    key: "VALOARE IMPRUMUT",
    alias: ["VALOARE IMPRUMUT1", "VALOARE IMPRUMUT2", "VALOARE IMPRUMUT3"],
    placeholder: "Completeaza suma",
    triggers: [
      "SUMA DE RESTITUIT",
      "AM PLATIT SUMA DE",
      "VALOARE IMPRUMUT IN SCRIS",
    ],
  },
  {
    key: "AM PLATIT SUMA DE",
    readonly: true,
    fn: (row, formData) => {
      return formData["VALOARE IMPRUMUT"];
    },
  },
  {
    key: "VALOARE IMPRUMUT IN SCRIS",
    fn: (row, formData) => {
      let value = parseFloat(formData["VALOARE IMPRUMUT"]);
      if (isNaN(value)) {
        value = 0;
      }
      return generateWords(value).replace(/ /g, "").toLocaleUpperCase() + "LEI";
    },
  },
  {
    key: "DATA SCADENTA",
    placeholder: "Completeaza data",
  },
  {
    key: "NR ZILE",
    // data din  data scadenta - contract = nr zile
    // validare daca e duminica
    fn: (row, formData) => {
      return "30";
      //return (new Date(formData["DATA SCADENTA"] - new Date(formData["DIN"]).days;
    },
  },
  {
    key: "COMISION",
    placeholder: "Completeaza comisionul",
    triggers: ["SUMA DE RESTITUIT"],
  },
  {
    key: "SUMA DE RESTITUIT",
    fn: (row, formData) => {
      let comision = parseFloat(formData["COMISION"]);
      let imprumut = parseFloat(formData["VALOARE IMPRUMUT"]);
      if (isNaN(comision)) comision = 0;
      if (isNaN(imprumut)) imprumut = 0;
      return (comision + imprumut).toString();
    },
  },
  {
    key: "GARANTII",
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
    placeholder: "Completeaza",
  },
];
