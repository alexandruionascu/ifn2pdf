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

const formatLineValue = (value: unknown, fallback = "________________") => {
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

  const contractNo = formatLineValue(contract["NR CONTRACT"]);
  const contractDate = formatLineValue(contract["DIN"] || contract["DATA"]);
  const debtorName = formatLineValue(contract["NUME"]);
  const cnp = formatLineValue(contract["CNP"]);
  const county = formatLineValue(contract["JUDET"]);
  const locality = formatLineValue(contract["LOCALITATEA"]);
  const street = formatLineValue(contract["STRADA"]);
  const streetNumber = formatLineValue(contract["NUMARUL STRAZII"]);
  const building = formatLineValue(contract["BLOC"]);
  const staircase = formatLineValue(contract["SCARA"]);
  const apartment = formatLineValue(contract["APARTAMENT"]);
  const identityType = formatLineValue(contract["LEGITIMAT CU"] || contract["ACT IDENTITATE"]);
  const identitySeries = formatLineValue(contract["SERIE CI"]);
  const identityNumber = formatLineValue(contract["NR CI"]);
  const issuedBy = formatLineValue(contract["ELIBERAT DE"]);

  const loanValue = formatLineValue(contract["VALOARE IMPRUMUT - RON"] || contract["VALOARE IMPRUMUT"]);
  const days = formatLineValue(contract["NR ZILE"]);
  const dueDate = formatLineValue(contract["DATA SCADENTA"] || contract["DATA RESTITUIRII"]);
  const commissionPercentDay = formatLineValue(contract["COMISION PROCENT ZI"]);
  const commission = formatLineValue(contract["COMISION"] || contract["COMISION - RON"] || contract["VALOARE COMISION"]);
  const returnValue = formatLineValue(contract["SUMA DE RESTITUIT"]);
  const paidValue = formatLineValue(contract["AM PLATIT SUMA DE"] || contract["VALOARE IMPRUMUT - RON"] || contract["VALOARE IMPRUMUT"]);
  const receiptValue = formatLineValue(contract["SUMA DE RESTITUIT"] || contract["BANI ADUSI"]);
  const paymentOrderNo = formatLineValue(contract["DISPOZITIE DE PLATA NUMARUL"]);
  const receiptOrderNo = formatLineValue(contract["INCASARE NR CONTRACT"]);
  const loanWords = formatLineValue(contract["VALOARE IMPRUMUT IN SCRIS"]);
  const extensionStartDate = formatLineValue(contract["DATA INCEPERII PRELUNGIRII"], "");
  const extensionDueDate = formatLineValue(contract["DATA RESTITUIRII"], "");
  const extensionDays = formatLineValue(contract["NR ZILE"], "");
  const extensionCommission = formatLineValue(contract["VALOARE COMISION"] || contract["COMISION"], "");
  const extensionReturnValue = formatLineValue(contract["SUMA DE RESTITUIT"], "");
  const extensionCommissionPercent = formatLineValue(contract["COMISION PROCENT ZI"], "");

  const guaranteeLines = Array.from({ length: Math.max(6, guarantees.length) }, (_, index) => {
    const row = guarantees[index];
    const text = row
      ? [
          row.obiect || "",
          row.greutate ? `${row.greutate} gr` : "",
          row.titlu || "",
        ]
          .filter(Boolean)
          .join(" / ")
      : "";

    return `
      <tr>
        <td class="line-no">${index + 1}.</td>
        <td class="line-cell">${escapeHtml(text)}</td>
      </tr>`;
  }).join("");

  const extensionSeed = [
    {
      bf: formatLineValue(contract["INCASARE NR CONTRACT"], ""),
      start: extensionStartDate,
      days: extensionDays,
      due: extensionDueDate,
      percent: extensionCommissionPercent,
      commission: extensionCommission,
      total: extensionReturnValue,
    },
  ].filter((row) => Object.values(row).some(Boolean));

  while (extensionSeed.length < 3) {
    extensionSeed.push({
      bf: "",
      start: "",
      days: "",
      due: "",
      percent: "",
      commission: "",
      total: "",
    });
  }

  const extensionRows = extensionSeed
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.bf)}</td>
          <td>${escapeHtml(row.start)}</td>
          <td>${escapeHtml(row.days)}</td>
          <td>${escapeHtml(row.due)}</td>
          <td>${escapeHtml(row.percent)}</td>
          <td>${escapeHtml(row.commission)}</td>
          <td>${escapeHtml(row.total)}</td>
          <td></td>
          <td></td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contract ${escapeHtml(contractNo)}</title>
    <style>
      /* PAGE_STYLE */
      @page {
        size: A4;
        margin: 10mm;
      }
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 12px;
        background: #ffffff;
        color: #000000;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11px;
        line-height: 1.25;
      }
      .contract {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 8mm 9mm 10mm;
        background: #ffffff;
        border: 1px solid #000000;
      }
      h1,
      h2,
      p {
        margin: 0;
      }
      .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8mm;
        align-items: start;
      }
      .header-box {
        min-height: 44mm;
      }
      .header-box.right {
        text-align: right;
      }
      .company-name,
      .title,
      .section-title {
        font-weight: 700;
      }
      .company-name,
      .program-title {
        font-size: 12px;
        text-transform: uppercase;
      }
      .header-line,
      .program-line,
      .text-line {
        margin-top: 2px;
      }
      .title-wrap {
        margin-top: 6mm;
        text-align: center;
      }
      .title {
        font-size: 15px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .contract-no {
        margin-top: 4mm;
        text-align: center;
      }
      .section {
        margin-top: 4mm;
      }
      .section-title {
        margin-bottom: 2mm;
        text-transform: uppercase;
      }
      .party-block {
        margin-top: 2mm;
      }
      .party-title {
        font-weight: 700;
        margin-bottom: 1mm;
      }
      .fill {
        display: inline-block;
        min-width: 30mm;
        border-bottom: 1px solid #000000;
        padding: 0 1mm 1px;
        vertical-align: baseline;
      }
      .fill.short {
        min-width: 18mm;
      }
      .fill.medium {
        min-width: 28mm;
      }
      .fill.long {
        min-width: 55mm;
      }
      .fill.full {
        width: 100%;
        min-width: 0;
      }
      .line-row {
        display: flex;
        flex-wrap: wrap;
        gap: 2mm;
        align-items: baseline;
        margin-top: 1.5mm;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 2mm;
      }
      .table th,
      .table td {
        border: 1px solid #000000;
        padding: 2mm 1.5mm;
        vertical-align: top;
        text-align: left;
      }
      .table th {
        font-weight: 700;
      }
      .compact th,
      .compact td {
        padding: 1.5mm 1.2mm;
        font-size: 10px;
      }
      .center {
        text-align: center;
      }
      .guarantee-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 2mm;
      }
      .guarantee-table td {
        padding: 2mm 1mm 1mm;
        border-bottom: 1px solid #000000;
      }
      .line-no {
        width: 8mm;
        vertical-align: top;
      }
      .line-cell {
        height: 7mm;
      }
      .sign-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8mm;
        margin-top: 2mm;
      }
      .signature-box {
        min-height: 18mm;
      }
      .signature-line {
        margin-top: 8mm;
        border-top: 1px solid #000000;
        text-align: center;
        padding-top: 1mm;
      }
      .subtle-gap {
        margin-top: 3mm;
      }
      .voucher {
        margin-top: 3mm;
      }
      .voucher-body {
        padding: 0;
      }
      .voucher-row {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 1.3mm;
        margin-top: 1.2mm;
      }
      .voucher-row:first-child {
        margin-top: 0;
      }
      .voucher-bottom {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8mm;
        margin-top: 2mm;
      }
      .voucher-sign {
        min-height: 14mm;
      }
      .voucher-sign-line {
        margin-top: 8mm;
        border-top: 1px solid #000000;
        text-align: center;
        padding-top: 1mm;
      }
      .voucher-fill {
        display: inline-block;
        border-bottom: 1px solid #000000;
        min-width: 16mm;
        padding: 0 1mm 1px;
      }
      .voucher-fill.medium {
        min-width: 28mm;
      }
      .voucher-fill.long {
        min-width: 60mm;
      }
      .voucher-fill.xlong {
        min-width: 90mm;
      }
      @media print {
        body {
          padding: 0;
          background: #ffffff;
        }
        .contract {
          border: none;
          margin: 0;
          width: auto;
          min-height: auto;
          padding: 0;
        }
      }
      @media (max-width: 900px) {
        body {
          padding: 8px;
        }
        .contract {
          width: 100%;
          min-height: auto;
          padding: 10mm 8mm;
        }
        .two-col,
        .sign-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <article class="contract">
      <!-- HEADER -->
      <div class="two-col">
        <div class="header-box">
          <div class="company-name">S.C. DOGAR IFN S.R.L.</div>
          <div class="header-line">Adresă: ${escapeHtml(agency.address || "________________")}</div>
          <div class="header-line">Localitate: <span class="fill medium"></span></div>
          <div class="header-line">J35/_____/____</div>
          <div class="header-line">C.U.I. ____________</div>
        </div>
        <div class="header-box right">
          <div class="program-title">Program de lucru</div>
          <div class="program-line">${escapeHtml(agency.weekdayHours || "Luni-Vineri __________")}</div>
          <div class="program-line">${escapeHtml(agency.weekendHours || "Sâmbătă __________")}</div>
          <div class="program-line">Telefon: <span class="fill short"></span></div>
        </div>
      </div>

      <div class="title-wrap">
        <div class="title">Contract de împrumut cu amanet</div>
        <div class="contract-no">
          Nr. <span class="fill short">${escapeHtml(contractNo)}</span>
          din <span class="fill medium">${escapeHtml(contractDate)}</span>
        </div>
      </div>

      <!-- CLIENT_SECTION -->
      <section class="section">
        <div class="section-title">Între:</div>

        <div class="party-block">
          <div class="party-title">1. Creditor</div>
          <div class="text-line">
            S.C. DOGAR IFN S.R.L., cu sediul de lucru în ${escapeHtml(agency.address || "________________")},
            reprezentată prin d-na Dogar Adelina Nicoleta.
          </div>
        </div>

        <div class="party-block">
          <div class="party-title">2. Debitor</div>
          <div class="line-row">
            <span>Nume și prenume</span>
            <span class="fill long">${escapeHtml(debtorName)}</span>
            <span>CNP</span>
            <span class="fill medium">${escapeHtml(cnp)}</span>
          </div>
          <div class="line-row">
            <span>Domiciliat în județul</span>
            <span class="fill medium">${escapeHtml(county)}</span>
            <span>loc.</span>
            <span class="fill medium">${escapeHtml(locality)}</span>
          </div>
          <div class="line-row">
            <span>str.</span>
            <span class="fill long">${escapeHtml(street)}</span>
            <span>nr.</span>
            <span class="fill short">${escapeHtml(streetNumber)}</span>
            <span>bl.</span>
            <span class="fill short">${escapeHtml(building)}</span>
            <span>sc.</span>
            <span class="fill short">${escapeHtml(staircase)}</span>
            <span>ap.</span>
            <span class="fill short">${escapeHtml(apartment)}</span>
          </div>
          <div class="line-row">
            <span>Legitimat cu</span>
            <span class="fill short">${escapeHtml(identityType)}</span>
            <span>seria</span>
            <span class="fill short">${escapeHtml(identitySeries)}</span>
            <span>nr.</span>
            <span class="fill medium">${escapeHtml(identityNumber)}</span>
            <span>eliberat de</span>
            <span class="fill long">${escapeHtml(issuedBy)}</span>
          </div>
        </div>
      </section>

      <!-- LOAN_SECTION -->
      <section class="section">
        <table class="table compact">
          <thead>
            <tr>
              <th>Valoare împrumut</th>
              <th>Nr. zile</th>
              <th>Data scadență</th>
              <th>Comision %/zi</th>
              <th>Comision</th>
              <th>Suma de restituit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${escapeHtml(loanValue)}</td>
              <td>${escapeHtml(days)}</td>
              <td>${escapeHtml(dueDate)}</td>
              <td>${escapeHtml(commissionPercentDay)}</td>
              <td>${escapeHtml(commission)}</td>
              <td>${escapeHtml(returnValue)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ITEMS_SECTION -->
      <section class="section">
        <div class="section-title">Garanții / obiecte amanetate</div>
        <table class="guarantee-table">
          <tbody>${guaranteeLines}</tbody>
        </table>
      </section>

      <!-- CLAUSES_SECTION -->
      <section class="section">
        <div class="text-line">
          Debitorul declară că lasă în amanet bunurile descrise mai sus, iar creditorul acordă împrumutul menționat,
          cu obligația restituirii sumei totale până la data scadenței înscrisă în prezentul formular.
        </div>
      </section>

      <section class="section" style="margin-top: 8mm;">
        <div class="voucher">
          <div class="voucher-body">
            <div class="voucher-row">
              <span><strong>Disp. de plată nr.</strong></span>
              <span class="voucher-fill medium">${escapeHtml(paymentOrderNo)}</span>
              <span><strong>din</strong></span>
              <span class="voucher-fill medium">${escapeHtml(contractDate)}</span>
              <span>beneficiarul plății</span>
              <span class="voucher-fill xlong">${escapeHtml(debtorName)}</span>
            </div>
            <div class="voucher-row">
              <span class="voucher-fill xlong"></span>
              <span>având act de identitate</span>
              <span class="voucher-fill">${escapeHtml(identityType)}</span>
              <span>seria</span>
              <span class="voucher-fill">${escapeHtml(identitySeries)}</span>
              <span>nr.</span>
              <span class="voucher-fill medium">${escapeHtml(identityNumber)}</span>
              <span>. Suma platita</span>
              <span class="voucher-fill medium">${escapeHtml(paidValue)}</span>
              <span>Lei ,</span>
            </div>
            <div class="voucher-row">
              <span>adica</span>
              <span class="voucher-fill xlong">${escapeHtml(loanWords)}</span>
              <span>reprezentând valoarea contractului de amanet nr</span>
              <span class="voucher-fill medium">${escapeHtml(contractNo)}</span>
            </div>
            <div class="voucher-row">
              <span>din</span>
              <span class="voucher-fill medium">${escapeHtml(contractDate)}</span>
              <span>.</span>
            </div>
            <div class="voucher-bottom">
              <div class="voucher-sign" style="margin-top: -3mm;">
                <div>Semnătură casier</div>
                <div class="voucher-sign-line"></div>
              </div>
              <div class="voucher-sign">
                <div class="voucher-row" style="justify-content:flex-end; margin-top:0;">
                  <span>Am primit suma de</span>
                  <span class="voucher-fill medium">${escapeHtml(paidValue)}</span>
                  <span>Lei</span>
                </div>
                <div class="voucher-sign-line">Semnatura client</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="voucher">
          <div class="voucher-body">
            <div class="voucher-row">
              <span><strong>Disp. de încasare nr.</strong></span>
              <span class="voucher-fill medium">${escapeHtml(receiptOrderNo)}</span>
              <span><strong>din</strong></span>
              <span class="voucher-fill medium">${escapeHtml(contractDate)}</span>
              <span>.</span>
            </div>
            <div class="voucher-row">
              <span><strong>Nume:</strong></span>
              <span class="voucher-fill xlong">${escapeHtml(debtorName)}</span>
            </div>
            <div class="voucher-row">
              <span><strong>CNP</strong></span>
              <span class="voucher-fill xlong">${escapeHtml(cnp)}</span>
              <span>având act de identitate</span>
              <span class="voucher-fill medium">${escapeHtml(identityType)}</span>
              <span>seria</span>
              <span class="voucher-fill">${escapeHtml(identitySeries)}</span>
              <span>nr.</span>
              <span class="voucher-fill medium">${escapeHtml(identityNumber)}</span>
            </div>
            <div class="voucher-row">
              <span>Reprezentând valoarea contractului nr.</span>
              <span class="voucher-fill medium">${escapeHtml(contractNo)}</span>
              <span>din</span>
              <span class="voucher-fill medium">${escapeHtml(contractDate)}</span>
              <span>. Am incasat suma de</span>
              <span class="voucher-fill medium">${escapeHtml(receiptValue)}</span>
              <span>Lei</span>
            </div>
            <div class="voucher-row">
              <span>adică</span>
              <span class="voucher-fill xlong">${escapeHtml(loanWords)}</span>
            </div>
            <div class="voucher-bottom">
              <div class="voucher-sign">
                <div>Semnătură casier</div>
                <div class="voucher-sign-line"></div>
              </div>
              <div class="voucher-sign">
                <div>Semnătură client</div>
                <div class="voucher-sign-line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SIGNATURES_SECTION -->
      <section class="section">
        <div class="section-title">Debitor</div>
        <table class="table compact">
          <thead>
            <tr>
              <th>Nr. BF</th>
              <th>Data începerii prelungirii</th>
              <th>Nr. zile</th>
              <th>Data restituirii</th>
              <th>Comision %/zi</th>
              <th>Valoare comision</th>
              <th>Suma de restituit</th>
              <th>Semnătură debitor</th>
              <th>Semnătură creditor</th>
            </tr>
          </thead>
          <tbody>${extensionRows}</tbody>
        </table>
      </section>
    </article>
  </body>
</html>`;
};
