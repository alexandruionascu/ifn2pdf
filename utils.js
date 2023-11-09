export function parseAddress(addr) {
  let address = `${addr.toUpperCase()}`
    .replace(/,/g, " ")
    .replace(/\./g, " ")
    .split(" ")
    .filter((x) => x.trim().length > 0);

  let addrObj = {
    city: null,
    street: null,
    streetNo: null,
    block: null,
    staircase: null,
    apartment: null,
  };
  let lastIdx = address.length;
  for (let i = address.length - 1; i >= 1; i--) {
    let prev = address[i];
    let cur = address[i - 1];
    if (cur.startsWith("SC")) {
      addrObj["staircase"] = prev;
      lastIdx = i - 1;
    } else if (cur.startsWith("BL")) {
      addrObj["block"] = prev;
      lastIdx = i - 1;
    } else if (cur.startsWith("AP")) {
      addrObj["apartment"] = prev;
      lastIdx = i - 1;
    } else if (cur.startsWith("NR") || cur.startsWith("NUMAR")) {
      addrObj["streetNo"] = prev;
      lastIdx = i - 1;
      // extra -- cus we are done
      lastIdx--;
    }
  }

  if (!addrObj["streetNo"] && /\d/.test(address[lastIdx - 1])) {
    addrObj["streetNo"] = address[lastIdx - 1];
    lastIdx--;
    lastIdx--;
  }

  const adj = [
    "VECHE",
    "MIC",
    "MARE",
    "NOU",
    "NOUA",
    "LUNGA",
    "TURCESC",
    "ROMAN",
    "VUIA",
    "VLAD",
  ];
  let firstIdx = 0;

  if (adj.indexOf(address[1].trim()) > -1) {
    addrObj["city"] = `${address[0]} ${address[1]}`;
    firstIdx = 2;
  }

  addrObj["street"] = "";
  for (let i = firstIdx; i <= lastIdx; i++) {
    addrObj["street"] = addrObj["street"] + " " + address[i];
  }

  if (addrObj["street"]) addrObj["street"] = addrObj["street"].trim();

  // default case
  if (!addrObj["city"]) {
    addrObj["city"] = address[0];
    if (addrObj["city"] == addrObj["street"]) {
        addrObj["street"] = "";
    }
  }

  return addrObj;
}

const TEN = 10;
const ONE_HUNDRED = 100;
const ONE_THOUSAND = 1000;
const ONE_MILLION = 1000000;
const ONE_BILLION = 1000000000; //         1.000.000.000 (9)
const ONE_TRILLION = 1000000000000; //     1.000.000.000.000 (12)

const LESS_THAN_TWENTY = [
  "zero",
  "unu",
  "doi",
  "trei",
  "patru",
  "cinci",
  "sase",
  "sapte",
  "opt",
  "noua",
  "zece",
  "unsprezece",
  "doisprezece",
  "treisprezece",
  "paisprezece",
  "cincisprezece",
  "saisprezece",
  "saptesprezece",
  "optsprezece",
  "nouasprezece",
];

const TENTHS_LESS_THAN_HUNDRED = [
  "zero",
  "zece",
  "douazeci",
  "treizeci",
  "patruzeci",
  "cincizeci",
  "saizeci",
  "saptezeci",
  "optzeci",
  "nouazeci",
];

export function generateWords(nr, words = []) {
  let remainder = 0;
  let word = "";

  // If NaN stop and return 'NaN'
  if (isNaN(nr)) {
    return "NaN";
  }

  // if user go past trillion just return a warning message
  if (nr > ONE_TRILLION - 1) {
    return "over library limit";
  }

  // We are done, if words[] is empty than we have zero else join words,
  // first replace() is used to prevent errors when user writes a number 100,000 instead of 100000,
  // second replace() is used to remove extra spaces
  if (nr === 0) {
    return !words.length
      ? "zero"
      : words
          .join(" ")
          .replace(/,$/, "")
          .replace(/\s{2,}/, " ");
  }

  // If negative, prepend “minus”
  if (nr < 0) {
    words.push("minus");
    nr = Math.abs(nr);
  }

  switch (true) {
    case nr < 20:
      remainder = 0;
      word = LESS_THAN_TWENTY[Math.trunc(nr)];
      word += parseDecimals(nr);
      break;
    case nr < ONE_HUNDRED:
      remainder = Math.trunc(nr % TEN);
      word = TENTHS_LESS_THAN_HUNDRED[Math.floor(nr / TEN)];
      // In case of remainder, we need to handle it here to be able to add the “ și ”
      if (remainder) {
        word += " si ";
      }
      break;
    case nr < ONE_THOUSAND:
      remainder = nr % ONE_HUNDRED;
      const hundreds = Math.floor(nr / ONE_HUNDRED);
      switch (hundreds) {
        case 1:
          word = "una suta";
          break;
        case 2:
          word = "doua sute";
          break;
        default:
          word = generateWords(hundreds) + " sute";
      }
      break;
    case nr < ONE_MILLION:
      remainder = nr % ONE_THOUSAND;
      const thousands = Math.floor(nr / ONE_THOUSAND);
      word = match(thousands, "una mie", "mii");
      break;
    case nr < ONE_BILLION:
      remainder = nr % ONE_MILLION;
      const millions = Math.floor(nr / ONE_MILLION);
      word = match(millions, "un milion", "milioane");
      break;
    case nr < ONE_TRILLION:
      remainder = nr % ONE_BILLION;
      const billions = Math.floor(nr / ONE_BILLION);
      word = match(billions, "un miliard", "miliarde");
      break;
  }
  words.push(word);
  return generateWords(remainder, words);
}

function parseDecimals(nr) {
  const decimals = parseInt(nr.toFixed(2).split(".")[1], 10);
  let word = "";
  if (decimals > 0) {
    word += " virgula ";

    if (decimals < 10) {
      word += "zero ";
    }
    word += generateWords(decimals);
  }
  return word;
}

function match(nr, numberUnitsSingular, numberUnitsPlural) {
  let str = "";

  switch (true) {
    case nr === 1:
      str = numberUnitsSingular;
      break;
    case nr === 2:
      str = "doua " + numberUnitsPlural;
      break;
    case nr < 20 || (nr > 100 && nr % 100 < 20):
      str = generateWords(nr) + " " + numberUnitsPlural;
      break;
    default:
      let words = generateWords(nr);
      if (nr % 10 === 2) {
        words = words.replace(/doi$/, "doua");
      }
      str = words + " de " + numberUnitsPlural;
  }

  return str;
}
