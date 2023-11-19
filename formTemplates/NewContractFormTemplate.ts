import { parseAddress } from "../utils";
import { generateWords } from "../utils";
import { IFieldTemplate, IFormTemplate } from "./IFormTemplate";



export const formTemplate: IFormTemplate<any> = [
  {
    key: "NR CONTRACT",
    pdfKeys: ["NR CONTRACT", "NR CONTRACT1"],
    fn: (row, formData) => {
      return row["NR CONTRACT / DATA"].split("-")[0].trim();
    },
    export: {
      key: "NR CONTRACT / DATA",
      fn: (row) => {
        return `${row["NR CONTRACT"]}-${row["DIN"]}`;
      },
    },
  },
  {
    key: "DIN",
    pdfKeys: ["DIN1", "DIN2"],
    fn: (row, formData) => {
      return row["NR CONTRACT / DATA"].split("-")[1].trim();
    },
  },
  {
    key: "NUME",
    pdfKeys: ["NUME1"],
    export: {
      key: "NUME",
    },
  },
  {
    key: "CNP",
    export: {
      key: "CNP",
    },
  },
  {
    key: "JUDET",
    export: {
      key: "JUDET",
    },
  },
  {
    key: "LOCALITATEA",
    fn: (row, _) => {
      let addr = parseAddress(row["ADRESA"]);
      return addr["city"];
    },
    export: {
      key: "ADRESA",
      fn: (row) => {
        let street = row["STRADA"];
        let bloc = row["BLOC"];
        let scara = row["SCARA"];
        let ap = row["APARTAMENT"];
        let city = row["LOCALITATEA"];
        let streetNo  = row["NUMARUL STRAZII"];
 
        let fulladdr = "";
        if (city) {
          fulladdr += city + ", ";
        }
        if (street) {
          fulladdr += street + " "
        }
        if (streetNo) {
          fulladdr += "NR " + streetNo + " ";
        }

        if (bloc) {
          fulladdr += "BL " + bloc + " "; 
        }

        if (scara) {
          fulladdr += "SC " + scara + " ";
        }
        if (ap) {
          fulladdr += "AP " + ap + " ";
        }
        
        return fulladdr;
      },
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
    pdfKeys: ["LEGITIMAT CU1"],
    fn: (_) => "CI",
  },
  {
    key: "SERIE CI",
    pdfKeys: ["SERIE CI1"],
    fn: (row, _) => {
      return row["ACT IDENTITATE"].split(".")[0].trim();
    },
    export: {
      key: "ACT IDENTITATE",
      fn: (row) => {
        return `${row["SERIE CI"]}.${row["NR CI"]}`;
      },
    },
  },
  {
    key: "NR CI",
    pdfKeys: ["NR CI1"],
    fn: (row, _) => {
      return row["ACT IDENTITATE"].split(".")[1].trim();
    },
  },
  {
    key: "ELIBERAT DE",
    export: {
      key: "ELIBERAT DE",
    },
  },
  {
    key: "VALOARE IMPRUMUT",
    pdfKeys: ["VALOARE IMPRUMUT1", "VALOARE IMPRUMUT2", "VALOARE IMPRUMUT3"],
    placeholder: "Completeaza suma",
    triggers: [
      "SUMA DE RESTITUIT",
      "AM PLATIT SUMA DE",
      "VALOARE IMPRUMUT IN SCRIS",
    ],
    export: {
      key: "VALOARE IMPRUMUT"
    }
  },
  {
    key: "AM PLATIT SUMA DE",
    readonly: true,
    fn: (row, formData) => {
      return row["VALOARE IMPRUMUT"];
    },
  },
  {
    key: "VALOARE IMPRUMUT IN SCRIS",
    fn: (row, formData) => {
      let value = parseFloat(row["VALOARE IMPRUMUT"]);
      if (isNaN(value)) {
        value = 0;
      }
      return generateWords(value).replace(/ /g, "").toLocaleUpperCase() + "LEI";
    },
  },
  {
    key: "DATA SCADENTA",
    placeholder: "Completeaza data",
    export: {
      key: "DATA SCADENTA"
    }
  },
  {
    key: "NR ZILE",
    // data din  data scadenta - contract = nr zile
    // validare daca e duminica
    fn: (row, formData) => {
      return "30";
      //return (new Date(formData["DATA SCADENTA"] - new Date(formData["DIN"]).days;
    },
    export: {
      key: "NR ZILE"
    }
  },
  {
    key: "COMISION",
    placeholder: "Completeaza comisionul",
    triggers: ["SUMA DE RESTITUIT"],
    export: {
      key: "COMISION - RON",
    },
  },
  {
    key: "SUMA DE RESTITUIT",
    fn: (row, formData) => {
      let comision = parseFloat(row["COMISION"]);
      let imprumut = parseFloat(row["VALOARE IMPRUMUT"]);
      if (isNaN(comision)) comision = 0;
      if (isNaN(imprumut)) imprumut = 0;
      return (comision + imprumut).toString();
    },
    export: {
      key: "SUMA DE RESTITUIT"
    }
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
] as const;

type MyConstObjectKeys = keyof typeof formTemplate;