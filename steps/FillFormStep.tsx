import * as React from "react";
import { IFormTemplate } from "../formTemplates/IFormTemplate";
import { Input, Paper, TextInput, Textarea } from "@mantine/core";

interface Props {
  inputJson: Object[];
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
        if (field.fn) {
          let result;
          try {
            result = field.fn(formData, {});
          } catch (err) {
          } finally {
            newFormData[field.key] = result;
          }
        }
        setFormData(newFormData);
        setFirstComputed(true);
      }
    }
  }, [formData]);

  const updateData = (key: string, newValue: string, vformData) => {
    console.log('update field', key, newValue)
    let field = formTemplate.find(x => x.key == key);
    let newFormData = { ...vformData };
    if (newValue) {
        newFormData[key] = newValue;
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
            newFormData = {...newFormData, [triggerKey]: result};
            console.log('fn trigger', triggerKey, result, newFormData)
            newFormData = updateData(triggerKey, null, newFormData);
          }
        }
      }
    }

    return newFormData;
  };
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
                          updateData(field.key, e.target.value, formData )
                        );
                      }}
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
