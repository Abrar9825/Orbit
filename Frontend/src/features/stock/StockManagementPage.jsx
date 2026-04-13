import { Link } from 'react-router-dom';
import useStockManagementController from './useStockManagementController';

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-gradient-to-r from-[#022758] to-[#1a3a5c] p-3 text-white shadow-lg">
      <div className="mb-2 flex items-center gap-2 border-b border-white/20 pb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          <i className={`${icon} text-sm`}></i>
        </div>
        <p className="text-xs font-semibold text-white/90">{label}</p>
      </div>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function DesktopTable({ controller }) {
  if (controller.activeTab === 'po') {
    return (
      <table className="w-full table-fixed text-xs">
        <thead className="bg-gradient-to-r from-[#022758] to-[#1a3a5c] text-white">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">PO No</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Client</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Vendor</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Date</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Status</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Action</th>
          </tr>
        </thead>
        <tbody>
          {controller.pageRows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-8 text-center text-slate-500">No PO rows found.</td>
            </tr>
          ) : (
            controller.pageRows.map((row, index) => (
              <tr key={`${row.poNo || 'po'}-${index}`} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 text-xs font-semibold text-slate-900">{row.poNo || '-'}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.client || '-'}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.vendor || '-'}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.date || '-'}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.status || '-'}</td>
                <td className="px-3 py-2">
                  <button
                    className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600"
                    onClick={() => controller.onDeletePo(controller.showingStart - 1 + index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  if (controller.activeTab === 'pattern') {
    return (
      <table className="w-full table-fixed text-xs">
        <thead className="bg-gradient-to-r from-[#022758] to-[#1a3a5c] text-white">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Asset Type</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Item Name</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Serial No</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">MOC</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Size</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Qty</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Status</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Present Location</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Remarks</th>
            <th className="px-3 py-3 text-left text-xs font-bold uppercase">Action</th>
          </tr>
        </thead>
        <tbody>
          {controller.pageRows.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-3 py-8 text-center text-slate-500">No pattern rows found.</td>
            </tr>
          ) : (
            controller.pageRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-purple-50/40">
                <td className="px-3 py-2 text-xs text-slate-700">{row.assetType || '-'}</td>
                <td className="px-3 py-2 text-xs font-semibold text-slate-900">{row.itemName || '-'}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.serialNo || '-'}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.moc || '-'}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.size || '-'}</td>
                <td className="px-3 py-2 text-xs font-semibold text-slate-900">{controller.formatNumber(row.qty)}</td>
                <td className="px-3 py-2 text-xs">
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    {row.status || '-'}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.presentLocation || '-'}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.remarks || '-'}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      className="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                      onClick={() => controller.onEdit(row.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600"
                      onClick={() => controller.onDelete(row.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }

  return (
    <table className="w-full table-fixed text-xs">
      <thead className="bg-gradient-to-r from-[#022758] to-[#1a3a5c] text-white">
        <tr>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Item</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Model No</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">MRN No</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Size</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">MOC</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Class</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Qty</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Invoice No</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Source Party</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Date</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Present Location</th>
          <th className="px-3 py-3 text-left text-xs font-bold uppercase">Action</th>
        </tr>
      </thead>
      <tbody>
        {controller.pageRows.length === 0 ? (
          <tr>
            <td colSpan={12} className="px-3 py-8 text-center text-slate-500">No stock rows found.</td>
          </tr>
        ) : (
          controller.pageRows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 hover:bg-blue-50/40">
              <td className="px-3 py-2 text-xs font-semibold text-slate-900">{row.itemName}</td>
              <td className="px-3 py-2 text-xs text-slate-600">{row.modelNo}</td>
              <td className="px-3 py-2 text-xs text-slate-600">{row.mrnNo}</td>
              <td className="px-3 py-2 text-xs text-slate-600">{row.size}</td>
              <td className="px-3 py-2 text-xs text-slate-600">{row.moc}</td>
              <td className="px-3 py-2 text-xs text-slate-600">{row.className}</td>
              <td className="px-3 py-2 text-xs font-semibold text-slate-900">{controller.formatNumber(row.qty)}</td>
              <td className="px-3 py-2 text-xs text-slate-600">{row.invoiceNo}</td>
              <td className="px-3 py-2 text-xs text-slate-600">{row.sourceParty}</td>
              <td className="px-3 py-2 text-xs text-slate-600">{controller.formatDate(row.date)}</td>
              <td className="px-3 py-2 text-xs text-slate-600">{row.presentLocation}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <button
                    className="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                    onClick={() => controller.onEdit(row.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600"
                    onClick={() => controller.onDelete(row.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default function StockManagementPage() {
  const controller = useStockManagementController();

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="z-40 bg-[#022758]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-white">Stock Management</h1>
          <Link
            to="/cards"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#022758] shadow transition-all hover:scale-105 sm:text-sm"
          >
            <i className="fas fa-house text-sm"></i>
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto flex h-[calc(100vh-64px)] max-w-7xl flex-col overflow-hidden px-3 py-3 sm:px-4 lg:px-6">
        <div className="mb-2 grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="fas fa-cubes" label={controller.totals.labels[0]} value={controller.totals.total} />
          <StatCard icon="fas fa-triangle-exclamation" label={controller.totals.labels[1]} value={controller.totals.secondary} />
          <StatCard icon="fas fa-chart-line" label={controller.totals.labels[2]} value={controller.totals.tertiary} />
          <StatCard icon="fas fa-layer-group" label={controller.totals.labels[3]} value={controller.totals.quaternary} />
        </div>

        <div id="filterRow" className="mb-2 flex shrink-0 flex-wrap items-center gap-2 md:flex-nowrap">
          <div className="flex items-center gap-2">
            {controller.STOCK_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => controller.onSwitchTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  controller.activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#022758] to-[#1a3a5c] text-white shadow'
                    : 'border-2 border-slate-200 bg-white text-slate-700 hover:scale-105'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex w-full min-w-0 items-center gap-2 md:w-auto md:flex-1 md:justify-end">
            {controller.activeTab === 'stock' ? (
              <div className="min-w-0 flex-1 md:max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    value={controller.searchQuery}
                    onChange={(event) => controller.setSearchQuery(event.target.value)}
                    placeholder="Search by item, model, MRN, size, MOC, party..."
                    className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <i className="fas fa-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                </div>
              </div>
            ) : null}

            <button
              onClick={controller.onAdd}
              className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#022758] to-[#1a3a5c] px-3 py-1.5 text-xs font-semibold text-white shadow"
            >
              <i className="fas fa-plus-circle"></i>
              Add
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {controller.error ? (
            <div className="px-4 py-2 text-xs font-medium text-red-600">{controller.error}</div>
          ) : null}

          {controller.loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">Loading...</div>
          ) : (
            <div className="hidden min-h-0 flex-1 overflow-hidden md:block">
              <DesktopTable controller={controller} />
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 p-2 md:hidden">
            {controller.pageRows.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">No items to show.</div>
            ) : (
              controller.pageRows.map((row, index) => (
                <div key={row.id || `${row.poNo}-${index}`} className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{row.itemName || row.poNo || '-'}</h3>
                    {controller.activeTab === 'stock' ? (
                      <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${controller.STOCK_STATUS_COLORS[row.health]}`}>
                        {row.health.toUpperCase()}
                      </span>
                    ) : controller.activeTab === 'pattern' ? (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        {row.status || '-'}
                      </span>
                    ) : null}
                  </div>
                  {controller.activeTab === 'po' ? (
                    <p className="text-xs text-slate-600">{row.client || '-'} • {row.vendor || '-'}</p>
                  ) : controller.activeTab === 'pattern' ? (
                    <div className="space-y-1 text-xs text-slate-600">
                      <p>{row.assetType || '-'} • {row.serialNo || '-'} • Qty {controller.formatNumber(row.qty)}</p>
                      <p>{row.presentLocation || '-'} • {row.remarks || '-'}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600">
                      {row.modelNo || '-'} • MRN {row.mrnNo || '-'} • Qty {controller.formatNumber(row.qty)}
                    </p>
                  )}
                  <div className="mt-3 flex justify-end gap-2">
                    {controller.activeTab === 'po' ? (
                      <button
                        className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold text-white"
                        onClick={() => controller.onDeletePo(controller.showingStart - 1 + index)}
                      >
                        Delete
                      </button>
                    ) : (
                      <>
                        <button className="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white" onClick={() => controller.onEdit(row.id)}>
                          Edit
                        </button>
                        <button className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold text-white" onClick={() => controller.onDelete(row.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2 sm:px-4">
            <p className="text-xs text-slate-600">
              Showing {controller.showingStart}-{controller.showingEnd} of {controller.totalItems}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={controller.prevPage}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Previous
              </button>
              {Array.from({ length: controller.totalPages }, (_, idx) => idx + 1)
                .slice(Math.max(controller.currentPage - 3, 0), Math.max(controller.currentPage - 3, 0) + 7)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => controller.goToPage(page)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                      page === controller.currentPage
                        ? 'bg-gradient-to-r from-[#022758] to-[#1a3a5c] text-white'
                        : 'border border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              <button
                onClick={controller.nextPage}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
