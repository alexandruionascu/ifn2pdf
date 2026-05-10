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
    },
    {
      key: "NR ZILE",
    },
    {
      key: "DATA RESTITUIRII",
    },
    {
      key: "VALOARE COMISION",
    },
    {
      key: "BANI ADUSI",
    },
  ]);


