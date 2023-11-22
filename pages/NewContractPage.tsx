import * as React from "react";
import { Contract } from "../models/Contract";
import { databox } from "../models/DataBox";
import { Stepper, Button, Group, Title, Center } from "@mantine/core";
import classes from "./stepper.module.css";
import { SelectDataStep } from "../steps/SelectDataStep";
import IDBStorage from "idbstorage";
import { SelectContractStep } from "../steps/SelectContractStep";
import { FillFormStep } from "../steps/FillFormStep";
import { formTemplate } from "../formTemplates/NewContractFormTemplate";
import { PDFFillStep } from "../steps/PDFFillStep";
import contractTemplate from "../pdfTemplates/contractTemplate.json";
import { NoDataStep } from "../steps/NoDataStep";
import { ExportAndSaveStep } from "../steps/ExportAndSaveStep";

const storage = new IDBStorage();

export const NewContractPage = () => {
  const [data, setData] = React.useState([]);
  const [currentOut, setCurrentOut] = React.useState(null);
  const [formData, setFormData] = React.useState({});
  const [baseContract, setBaseContract] = React.useState({});
  const [contractNo, setContractNo] = React.useState<string>("");
  const [firstComputed, setFirstComputed] = React.useState(false);

  React.useEffect(() => {
    if (!firstComputed) {
      storage.getItem("contracts").then((contracts) => {
        setData(JSON.parse(contracts));
      });
      setFirstComputed(true)
    } else {
      let maxContract = 0;
      for (let contract of data) {
        for (let key of Object.keys(contract)) {
          if (key.indexOf("CONTRACT") > -1) {
            if (!contract[key]) continue;
            let nr = contract[key].split("-");
            maxContract = Math.max(maxContract, parseInt(nr));
          }
        }
      }
      setContractNo((maxContract + 1).toString());
    }
  }, [data]);

  React.useEffect(() => {
    setFormData({ ...formData, "NR CONTRACT": contractNo });
  }, [contractNo]);

  const [active, setActive] = React.useState(0);
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  if (data.length == 0) {
    return <NoDataStep />;
  }
  return (
    <div>
      <Stepper
        active={active}
        classNames={{ steps: classes.steps }}
        onStepClick={setActive}
        style={{ width: "100%" }}
      >
        <Stepper.Step
          label="Primul pas"
          description="Alege un contract de referinta"
        >
          <SelectContractStep
            inputJson={data}
            onContractSelect={(contract) => {
              setBaseContract(contract);
              setFormData({ ...contract, "NR CONTRACT": contractNo });
            }}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Al doilea pas"
          description="Completeaza formularul"
        >
          <FillFormStep
            formTemplate={formTemplate}
            onOutputJson={(_formData) => {
              setFormData(_formData);
              setCurrentOut(_formData);
            }}
            inputJson={formData}
          />
        </Stepper.Step>
        <Stepper.Step label="Al treilea pas" description="Descarca PDF">
          <PDFFillStep
            inputJson={currentOut}
            pdfTemplate={contractTemplate}
            onOutputJson={(_) => {
              // do nothing
            }}
          />
        </Stepper.Step>
        <Stepper.Step label="Al patrulea pas" description="Confirma salvarea">
          <ExportAndSaveStep
            formTemplate={formTemplate}
            inputJson={currentOut}
            onOutputJson={() => {}}
          />
        </Stepper.Step>
        <Stepper.Completed>
          <Center>Contractul a fost salvat cu succes.</Center>
        </Stepper.Completed>
      </Stepper>
      <Group justify="center" mt="xl" className={classes.bottomGroup}>
        <Button variant="default" onClick={prevStep}>
          Inapoi
        </Button>
        <Button onClick={nextStep}>Urmatorul pas</Button>
      </Group>
    </div>
  );
};
