import { DataBox, DataBoxCollection, DataBoxTable } from "../boxmodel/BoxModel";
import { Contract } from "./Contract";

class IFNDB extends DataBox {
  @DataBoxTable(Contract)
  contracts: DataBoxCollection<Contract>;

  public constructor() {
    super();
  }
}
const databox: IFNDB = new IFNDB();
export { databox };