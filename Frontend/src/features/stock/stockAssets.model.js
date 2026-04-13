export function createInitialPartForm() {
  return {
    partId: '',
    modelNo: '',
    mrnNo: '',
    size: '',
    moc: '',
    className: '',
    qty: '',
    invoiceNo: '',
    sourceParty: '',
    date: '',
    presentLocation: '',
    remarks: ''
  };
}

export function createInitialValveForm() {
  return {
    bomId: '',
    assetType: '',
    itemName: '',
    serialNo: '',
    moc: '',
    size: '',
    qty: '',
    status: 'Operational',
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
  const qty = Math.max(toNumberOrZero(form.qty), 1);

  return {
    itemType: 'PART',
    partId: form.partId,
    openingQty: qty,
    qtyOnHand: qty,
    minStockLevel: 0,
    reorderQty: 0,
    plan: 0,
    committed: 0,
    available: qty,
    sourceInvoiceNo: (form.invoiceNo || '').trim(),
    sourceParty: form.sourceParty.trim(),
    referenceNumber: (form.mrnNo || '').trim(),
    stockDate: form.date || undefined,
    presentLocation: (form.presentLocation || '').trim(),
    remarks: form.remarks.trim()
  };
}

export function toPayloadFromValve(form) {
  const qty = Math.max(toNumberOrZero(form.qty), 1);
  const cleanedBomId = String(form.bomId || '').trim();
  const cleanedItemName = (form.itemName || '').trim();
  const cleanedAssetType = (form.assetType || '').trim();

  const payload = {
    itemType: 'VALVE',
    itemName: cleanedItemName,
    valveType: cleanedAssetType || cleanedItemName,
    size: (form.size || '').trim(),
    openingQty: qty,
    qtyOnHand: qty,
    minStockLevel: 0,
    reorderQty: 0,
    plan: 0,
    committed: 0,
    available: qty,
    serialNo: (form.serialNo || '').trim(),
    moc: (form.moc || '').trim(),
    status: (form.status || 'Operational').trim(),
    remarks: form.remarks.trim()
  };

  if (cleanedBomId) {
    payload.bomId = cleanedBomId;
  }

  return payload;
}
