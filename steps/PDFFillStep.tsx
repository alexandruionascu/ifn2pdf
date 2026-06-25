import { Button, Paper, Select, Modal } from "@mantine/core";
import { IconBrowser, IconDownload } from "@tabler/icons-react";
import * as React from "react";
import { AGENCIES } from "../pdfLayout/agencies.ts";
import { loadAssets } from "../pdfLayout/loadAssets.ts";
import { renderContract } from "../pdfLayout/renderContract.ts";

// `pdfTemplate` is kept in the prop signature for backward compatibility with the
// pages — the new pipeline no longer reads the JSON template.
interface Props {
  inputJson: Record<string, any> | Record<string, any>[];
  onOutputJson: (output: any) => void;
  pdfTemplate?: unknown;
}

const STORAGE_KEY = "selected_agency";

export const PDFFillStep: React.FC<Props> = ({ inputJson, onOutputJson }) => {
  const [pdfData, setPdfData] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [assetsLoaded, setAssetsLoaded] = React.useState(false);
  const [assets, setAssets] = React.useState<{
    basePdf: Uint8Array;
    fonts: { regular: ArrayBuffer; bold: ArrayBuffer };
  } | null>(null);

  const [selectedAgency, setSelectedAgency] = React.useState<string>(() => {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return stored || AGENCIES[0].name;
  });

  const [showModal, setShowModal] = React.useState(false);
  const [pendingAgency, setPendingAgency] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    loadAssets()
      .then((a) => {
        if (cancelled) return;
        setAssets(a);
        setAssetsLoaded(true);
      })
      .catch((e) => {
        if (cancelled) return;
        console.error("Error loading PDF assets:", e);
        setError(`Error loading PDF assets: ${(e as Error).message}`);
        setAssetsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, selectedAgency);
    }
  }, [selectedAgency]);

  const handleAgencyChange = (value: string | null) => {
    if (value && value !== selectedAgency) {
      setPendingAgency(value);
      setShowModal(true);
    }
  };

  const confirmAgencyChange = () => {
    if (pendingAgency) setSelectedAgency(pendingAgency);
    setShowModal(false);
    setPendingAgency(null);
  };

  const cancelAgencyChange = () => {
    setShowModal(false);
    setPendingAgency(null);
  };

  React.useEffect(() => {
    if (!assetsLoaded || !assets || !inputJson) return;

    let objectUrl: string | null = null;
    setError(null);

    const agency = AGENCIES.find((a) => a.name === selectedAgency) || AGENCIES[0];
    const rows = Array.isArray(inputJson) ? inputJson : [inputJson];

    renderContract({
      rows,
      agency,
      basePdfBytes: assets.basePdf,
      fonts: assets.fonts,
    })
      .then((bytes) => {
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        objectUrl = URL.createObjectURL(blob);
        setPdfData(objectUrl);
        setError(null);
      })
      .catch((e) => {
        console.error("Error generating PDF:", e);
        setError(`Error generating PDF: ${(e as Error).message}`);
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [assets, assetsLoaded, inputJson, selectedAgency]);

  const firstRow = Array.isArray(inputJson) ? inputJson[0] : inputJson;

  if (!assetsLoaded) {
    return (
      <Paper shadow="xs" p="xl" maw={768} style={{ display: "block", margin: "0 auto" }}>
        <div>Se încarcă resursele PDF…</div>
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
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <Button variant="default" onClick={cancelAgencyChange}>
            Anulează
          </Button>
          <Button onClick={confirmAgencyChange}>Confirmă</Button>
        </div>
      </Modal>

      <Paper shadow="xs" p="xl" maw={768} style={{ display: "block", margin: "0 auto" }}>
        <Select
          label="Selectează agenția"
          placeholder="Alege o agenție"
          value={selectedAgency}
          onChange={handleAgencyChange}
          data={AGENCIES.map((agency) => ({ value: agency.name, label: agency.name }))}
          style={{ marginBottom: "1rem" }}
        />

        {error && (
          <div style={{ color: "red", marginBottom: "1rem", padding: "1rem", background: "#fee" }}>
            {error}
            <div style={{ marginTop: "0.5rem", fontSize: "0.9em" }}>
              Check browser console for detailed logs
            </div>
          </div>
        )}

        {pdfData && <iframe src={pdfData} width="100%" height="1000px" title="PDF preview" />}
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
              const filename = `${firstRow?.["NR CONTRACT"] ?? "document"}_${firstRow?.["DIN"] ?? ""}.pdf`;
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