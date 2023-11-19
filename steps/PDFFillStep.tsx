import { Button, Paper } from "@mantine/core";
import { generate } from "@pdfme/generator";
import { IconDownload } from "@tabler/icons-react";
import * as React from "react";

interface Props {
  inputJson: Object[];
  onOutputJson: (output: Object) => void;
  pdfTemplate: any;
}

export const PDFFillStep: React.FC<Props> = ({
  inputJson,
  onOutputJson,
  pdfTemplate,
}) => {
  const template = pdfTemplate;
  let inputs = {};
  for (let pdfKey of template.columns) {
    inputs[pdfKey] = inputJson[pdfKey] ?? "";
  }
  inputs = [inputs];
  const [pdfData, setPdfData] = React.useState(null);
  React.useEffect(() => {
    if (pdfData) return;
    generate({ template, inputs } as any).then((pdf) => {
      const blob = new Blob([pdf.buffer], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      setPdfData(url);
    });
  }, [inputJson]);

  return (
    <div>
      <Paper
        shadow="xs"
        p="xl"
        maw={768}
        style={{ display: "block", margin: "0 auto" }}
      >
        <Button
          size="l"
          onClick={() => {
            let tempLink = document.createElement("a");
            tempLink.href = pdfData;
            let filename = `${inputJson["NR CONTRACT"]}_${inputJson["DIN"]}.pdf`;
            tempLink.setAttribute("download", filename);
            tempLink.click();
          }}
          rightSection={<IconDownload size={14} />}
          style={{ display: "block", margin: "0 auto", marginBottom: "1rem" }}
        >
          Descarca PDF
        </Button>
        {<iframe src={pdfData} width={"100%"} height={"1000px"} />}
      </Paper>
    </div>
  );
};
