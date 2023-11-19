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

  React.useEffect(() => {
    if (data.length == 0) {
      storage.getItem("contracts").then((contracts) => {
        setData(JSON.parse(contracts));
      });
    }
  }, [data]);

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
            onOutputJson={(stepData) => {
              setCurrentOut(stepData);
            }}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Al doilea pas"
          description="Completeaza formularul"
        >
          <FillFormStep
            formTemplate={formTemplate}
            onOutputJson={(formData) => {
              setCurrentOut(formData);
            }}
            inputJson={currentOut}
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
