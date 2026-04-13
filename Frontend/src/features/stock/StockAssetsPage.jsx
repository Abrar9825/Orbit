import { Link } from 'react-router-dom';
import useStockAssetsController from './useStockAssetsController';

function StockItemSearch({ controller }) {
  if (controller.activeTab !== 'stock') {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={controller.partSearchQuery}
          onChange={(event) => controller.onPartSearchChange(event.target.value)}
          disabled={controller.mode === 'edit'}
          placeholder="Search item name/model/size"
          className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
        />
        <i className="fas fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
      </div>

      {controller.searchingParts ? (
        <p className="mt-1 text-[11px] font-medium text-slate-500">Searching parts...</p>
      ) : null}

      {controller.showPartSuggestions ? (
        <div className="absolute left-0 right-0 z-30 mt-1 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
          {controller.filteredParts.map((part) => (
            <button
              key={part._id}
              type="button"
              onClick={() => controller.onSelectPart(part._id)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-blue-50"
            >
              <span className="font-semibold text-slate-900">{part.itemName || '-'}</span>
              <span className="ml-2 text-slate-500">{part.modelNumber || part.size || part.moc || '-'}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StockTabForm({ controller }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        controller.submitPart();
      }}
      className="flex h-full flex-col rounded-xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-2 shadow-lg"
    >
      <div className="flex-1 rounded-xl border-2 border-slate-200 bg-white p-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <div className="md:col-span-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={controller.selectedPart?.itemName || controller.partSearchQuery}
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs"
              placeholder="Select from search bar"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Model No</label>
            <input
              type="text"
              value={controller.partForm.modelNo}
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs"
              placeholder="Auto from part"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              MRN No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={controller.partForm.mrnNo}
              onChange={(event) => controller.onChangePart('mrnNo', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="Enter MRN number"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Size <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={controller.partForm.size}
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs"
              placeholder="Auto from part"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              MOC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={controller.partForm.moc}
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs"
              placeholder="Auto from part"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Class <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={controller.partForm.className}
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs"
              placeholder="Auto from part"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Qty <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={controller.partForm.qty}
              onChange={(event) => controller.onChangePart('qty', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Invoice Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={controller.partForm.invoiceNo}
              onChange={(event) => controller.onChangePart('invoiceNo', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="Invoice number"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Source Party <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={controller.partForm.sourceParty}
              onChange={(event) => controller.onChangePart('sourceParty', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="Party name"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={controller.partForm.date}
              onChange={(event) => controller.onChangePart('date', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Present Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={controller.partForm.presentLocation}
              onChange={(event) => controller.onChangePart('presentLocation', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="Store / Rack / Bin"
              required
            />
          </div>

          <div className="md:col-span-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Remarks</label>
            <textarea
              value={controller.partForm.remarks}
              onChange={(event) => controller.onChangePart('remarks', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              rows={1}
              placeholder="Any notes"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-2 border-t border-blue-200 pt-2">
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
  );
}

function PatternTabForm({ controller }) {
  const statusOptions = ['Operational', 'Under Maintenance'];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        controller.submitValve();
      }}
      className="flex h-full flex-col rounded-xl border border-purple-200 bg-gradient-to-br from-white to-purple-50 p-2 shadow-lg"
    >
      <div className="flex-1 rounded-xl border-2 border-purple-200 bg-white p-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Asset Type</label>
            <input
              type="text"
              value={controller.valveForm.assetType}
              onChange={(event) => controller.onChangeValve('assetType', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="Enter asset type"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Item / Equipment Name</label>
            <input
              type="text"
              value={controller.valveForm.itemName}
              onChange={(event) => controller.onChangeValve('itemName', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="Enter item or equipment name"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Sr No</label>
            <input
              type="text"
              value={controller.valveForm.serialNo}
              onChange={(event) => controller.onChangeValve('serialNo', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="Serial number"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">MOC</label>
            <input
              type="text"
              value={controller.valveForm.moc}
              onChange={(event) => controller.onChangeValve('moc', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="Material of construction"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Size</label>
            <input
              type="text"
              value={controller.valveForm.size}
              onChange={(event) => controller.onChangeValve('size', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="Enter size"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Qty <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={controller.valveForm.qty}
              onChange={(event) => controller.onChangeValve('qty', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Status</label>
            <select
              value={controller.valveForm.status}
              onChange={(event) => controller.onChangeValve('status', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Remarks</label>
            <textarea
              value={controller.valveForm.remarks}
              onChange={(event) => controller.onChangeValve('remarks', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
              rows={1}
              placeholder="Any notes"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-2 border-t border-purple-200 pt-2">
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
  );
}

export default function StockAssetsPage() {
  const controller = useStockAssetsController();

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <nav className="z-20 bg-[#022758] text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={controller.goBack}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:scale-105 hover:bg-white/20"
              title="Back to Stock Management"
            >
              <i className="fas fa-arrow-left text-xs"></i>
            </button>
            <div className="text-base font-bold">Stock & Assets</div>
          </div>
          <Link
            to="/cards"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#022758] shadow transition-all hover:scale-105"
          >
            <i className="fas fa-house text-xs"></i>
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto flex h-[calc(100vh-56px)] max-w-7xl flex-col overflow-hidden px-2 py-2 sm:px-3 lg:px-5">
        <div className="mb-2 grid shrink-0 grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4">
          <div className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] p-3 text-white shadow-lg">
            <p className="text-xs font-semibold text-white/90">Total Stock</p>
            <p className="text-xl font-black">{controller.statsLoading ? '...' : controller.stats.totalStock}</p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] p-3 text-white shadow-lg">
            <p className="text-xs font-semibold text-white/90">Low Stock</p>
            <p className="text-xl font-black">{controller.statsLoading ? '...' : controller.stats.lowStock}</p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] p-3 text-white shadow-lg">
            <p className="text-xs font-semibold text-white/90">Total Assets</p>
            <p className="text-xl font-black">{controller.statsLoading ? '...' : controller.stats.totalAssets}</p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] p-3 text-white shadow-lg">
            <p className="text-xs font-semibold text-white/90">Active Assets</p>
            <p className="text-xl font-black">{controller.statsLoading ? '...' : controller.stats.activeAssets}</p>
          </div>
        </div>

        <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => controller.setActiveTab('stock')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                controller.activeTab === 'stock'
                  ? 'bg-gradient-to-r from-[#022758] to-[#1a3a5c] text-white shadow'
                  : 'border-2 border-slate-200 bg-white text-slate-700'
              }`}
            >
              Stock
            </button>
            <button
              onClick={() => controller.setActiveTab('pattern')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                controller.activeTab === 'pattern'
                  ? 'bg-gradient-to-r from-[#022758] to-[#1a3a5c] text-white shadow'
                  : 'border-2 border-slate-200 bg-white text-slate-700'
              }`}
            >
              Pattern
            </button>
          </div>

          <div className="ml-auto w-full md:flex-1 md:max-w-2xl">
            <StockItemSearch controller={controller} />
          </div>
        </div>

        {controller.error ? (
          <div className="mb-2 shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600">
            {controller.error}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-hidden">
          {controller.loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Loading...</div>
          ) : controller.activeTab === 'stock' ? (
            <StockTabForm controller={controller} />
          ) : (
            <PatternTabForm controller={controller} />
          )}
        </div>
      </main>
    </div>
  );
}
