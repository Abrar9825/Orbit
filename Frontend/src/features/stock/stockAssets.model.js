export function createInitialPartForm() {
  return {
    partId: '',
    openingQty: '',
    minStockLevel: '',
    reorderQty: '',
    plan: '',
    committed: '',
    sourceInvoiceNo: '',
    sourceParty: '',
    workOrderNumber: '',
    referenceNumber: '',
    sourcePONumber: '',
    stockDate: '',
    remarks: ''
  };
}

export function createInitialValveForm() {
  return {
    bomId: '',
    openingQty: '',
    minStockLevel: '',
    reorderQty: '',
    plan: '',
    committed: '',
    sourceInvoiceNo: '',
    sourceParty: '',
    workOrderNumber: '',
    referenceNumber: '',
    sourcePONumber: '',
    stockDate: '',
    remarks: ''
  };
}

export function toNumberOrZero(value) {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function toPayloadFromPart(form) {
  const openingQty = toNumberOrZero(form.openingQty);
  const committed = Math.min(toNumberOrZero(form.committed), openingQty);

  return {
    itemType: 'PART',
    partId: form.partId,
    openingQty,
    qtyOnHand: openingQty,
    minStockLevel: toNumberOrZero(form.minStockLevel),
    reorderQty: toNumberOrZero(form.reorderQty),
    plan: toNumberOrZero(form.plan),
    committed,
    available: Math.max(openingQty - committed, 0),
    sourceInvoiceNo: form.sourceInvoiceNo.trim(),
    sourceParty: form.sourceParty.trim(),
    workOrderNumber: form.workOrderNumber.trim(),
    referenceNumber: form.referenceNumber.trim(),
    sourcePONumber: form.sourcePONumber.trim(),
    stockDate: form.stockDate || undefined,
    remarks: form.remarks.trim()
  };
}

export function toPayloadFromValve(form) {
  const openingQty = toNumberOrZero(form.openingQty);
  const committed = Math.min(toNumberOrZero(form.committed), openingQty);

  return {
    itemType: 'VALVE',
    bomId: form.bomId,
    openingQty,
    qtyOnHand: openingQty,
    minStockLevel: toNumberOrZero(form.minStockLevel),
    reorderQty: toNumberOrZero(form.reorderQty),
    plan: toNumberOrZero(form.plan),
    committed,
    available: Math.max(openingQty - committed, 0),
    sourceInvoiceNo: form.sourceInvoiceNo.trim(),
    sourceParty: form.sourceParty.trim(),
    workOrderNumber: form.workOrderNumber.trim(),
    referenceNumber: form.referenceNumber.trim(),
    sourcePONumber: form.sourcePONumber.trim(),
    stockDate: form.stockDate || undefined,
    remarks: form.remarks.trim()
  };
}
