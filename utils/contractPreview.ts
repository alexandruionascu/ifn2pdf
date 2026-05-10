import { getAgencyByName } from "../components/agency";

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatValue = (value: unknown, fallback = "—") => {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : fallback;
};

const buildAddress = (contract: Record<string, any>) => {
  const parts = [
    contract["LOCALITATEA"],
    contract["STRADA"] && `Str. ${contract["STRADA"]}`,
    contract["NUMARUL STRAZII"] && `nr. ${contract["NUMARUL STRAZII"]}`,
    contract["BLOC"] && `bl. ${contract["BLOC"]}`,
    contract["SCARA"] && `sc. ${contract["SCARA"]}`,
    contract["APARTAMENT"] && `ap. ${contract["APARTAMENT"]}`,
    contract["JUDET"],
  ].filter(Boolean);

  return parts.join(", ");
};

const buildIdentity = (contract: Record<string, any>) => {
  const parts = [
    contract["LEGITIMAT CU"] || contract["ACT IDENTITATE"] ? contract["LEGITIMAT CU"] || "CI" : "",
    contract["SERIE CI"],
    contract["NR CI"],
  ].filter(Boolean);

  if (contract["ELIBERAT DE"]) {
    parts.push(`eliberat de ${contract["ELIBERAT DE"]}`);
  }

  return parts.join(" ");
};

const parseGuarantees = (contract: Record<string, any>) => {
  const objects = Array.isArray(contract["_OBIECTE"]) ? contract["_OBIECTE"] : [];
  const weights = Array.isArray(contract["_GREUTATE / GR"])
    ? contract["_GREUTATE / GR"]
    : [];
  const titles = Array.isArray(contract["_TITLU"]) ? contract["_TITLU"] : [];

  const rows = Array.from(
    { length: Math.max(objects.length, weights.length, titles.length) },
    (_, index) => ({
      obiect: formatValue(objects[index], ""),
      greutate: formatValue(weights[index], ""),
      titlu: formatValue(titles[index], ""),
    }),
  ).filter((row) => row.obiect || row.greutate || row.titlu);

  if (rows.length > 0) {
    return rows;
  }

  return String(contract["GARANTII"] ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [obiect, greutate, titlu] = line.split("-");
      return {
        obiect: formatValue(obiect, ""),
        greutate: formatValue(greutate, ""),
        titlu: formatValue(titlu, ""),
      };
    });
};

export const getContractPreviewFilename = (contract: Record<string, any>) => {
  const nrContract = formatValue(contract?.["NR CONTRACT"], "contract").replace(/\s+/g, "-");
  const contractDate = formatValue(contract?.["DIN"], "fara-data").replace(/\s+/g, "-");
  return `${nrContract}_${contractDate}.html`;
};

export const buildContractPreviewHtml = (
  contract: Record<string, any> = {},
  selectedAgency?: string | null,
) => {
  const agency = getAgencyByName(selectedAgency);
  const guarantees = parseGuarantees(contract);
  const address = buildAddress(contract);
  const identity = buildIdentity(contract);
  const contractNo = formatValue(contract["NR CONTRACT"]);
  const contractDate = formatValue(contract["DIN"] || contract["DATA"]);
  const loanValue = formatValue(contract["VALOARE IMPRUMUT - RON"] || contract["VALOARE IMPRUMUT"]);
  const commission = formatValue(contract["COMISION"]);
  const returnValue = formatValue(contract["SUMA DE RESTITUIT"]);
  const dueDate = formatValue(contract["DATA SCADENTA"] || contract["DATA RESTITUIRII"]);
  const days = formatValue(contract["NR ZILE"]);
  const paidValue = formatValue(contract["AM PLATIT SUMA DE"] || contract["VALOARE IMPRUMUT - RON"]);
  const loanWords = formatValue(contract["VALOARE IMPRUMUT IN SCRIS"]);

  const guaranteeRows = guarantees.length
    ? guarantees
        .map(
          (row, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(row.obiect || "—")}</td>
              <td>${escapeHtml(row.greutate || "—")}</td>
              <td>${escapeHtml(row.titlu || "—")}</td>
            </tr>`,
        )
        .join("")
    : `
      <tr>
        <td>1</td>
        <td colspan="3">Completează obiectele aduse în garanție pentru a vedea contractul final.</td>
      </tr>`;

  return `<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contract ${escapeHtml(contractNo)}</title>
    <style>
      :root {
        color-scheme: light;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 24px;
        background: #f3f4f6;
        color: #111827;
        font-family: "Times New Roman", Georgia, serif;
      }
      .contract {
        max-width: 960px;
        margin: 0 auto;
        background: #fff;
        padding: 40px 48px;
        box-shadow: 0 12px 40px rgba(15, 23, 42, 0.10);
      }
      h1, h2, h3, p { margin: 0; }
      h1 {
        font-size: 28px;
        text-align: center;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
      .subtitle {
        text-align: center;
        margin-bottom: 28px;
        font-size: 15px;
      }
      .meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 24px;
      }
      .meta-card, .section {
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 14px 16px;
      }
      .meta-label {
        display: block;
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .section {
        margin-bottom: 16px;
      }
      .section h2 {
        font-size: 17px;
        margin-bottom: 10px;
      }
      .details {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px 18px;
      }
      .detail {
        font-size: 15px;
        line-height: 1.45;
      }
      .detail strong {
        display: inline-block;
        min-width: 150px;
      }
      .terms {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }
      .term {
        background: #f9fafb;
        border-radius: 10px;
        padding: 12px 14px;
        border: 1px solid #e5e7eb;
      }
      .term span {
        display: block;
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .term strong {
        font-size: 18px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
      }
      th, td {
        border: 1px solid #d1d5db;
        padding: 10px 12px;
        text-align: left;
        vertical-align: top;
        font-size: 14px;
      }
      th {
        background: #f3f4f6;
      }
      .clauses {
        display: grid;
        gap: 10px;
        font-size: 15px;
        line-height: 1.6;
      }
      .footer {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 32px;
        margin-top: 36px;
        padding-top: 20px;
      }
      .signature {
        border-top: 1px solid #111827;
        padding-top: 10px;
        text-align: center;
        min-height: 64px;
      }
      .program {
        color: #374151;
        font-size: 14px;
        margin-top: 4px;
      }
      @media print {
        body { background: white; padding: 0; }
        .contract { box-shadow: none; max-width: none; margin: 0; }
      }
      @media (max-width: 720px) {
        body { padding: 12px; }
        .contract { padding: 20px; }
        .meta, .details, .terms, .footer { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <article class="contract">
      <h1>Contract de împrumut cu garanție</h1>
      <p class="subtitle">Previzualizare HTML pentru verificare și editare rapidă</p>

      <section class="meta">
        <div class="meta-card">
          <span class="meta-label">Nr. contract</span>
          <strong>${escapeHtml(contractNo)}</strong>
        </div>
        <div class="meta-card">
          <span class="meta-label">Data contractului</span>
          <strong>${escapeHtml(contractDate)}</strong>
        </div>
        <div class="meta-card">
          <span class="meta-label">Agenție</span>
          <strong>${escapeHtml(agency.name)}</strong>
          <div class="program">${escapeHtml(agency.address)}</div>
        </div>
        <div class="meta-card">
          <span class="meta-label">Program</span>
          <strong>${escapeHtml(agency.weekdayHours)}</strong>
          <div class="program">${escapeHtml(agency.weekendHours)}</div>
        </div>
      </section>

      <section class="section">
        <h2>Părțile contractante</h2>
        <div class="details">
          <div class="detail"><strong>Creditor:</strong> S.C. DOGAR IFN S.R.L.</div>
          <div class="detail"><strong>Sediu agenție:</strong> ${escapeHtml(agency.address)}</div>
          <div class="detail"><strong>Debitor:</strong> ${escapeHtml(formatValue(contract["NUME"]))}</div>
          <div class="detail"><strong>CNP:</strong> ${escapeHtml(formatValue(contract["CNP"]))}</div>
          <div class="detail"><strong>Act identitate:</strong> ${escapeHtml(formatValue(identity))}</div>
          <div class="detail"><strong>Adresă:</strong> ${escapeHtml(formatValue(address))}</div>
        </div>
      </section>

      <section class="section">
        <h2>Condiții financiare</h2>
        <div class="terms">
          <div class="term">
            <span>Valoare împrumut</span>
            <strong>${escapeHtml(loanValue)} lei</strong>
          </div>
          <div class="term">
            <span>Comision</span>
            <strong>${escapeHtml(commission)} lei</strong>
          </div>
          <div class="term">
            <span>Suma de restituit</span>
            <strong>${escapeHtml(returnValue)} lei</strong>
          </div>
          <div class="term">
            <span>Număr zile</span>
            <strong>${escapeHtml(days)}</strong>
          </div>
          <div class="term">
            <span>Data scadenței</span>
            <strong>${escapeHtml(dueDate)}</strong>
          </div>
          <div class="term">
            <span>Sumă plătită</span>
            <strong>${escapeHtml(paidValue)} lei</strong>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Obiecte aduse în garanție</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Obiect</th>
              <th>Greutate / gr</th>
              <th>Titlu / descriere</th>
            </tr>
          </thead>
          <tbody>${guaranteeRows}</tbody>
        </table>
      </section>

      <section class="section">
        <h2>Clauze sintetice</h2>
        <div class="clauses">
          <p>Prin prezentul contract, S.C. DOGAR IFN S.R.L. acordă debitorului <strong>${escapeHtml(formatValue(contract["NUME"]))}</strong> un împrumut în valoare de <strong>${escapeHtml(loanValue)} lei</strong>, respectiv <strong>${escapeHtml(loanWords)}</strong>.</p>
          <p>Debitorul declară că lasă în garanție bunurile descrise mai sus și se obligă să restituie suma totală de <strong>${escapeHtml(returnValue)} lei</strong> până la data de <strong>${escapeHtml(dueDate)}</strong>.</p>
          <p>Comisionul aferent contractului este de <strong>${escapeHtml(commission)} lei</strong> pentru perioada de <strong>${escapeHtml(days)} zile</strong>.</p>
          <p>Orice ajustare făcută în formular se reflectă imediat în această previzualizare, astfel încât contractul poate fi verificat înainte de salvare sau print.</p>
        </div>
      </section>

      <section class="footer">
        <div class="signature">Semnătură creditor</div>
        <div class="signature">Semnătură debitor</div>
      </section>
    </article>
  </body>
</html>`;
};
