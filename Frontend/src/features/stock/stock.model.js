export const STOCK_TABS = [
  { id: 'stock', label: 'Stock', icon: 'fas fa-boxes-stacked' },
  { id: 'pattern', label: 'Pattern', icon: 'fas fa-shapes' },
  { id: 'po', label: 'PO', icon: 'fas fa-file-invoice' }
];

export const STOCK_STATUS_COLORS = {
  healthy: 'bg-emerald-100 text-emerald-700',
  low: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700'
};

export function getStockHealth(item) {
  const qty = Number(item.qtyOnHand || 0);
  const min = Number(item.minStockLevel || 0);

  if (min === 0 || qty > min) {
    return 'healthy';
  }

  if (qty === 0) {
    return 'critical';
  }

  return 'low';
}

export function formatDate(value) {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleDateString('en-GB');
}

export function formatNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return '0';
  }

  return parsed.toLocaleString('en-IN');
}

export function mapStockForView(item) {
  return {
    id: item._id,
    itemType: item.itemType,
    itemName: item.itemName || '-',
    modelOrType: item.modelNumber || item.valveType || '-',
    size: item.size || '-',
    moc: item.moc || '-',
    class: item.class || '-',
    qtyOnHand: Number(item.qtyOnHand || 0),
    available: Number(item.available || 0),
    committed: Number(item.committed || 0),
    plan: Number(item.plan || 0),
    minStockLevel: Number(item.minStockLevel || 0),
    reorderQty: Number(item.reorderQty || 0),
    sourceParty: item.sourceParty || '-',
    sourceInvoiceNo: item.sourceInvoiceNo || '-',
    stockDate: item.stockDate,
    updatedAt: item.updatedAt,
    health: getStockHealth(item)
  };
}
