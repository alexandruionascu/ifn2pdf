import { Button, Paper, Select, Modal } from "@mantine/core";
import { generate } from "@pdfme/generator";
import { multiVariableText, text, rectangle } from "@pdfme/schemas";
import { IconBrowser, IconDownload } from "@tabler/icons-react";
import * as React from "react";

interface Props {
  inputJson: Record<string, any> | Record<string, any>[];
  onOutputJson: (output: any) => void;
  pdfTemplate: any;
}

interface Agency {
  name: string;
  address: string;
  weekdayHours: string;
  weekendHours: string;
}

const AGENCIES: Agency[] = [
  {
    name: "S.C. DOGAR IFN S.R.L. - Calea lui Traian - Casieria 3",
    address: "Str. Calea lui Traian, nr. 2, Ap. 2",
    weekdayHours: "Luni-Vineri 08:00 - 16:00",
    weekendHours: "Sambata 10:00 - 13:00",
  },
  {
    name: "S.C. DOGAR IFN S.R.L. - Victor Babes - Casieria 1",
    address: "Str. Victor Babes nr. 23",
    weekdayHours: "Luni-Vineri 09:00 - 17:00",
    weekendHours: "Sambata 10:00 - 13:00",
  },
];

const STORAGE_KEY = "selected_agency";

export const PDFFillStep: React.FC<Props> = ({
  inputJson,
  onOutputJson,
  pdfTemplate,
}) => {
  const [pdfData, setPdfData] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [fonts, setFonts] = React.useState<
    Record<string, { data: ArrayBuffer; fallback?: boolean }>
  >({});

  // Load selected agency from localStorage
  const [selectedAgency, setSelectedAgency] = React.useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || AGENCIES[0].name;
  });

  // Modal state
  const [showModal, setShowModal] = React.useState(false);
  const [pendingAgency, setPendingAgency] = React.useState<string | null>(null);

  // Load fonts
  React.useEffect(() => {
    const loadFonts = async () => {
      try {
        // Load Source Sans Pro from Google Fonts - has full Romanian diacritic support
        const [regularResponse, boldResponse] = await Promise.all([
          fetch("MyriadPro-Regular.ttf"),
          fetch("MyriadPro-Regular.ttf"),
        ]);

        const [regularBuffer, boldBuffer] = await Promise.all([
          regularResponse.arrayBuffer(),
          boldResponse.arrayBuffer(),
        ]);

        const fontConfig: Record<
          string,
          { data: ArrayBuffer; fallback?: boolean }
        > = {
          SourceSansPro: { data: regularBuffer, fallback: true },
          "SourceSansPro-Bold": { data: boldBuffer },
          // Add aliases for any other font names in your template
          Roboto: { data: regularBuffer },
          "MyriadPro-Regular": { data: regularBuffer },
          "MyriadPro-Bold": { data: boldBuffer },
          "NotoSerifJP-Regular": { data: regularBuffer },
          NotoSerifJP: { data: regularBuffer },
        };

        setFonts(fontConfig);
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
        setError("Error loading fonts");
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  // Save selected agency to localStorage
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedAgency);
  }, [selectedAgency]);

  // Handle agency change with confirmation
  const handleAgencyChange = (value: string | null) => {
    if (value && value !== selectedAgency) {
      setPendingAgency(value);
      setShowModal(true);
    }
  };

  const confirmAgencyChange = () => {
    if (pendingAgency) {
      setSelectedAgency(pendingAgency);
    }
    setShowModal(false);
    setPendingAgency(null);
  };

  const cancelAgencyChange = () => {
    setShowModal(false);
    setPendingAgency(null);
  };

  React.useEffect(() => {
    if (!pdfTemplate || !inputJson || !fontsLoaded) return;

    let objectUrl: string | null = null;
    setError(null);

    try {
      // Get selected agency details
      const agency =
        AGENCIES.find((a) => a.name === selectedAgency) || AGENCIES[0];

      // Get current date and time
      const now = new Date();
      const dateTimeStr = now.toLocaleString("ro-RO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Normalize input to array
      const rows = Array.isArray(inputJson) ? inputJson : [inputJson];

      // Get all field names and types from template
      const templateFieldsMap = new Map<string, any>();
      for (const page of pdfTemplate.schemas ?? []) {
        for (const schema of page ?? []) {
          if (schema.name) {
            templateFieldsMap.set(schema.name, schema);
          }
        }
      }

      // Map each row to PDF inputs
      const pdfInputs = rows.map((row: Record<string, any>) => {
        const inputs: Record<string, any> = {};

        // Add ALL fields from template with proper handling
        templateFieldsMap.forEach((schema, key) => {
          const fieldType = schema.type || "text";

          // Handle different field types
          if (fieldType === "rectangle") {
            // Rectangles don't take input, skip them
            return;
          } else if (fieldType === "multiVariableText") {
            // Check if we have data for this field
            let value = row[key];
            if (value !== undefined && value !== null && value !== "") {
              // Try to parse if it's already JSON, otherwise create JSON
              try {
                if (typeof value === "string" && value.startsWith("[")) {
                  inputs[key] = value; // Already JSON
                } else {
                  inputs[key] = JSON.stringify([{ text: String(value) }]);
                }
              } catch (e) {
                inputs[key] = JSON.stringify([{ text: String(value) }]);
              }
            } else {
              // Empty multiVariableText
              inputs[key] = JSON.stringify([]);
            }
          } else {
            // Regular text or other field types
            let value = row[key] ?? "";

            // Convert to string to preserve full numbers
            if (typeof value === "number") {
              value = value.toString();
            }

            inputs[key] = String(value);
          }
        });

        // Override with agency-related fields
        if (templateFieldsMap.has("DATA SI ORA")) {
          const fieldType = templateFieldsMap.get("DATA SI ORA").type;

          inputs["DATA SI ORA"] =
            fieldType === "multiVariableText"
              ? JSON.stringify([{ text: "" }])
              : "";
        }
        if (templateFieldsMap.has("PROGRAM LUNI VINERI")) {
          const fieldType = templateFieldsMap.get("PROGRAM LUNI VINERI").type;
          inputs["PROGRAM LUNI VINERI"] =
            fieldType === "multiVariableText"
              ? JSON.stringify([{ text: agency.weekdayHours }])
              : agency.weekdayHours;
        }
        if (templateFieldsMap.has("PROGRAM WEEKEND")) {
          const fieldType = templateFieldsMap.get("PROGRAM WEEKEND").type;
          inputs["PROGRAM WEEKEND"] =
            fieldType === "multiVariableText"
              ? JSON.stringify([{ text: agency.weekendHours }])
              : agency.weekendHours;
        }
        if (templateFieldsMap.has("ADRESA AGENTIE")) {
          const fieldType = templateFieldsMap.get("ADRESA AGENTIE").type;
          inputs["ADRESA AGENTIE"] =
            fieldType === "multiVariableText"
              ? JSON.stringify([{ text: agency.address }])
              : agency.address;
        }

        return inputs;
      });

      generate({
        template: pdfTemplate,
        inputs: pdfInputs,
        plugins: {
          text,
          multiVariableText,
          rectangle,
        },
        options: {
          font: fonts,
        },
      } as any)
        .then((pdf: Uint8Array) => {
          const buffer = pdf.buffer.slice(
            pdf.byteOffset,
            pdf.byteOffset + pdf.byteLength,
          );
          objectUrl = URL.createObjectURL(
            new Blob([buffer as any], { type: "application/pdf" }),
          );
          setPdfData(objectUrl);
          setError(null);
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
          setError(`Error generating PDF: ${error.message}`);
        });
    } catch (error: any) {
      console.error("Error preparing PDF data:", error);
      setError(`Error preparing PDF data: ${error.message}`);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pdfTemplate, inputJson, fontsLoaded, fonts, selectedAgency]);

  // Get first row for filename
  const firstRow = Array.isArray(inputJson) ? inputJson[0] : inputJson;

  if (!fontsLoaded) {
    return (
      <Paper
        shadow="xs"
        p="xl"
        maw={768}
        style={{ display: "block", margin: "0 auto" }}
      >
        <div>Se încarcă fonturile...</div>
      </Paper>
    );
  }

  return (
    <div>
      <Modal
        opened={showModal}
        onClose={cancelAgencyChange}
        title="Confirmare schimbare casierie"
        centered
      >
        <div style={{ marginBottom: "1rem" }}>
          Această operație de schimbare a casieriei este destinată{" "}
          <strong>doar pentru administrator</strong>.
        </div>
        <div style={{ marginBottom: "1.5rem" }}>Doriți să continuați?</div>
        <div
          style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
        >
          <Button variant="default" onClick={cancelAgencyChange}>
            Anulează
          </Button>
          <Button onClick={confirmAgencyChange}>Confirmă</Button>
        </div>
      </Modal>

      <Paper
        shadow="xs"
        p="xl"
        maw={768}
        style={{ display: "block", margin: "0 auto" }}
      >
        <Select
          label="Selectează agenția"
          placeholder="Alege o agenție"
          value={selectedAgency}
          onChange={handleAgencyChange}
          data={AGENCIES.map((agency) => ({
            value: agency.name,
            label: agency.name,
          }))}
          style={{
            marginBottom: "1rem",
          }}
        />

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "1rem",
              padding: "1rem",
              background: "#fee",
            }}
          >
            {error}
            <div style={{ marginTop: "0.5rem", fontSize: "0.9em" }}>
              Check browser console for detailed logs
            </div>
          </div>
        )}

        {pdfData && (
          <iframe
            src={pdfData}
            width="100%"
            height="1000px"
            title="PDF preview"
          />
        )}
        <div style={{ display: "flex", marginTop: 20, gap: 16 }}>
          <Button
            size="l"
            onClick={() => {
              if (!pdfData) return;
              const link = document.createElement("a");
              link.href = pdfData;
              link.target = "_blank";
              link.click();
            }}
            rightSection={<IconBrowser size={14} />}
            style={{ margin: "0 auto" }}
          >
            Deschide în nou tab
          </Button>
          <Button
            size="l"
            onClick={() => {
              if (!pdfData) return;
              const link = document.createElement("a");
              link.href = pdfData;
              const filename = `${firstRow?.["NR CONTRACT"] ?? "document"}_${
                firstRow?.["DIN"] ?? ""
              }.pdf`;
              link.download = filename;
              link.click();
            }}
            rightSection={<IconDownload size={14} />}
            style={{ margin: "0 auto" }}
          >
            Descarcă PDF
          </Button>
        </div>
      </Paper>
    </div>
  );
};
