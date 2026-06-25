import { IFieldTemplate, IFormTemplate } from "./IFormTemplate";
import { formTemplate as newContractFormTemplate } from "./NewContractFormTemplate";
import { Type, Static } from '@sinclair/typebox';

export const formTemplate: IFormTemplate<any> = newContractFormTemplate
  .map((x) => {
    let clone = JSON.parse(JSON.stringify(x));
    //clone.type = "hidden";
    return clone;
  })
  .concat([
    {
      key: "DATA INCEPERII PRELUNGIRII",
      pdfKeys: ["DATA PRELUNGIRII"],
    },
    {
      key: "NR ZILE",
      pdfKeys: ["NR ZILE PREL"],
    },
    {
      key: "DATA RESTITUIRII",
      pdfKeys: ["DATA RESTITUIRII PRELUNGIRE"],
    },
    {
      key: "VALOARE COMISION",
      pdfKeys: ["VALOARE COMISION PREL"],
    },
    {
      key: "BANI ADUSI",
    },
  ]);
