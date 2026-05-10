import { Button, Paper } from "@mantine/core";
import { IconBrowser, IconPrinter } from "@tabler/icons-react";
import * as React from "react";
import { buildContractPreviewHtml } from "../utils/contractPreview";

interface Props {
  contract?: Record<string, any> | null;
  selectedAgency?: string | null;
  showActions?: boolean;
  minHeight?: number;
}

const openPreviewWindow = (
  contract: Record<string, any>,
  selectedAgency?: string | null,
  print = false,
) => {
  const html = buildContractPreviewHtml(contract, selectedAgency);
  const previewWindow = window.open("", "_blank", "noopener,noreferrer");

  if (!previewWindow) {
    return;
  }

  previewWindow.document.open();
  previewWindow.document.write(html);
  previewWindow.document.close();

  if (print) {
    previewWindow.onload = () => {
      previewWindow.focus();
      previewWindow.print();
    };
  }
};

export const ContractHtmlPreview: React.FC<Props> = ({
  contract,
  selectedAgency,
  showActions = true,
  minHeight = 960,
}) => {
  const normalizedContract = contract ?? {};
  const html = React.useMemo(
    () => buildContractPreviewHtml(normalizedContract, selectedAgency),
    [normalizedContract, selectedAgency],
  );

  return (
    <div>
      {showActions && (
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <Button
            leftSection={<IconBrowser size={14} />}
            onClick={() => openPreviewWindow(normalizedContract, selectedAgency, false)}
          >
            Deschide în tab nou
          </Button>
          <Button
            variant="default"
            leftSection={<IconPrinter size={14} />}
            onClick={() => openPreviewWindow(normalizedContract, selectedAgency, true)}
          >
            Tipărește / salvează PDF din browser
          </Button>
        </div>
      )}

      <Paper shadow="xs" radius="md" style={{ overflow: "hidden" }}>
        <iframe
          title="Previzualizare contract HTML"
          srcDoc={html}
          style={{ width: "100%", minHeight, border: 0, background: "white" }}
        />
      </Paper>
    </div>
  );
};
