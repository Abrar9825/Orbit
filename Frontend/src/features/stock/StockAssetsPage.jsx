import { Link } from 'react-router-dom';
import useStockAssetsController from './useStockAssetsController';

function CommonFields({ form, onChange }) {
  return (
    <>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Opening Qty</label>
        <input
          type="number"
          min="0"
          value={form.openingQty}
          onChange={(event) => onChange('openingQty', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="0"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Min Stock Level</label>
        <input
          type="number"
          min="0"
          value={form.minStockLevel}
          onChange={(event) => onChange('minStockLevel', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="0"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Reorder Qty</label>
        <input
          type="number"
          min="0"
          value={form.reorderQty}
          onChange={(event) => onChange('reorderQty', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="0"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Plan</label>
        <input
          type="number"
          min="0"
          value={form.plan}
          onChange={(event) => onChange('plan', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="0"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Committed</label>
        <input
          type="number"
          min="0"
          value={form.committed}
          onChange={(event) => onChange('committed', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="0"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Stock Date</label>
        <input
          type="date"
          value={form.stockDate}
          onChange={(event) => onChange('stockDate', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Source Invoice No</label>
        <input
          type="text"
          value={form.sourceInvoiceNo}
          onChange={(event) => onChange('sourceInvoiceNo', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Invoice number"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Source Party</label>
        <input
          type="text"
          value={form.sourceParty}
          onChange={(event) => onChange('sourceParty', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Party name"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Work Order Number</label>
        <input
          type="text"
          value={form.workOrderNumber}
          onChange={(event) => onChange('workOrderNumber', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="WO Number"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Reference Number</label>
        <input
          type="text"
          value={form.referenceNumber}
          onChange={(event) => onChange('referenceNumber', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Reference number"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Source PO Number</label>
        <input
          type="text"
          value={form.sourcePONumber}
          onChange={(event) => onChange('sourcePONumber', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="PO number"
        />
      </div>
      <div className="md:col-span-3">
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Remarks</label>
        <textarea
          value={form.remarks}
          onChange={(event) => onChange('remarks', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          rows={2}
          placeholder="Any notes"
        />
      </div>
    </>
  );
}

export default function StockAssetsPage() {
  const controller = useStockAssetsController();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-20 bg-[#022758] text-white">
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={controller.goBack}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:scale-105 hover:bg-white/20"
                title="Back to Stock Management"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div className="text-lg font-bold">Stock & Assets</div>
            </div>
            <Link
              to="/cards"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#022758] shadow transition-all hover:scale-105"
            >
              <i className="fas fa-house"></i>
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-2 py-3 sm:px-3 lg:px-5">
        <div className="mb-3 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          <div className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] p-3 text-white shadow-lg">
            <p className="text-xs font-semibold text-white/90">Total Stock</p>
            <p className="text-2xl font-black">-</p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] p-3 text-white shadow-lg">
            <p className="text-xs font-semibold text-white/90">Low Stock</p>
            <p className="text-2xl font-black">-</p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] p-3 text-white shadow-lg">
            <p className="text-xs font-semibold text-white/90">Total Assets</p>
            <p className="text-2xl font-black">-</p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] p-3 text-white shadow-lg">
            <p className="text-xs font-semibold text-white/90">Active Assets</p>
            <p className="text-2xl font-black">-</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => controller.setActiveTab('stock')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                controller.activeTab === 'stock'
                  ? 'bg-gradient-to-r from-[#022758] to-[#1a3a5c] text-white shadow'
                  : 'border-2 border-slate-200 bg-white text-slate-700'
              }`}
            >
              Stock
            </button>
            <button
              onClick={() => controller.setActiveTab('pattern')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                controller.activeTab === 'pattern'
                  ? 'bg-gradient-to-r from-[#022758] to-[#1a3a5c] text-white shadow'
                  : 'border-2 border-slate-200 bg-white text-slate-700'
              }`}
            >
              Pattern
            </button>
          </div>
        </div>

        {controller.error ? (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {controller.error}
          </div>
        ) : null}

        {controller.loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Loading...</div>
        ) : null}

        {controller.activeTab === 'stock' ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              controller.submitPart();
            }}
            className="rounded-xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-3 shadow-lg"
          >
            <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="md:col-span-3">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Part Item</label>
                  <select
                    value={controller.partForm.partId}
                    onChange={(event) => controller.onChangePart('partId', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select Part</option>
                    {controller.parts.map((part) => (
                      <option key={part._id} value={part._id}>
                        {part.itemName} {part.modelNumber ? `- ${part.modelNumber}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <CommonFields form={controller.partForm} onChange={controller.onChangePart} />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2 border-t border-blue-200 pt-3">
              <button
                type="button"
                onClick={controller.goBack}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={controller.submitLoading}
                className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] px-4 py-2 text-xs font-semibold text-white shadow"
              >
                {controller.submitLoading ? 'Saving...' : controller.mode === 'edit' ? 'Update Stock' : 'Add Stock'}
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              controller.submitValve();
            }}
            className="rounded-xl border border-purple-200 bg-gradient-to-br from-white to-purple-50 p-3 shadow-lg"
          >
            <div className="rounded-xl border-2 border-purple-200 bg-white p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="md:col-span-3">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">BOM Template</label>
                  <select
                    value={controller.valveForm.bomId}
                    onChange={(event) => controller.onChangeValve('bomId', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select BOM</option>
                    {controller.boms.map((bom) => (
                      <option key={bom._id} value={bom._id}>
                        {bom.templateName} - {bom.valveType} - {bom.size}
                      </option>
                    ))}
                  </select>
                </div>
                <CommonFields form={controller.valveForm} onChange={controller.onChangeValve} />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2 border-t border-purple-200 pt-3">
              <button
                type="button"
                onClick={controller.goBack}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={controller.submitLoading}
                className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] px-4 py-2 text-xs font-semibold text-white shadow"
              >
                {controller.submitLoading ? 'Saving...' : controller.mode === 'edit' ? 'Update Pattern' : 'Add Pattern'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
