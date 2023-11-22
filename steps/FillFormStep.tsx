import * as React from "react";
import { IFormTemplate } from "../formTemplates/IFormTemplate";
import { Input, Paper, TextInput, Textarea } from "@mantine/core";
import { DataSheetGrid, keyColumn, textColumn } from "react-datasheet-grid";

interface Props {
  inputJson: Object;
  onOutputJson: (output: Object) => void;
  formTemplate: IFormTemplate<any>;
}

export const FillFormStep: React.FC<Props> = ({
  inputJson,
  onOutputJson,
  formTemplate,
}) => {
  const [formData, setFormData] = React.useState(inputJson);
  const [firstComputed, setFirstComputed] = React.useState(false);

  React.useEffect(() => {
    if (!firstComputed) {
      let newFormData = { ...formData };
      for (let field of formTemplate) {
        let result = newFormData[field.key];
        if (field.fn && !result) {
          try {
            result = field.fn(formData, {});
          } catch (err) {
          } finally {
            newFormData[field.key] = result;
          }
        }
        if (field.pdfKeys) {
          for (let pdfKey of field.pdfKeys) {
            newFormData[pdfKey] = result;
          }
        }
      }
      setFormData(newFormData);
      setFirstComputed(true);
    }
  }, [formData]);

  const updateData = (key: string, newValue: string, vformData) => {
    console.log("update field", key, newValue);
    let field = formTemplate.find((x) => x.key == key);
    let newFormData = { ...vformData };
    if (newValue != null) {
      newFormData[key] = newValue;
      if (field.pdfKeys) {
        console.log("update keys", field.pdfKeys);
        for (let pdfKey of field.pdfKeys) {
          newFormData[pdfKey] = newValue;
        }
      }
    }
    if (field.triggers) {
      for (let triggerKey of field.triggers) {
        let triggerField = formTemplate.find((x) => x.key == triggerKey);
        if (triggerField.fn) {
          let result;
          try {
            result = triggerField.fn(newFormData, {});
          } catch (err) {
          } finally {
            newFormData[triggerKey] = result;
            if (triggerField.pdfKeys) {
              for (let pdfKey of triggerField.pdfKeys) {
                newFormData[pdfKey] = result;
              }
            }
            newFormData = updateData(triggerKey, null, newFormData);
          }
        }
      }
    }
    return newFormData;
  };

  React.useEffect(() => {
    onOutputJson(formData);
  }, [formData]);

  const [sheetData, setSheetData] = React.useState([]);
  return (
    <div>
      <Paper
        shadow="xs"
        p="xl"
        maw={768}
        style={{ display: "block", margin: "0 auto" }}
      >
        {formTemplate.map((field) => {
          let type = field.type ?? "text";

          if (field.type == "hidden") {
            return null;
          }

          return (
            <Input.Wrapper
              description={field.key}
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
              {
                {
                  text: (
                    <TextInput
                      placeholder={field.placeholder}
                      value={formData[field.key]}
                      variant={field.placeholder ? undefined : "filled"}
                      onChange={(e) => {
                        setFormData(
                          updateData(field.key, e.target.value, formData)
                        );
                      }}
                    />
                  ),
                  textarea: (
                    <Textarea
                      placeholder={field.placeholder}
                      value={formData[field.key]}
                      onChange={(e) => {
                        setFormData(
                          updateData(field.key, e.target.value, formData)
                        );
                      }}
                    />
                  ),
                  sheet: (
                    <DataSheetGrid
                      value={sheetData}
                      onChange={(value) => {
                        let newData = updateData(
                          "_OBIECTE",
                          value.map((x) => x["OBIECTE"]) as any,
                          formData
                        );
                        newData = updateData(
                          "_TITLU",
                          value.map((x) => x["TITLU"]) as any,
                          newData
                        );
                        newData = updateData(
                          "_GREUTATE / GR",
                          value.map((x) => x["GREUTATE / GR"]) as any,
                          newData
                        );
                        setFormData(updateData("GARANTII", null, newData));
                        setSheetData(value);
                      }}
                      columns={["OBIECTE", "GREUTATE / GR", "TITLU"].map(
                        (x) => ({
                          ...keyColumn(x, textColumn),
                          title: x,
                          minWidth: 100,
                        })
                      )}
                    />
                  ),
                }[type]
              }
            </Input.Wrapper>
          );
        })}
      </Paper>
    </div>
  );
};
