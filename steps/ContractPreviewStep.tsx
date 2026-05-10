import { Button, Modal, Paper, Select } from "@mantine/core";
import * as React from "react";
import {
  AGENCIES,
  AGENCY_STORAGE_KEY,
  getAgencyByName,
} from "../components/agency";
import { ContractHtmlPreview } from "../components/ContractHtmlPreview";

interface Props {
  inputJson: Record<string, any> | null;
  selectedAgency?: string | null;
  onAgencyChange?: (agency: string) => void;
}

export const ContractPreviewStep: React.FC<Props> = ({
  inputJson,
  selectedAgency,
  onAgencyChange,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [pendingAgency, setPendingAgency] = React.useState<string | null>(null);
  const currentAgency = getAgencyByName(selectedAgency).name;

  React.useEffect(() => {
    localStorage.setItem(AGENCY_STORAGE_KEY, currentAgency);
  }, [currentAgency]);

  const handleAgencyChange = (value: string | null) => {
    if (value && value !== currentAgency) {
      setPendingAgency(value);
      setShowModal(true);
    }
  };

  const confirmAgencyChange = () => {
    if (pendingAgency) {
      onAgencyChange?.(pendingAgency);
    }
    setShowModal(false);
    setPendingAgency(null);
  };

  const cancelAgencyChange = () => {
    setShowModal(false);
    setPendingAgency(null);
  };

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

      <Paper shadow="xs" p="xl" mb="md">
        <Select
          label="Selectează agenția"
          placeholder="Alege o agenție"
          value={currentAgency}
          onChange={handleAgencyChange}
          data={AGENCIES.map((agency) => ({
            value: agency.name,
            label: agency.name,
          }))}
        />
      </Paper>

      <ContractHtmlPreview contract={inputJson ?? {}} selectedAgency={currentAgency} />
    </div>
  );
};
