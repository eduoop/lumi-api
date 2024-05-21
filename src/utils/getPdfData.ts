export const extractDataFromPdfText = (pdfText: string) => {
  // Remover espaços em branco extras
  pdfText = pdfText.replace(/\s+/g, " ").trim();

  const invoiceData = {
    clientNumber: getClientNumber(pdfText),
    referenceMonth: getReferenceMonth(pdfText),
    electricEnergy: getElectricEnergy(pdfText),
    sceeEnergy: getSCEEEnergy(pdfText),
    compensatedEnergy: getCompensatedEnergy(pdfText),
    publicLightingContribution: getMunicipalPublicLightingContribution(pdfText),
  };

  console.log(invoiceData);

  return invoiceData;
};

function getClientNumber(text: string) {
  const regex = /Nº DO CLIENTE Nº DA INSTALAÇÃO (\d+)/;
  const match = text.match(regex);

  if (match) {
    return match[1];
  }
}

function getReferenceMonth(text: string) {
  const regex = /Referente a Vencimento Valor a pagar \(R\$\) (\w+\/\d+)/;
  const match = text.match(regex);

  if (match) {
    return match[1];
  }
}

function getElectricEnergy(text: string) {
  const regex = /Energia ElétricakWh (\d+(?:[.,]\d+)?).{12}(\d+(?:[.,]\d+)?)/;
  const match = text.match(regex);

  if (match) {
    return {
      value: match[2],
      quantity: match[1],
    };
  }
}

function getSCEEEnergy(text: string) {
  const regex =
    /Energia SCEE ISENTAkWh (\d+(?:[.,]\d+)?).{12}(\d+(?:[.,]\d+)?)/;
  const secondRegex = /ICMSkWh (-?\d+(?:[.,]\d+)?).{12}(-?\d+(?:[.,]\d+)?)/;

  const match = text.match(regex);
  const secondMatch = text.match(secondRegex);

  if (match) {
    return {
      value: match[2],
      quantity: match[1],
    };
  } else if (secondMatch) {
    return {
      value: secondMatch[2],
      quantity: secondMatch[1],
    };
  }
}

function getCompensatedEnergy(text: string) {
  const regex =
    /Energia compensada GD IkWh (\d+(?:[.,]\d+)?).{12}(-?\d+(?:[.,]\d+)?)/;
  const match = text.match(regex);

  if (match) {
    return {
      value: match[2],
      quantity: match[1],
    };
  }
}

function getMunicipalPublicLightingContribution(text: string) {
  const regex = /Contrib Ilum Publica Municipal (\d+(?:[.,]\d+)?)/;
  const match = text.match(regex);

  if (match) {
    return {
      value: match[1],
    };
  }
}
