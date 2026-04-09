import useConfigurationViewController from './useConfigurationViewController';
import './configurationView.css';

function PaginationControls({ tab, meta, currentPage, onPrev, onNext, onPage }) {
  const maxButtons = 5;
  let startPage = 1;
  let endPage = meta.totalPages;

  if (meta.totalPages > maxButtons) {
    const half = Math.floor(maxButtons / 2);
    startPage = Math.max(1, currentPage - half);
    endPage = Math.min(meta.totalPages, currentPage + half);

    if (startPage === 1) endPage = Math.min(maxButtons, meta.totalPages);
    if (endPage === meta.totalPages) startPage = Math.max(1, meta.totalPages - maxButtons + 1);
  }

  return (
    <div className="mt-4 bg-white rounded-lg p-3 sm:p-4 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
        <div className="text-xs sm:text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{meta.totalItems === 0 ? '0-0' : `${meta.startLabel}-${meta.endIndex}`}</span> of{' '}
          <span className="font-semibold text-slate-900">{meta.totalItems}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 pagination-controls">
          <button
            onClick={onPrev}
            disabled={currentPage === 1}
            className={`prev-btn px-2.5 sm:px-3 py-1.5 border-2 rounded-lg text-xs font-semibold transition-all ${
              currentPage === 1
                ? 'bg-slate-50 border-slate-200 text-slate-400'
                : 'btn-view'
            }`}
          >
            Previous
          </button>

          <div className="page-buttons flex items-center gap-1.5 sm:gap-2 px-2">
            {startPage > 1 ? (
              <>
                <button
                  onClick={() => onPage(1)}
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  1
                </button>
                {startPage > 2 ? <span className="px-2 text-slate-400">...</span> : null}
              </>
            ) : null}

            {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
              const page = startPage + index;
              return (
                <button
                  key={`${tab}-${page}`}
                  onClick={() => onPage(page)}
                  className={
                    page === currentPage
                      ? 'px-2.5 sm:px-3 py-1.5 btn-view rounded-lg text-xs font-bold'
                      : 'px-2.5 sm:px-3 py-1.5 bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100'
                  }
                >
                  {page}
                </button>
              );
            })}

            {endPage < meta.totalPages ? (
              <>
                {endPage < meta.totalPages - 1 ? <span className="px-2 text-slate-400">...</span> : null}
                <button
                  onClick={() => onPage(meta.totalPages)}
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  {meta.totalPages}
                </button>
              </>
            ) : null}
          </div>

          <button
            onClick={onNext}
            disabled={currentPage === meta.totalPages}
            className={`next-btn px-2.5 sm:px-3 py-1.5 border-2 rounded-lg text-xs font-semibold transition-all ${
              currentPage === meta.totalPages
                ? 'bg-slate-50 border-slate-200 text-slate-400'
                : 'btn-view'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <nav className="sticky top-0 z-40 text-white" style={{ background: 'var(--primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[var(--primary)]">
            <i className="fas fa-cog"></i>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">Configuration</h1>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <a
            href="/cards"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white text-[var(--primary)] rounded-lg font-semibold shadow hover:scale-105 transition-all whitespace-nowrap"
          >
            <i className="fas fa-house"></i>
            <span className="text-xs sm:text-sm">Dashboard</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

function StatsCards({ counts, onSwitchTab }) {
  const cards = [
    { key: 'machines', icon: 'fas fa-cogs', label: 'Machines', count: counts.machineCount },
    { key: 'parts', icon: 'fas fa-cube', label: 'Parts', count: counts.partCount },
    { key: 'bom', icon: 'fas fa-list', label: 'BOM Templates', count: counts.bomCount },
    { key: 'users', icon: 'fas fa-users', label: 'Assigned Users', count: counts.userCount },
    { key: 'masterdata', icon: 'fas fa-database', label: 'Master Data', count: counts.masterDataCount }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => (
        <button
          key={card.key}
          onClick={() => onSwitchTab(card.key)}
          className="primary-gradient rounded-lg text-white shadow-lg p-4 text-left transition-all hover:shadow-2xl hover:scale-105"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
              <i className={`${card.icon} text-lg`}></i>
            </div>
            <span className="text-2xl font-bold text-white">{card.count}</span>
          </div>
          <p className="text-sm text-white/90 font-medium">{card.label}</p>
        </button>
      ))}
    </div>
  );
}

function FiltersBar({
  activeTab,
  onSwitchTab,
  processFilter,
  onProcessFilter,
  partsCategoryFilter,
  onPartsCategoryFilter,
  masterDataFilter,
  onMasterDataFilter,
  processTypes,
  masterDataFilterOptions,
  onAddNew
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-3">
      <div className="flex gap-2 bg-white rounded-lg border border-slate-200 p-2 flex-wrap overflow-x-auto">
        {[
          { id: 'machines', label: 'Machines', icon: 'fas fa-cogs' },
          { id: 'parts', label: 'Parts', icon: 'fas fa-cube' },
          { id: 'bom', label: 'BOM', icon: 'fas fa-list' },
          { id: 'users', label: 'Users', icon: 'fas fa-users' },
          { id: 'masterdata', label: 'Master Data', icon: 'fas fa-database' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            className={`tab-btn px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'active primary-gradient text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className={`${tab.icon} mr-1 sm:mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        {activeTab === 'machines' ? (
          <select
            value={processFilter}
            onChange={(e) => onProcessFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white w-full sm:w-auto"
          >
            <option value="">Select Process</option>
            {processTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        ) : null}

        {activeTab === 'parts' ? (
          <select
            value={partsCategoryFilter}
            onChange={(e) => onPartsCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            <option value="Valve">Valve</option>
            <option value="Pump">Pump</option>
            <option value="Parts">Parts</option>
          </select>
        ) : null}

        {activeTab === 'masterdata' ? (
          <select
            value={masterDataFilter}
            onChange={(e) => onMasterDataFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white w-full sm:w-auto"
          >
            {masterDataFilterOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        ) : null}

        <button
          onClick={onAddNew}
          className="primary-btn px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
        >
          <i className="fas fa-plus"></i>
          <span>Add New</span>
        </button>
      </div>
    </div>
  );
}

function MachinesTab({ pageItems, meta, currentPage, onPrev, onNext, onPage, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto table-view">
        <table className="w-full text-sm">
          <thead className="table-header text-white text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Process Type</th>
              <th className="px-4 py-3 text-left">Machine Name</th>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  <i className="fas fa-cogs text-4xl mb-2 text-slate-300"></i>
                  <p>No machines found. Add machines from the configuration page.</p>
                </td>
              </tr>
            ) : (
              pageItems.map((machine, index) => {
                const globalIndex = meta.startIndex + index;
                return (
                  <tr key={`machine-${globalIndex}`} className="border-t border-slate-200 hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{machine.process || 'N/A'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{machine.name}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {machine.code || `M${String(globalIndex + 1).padStart(3, '0')}`}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{machine.size || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(machine, globalIndex)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-all"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          onClick={() => onDelete(machine, globalIndex)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all"
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="card-view p-3">
        {pageItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <i className="fas fa-cogs text-4xl mb-2 text-slate-300"></i>
            <p>No machines found. Add machines from the configuration page.</p>
          </div>
        ) : (
          pageItems.map((machine, index) => {
            const globalIndex = meta.startIndex + index;
            return (
              <div key={`machine-card-${globalIndex}`} className="mobile-card">
                <div className="mobile-card-header">
                  <i className="fas fa-cog mr-2"></i>
                  {machine.name}
                </div>
                <div className="mobile-card-row">
                  <span className="mobile-card-label">Process:</span>
                  <span className="mobile-card-value">{machine.process || 'N/A'}</span>
                </div>
                <div className="mobile-card-row">
                  <span className="mobile-card-label">Code:</span>
                  <span className="mobile-card-value">{machine.code || 'N/A'}</span>
                </div>
                <div className="mobile-card-row">
                  <span className="mobile-card-label">Size:</span>
                  <span className="mobile-card-value">{machine.size || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => onEdit(machine, globalIndex)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-all"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    onClick={() => onDelete(machine, globalIndex)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PaginationControls
        tab="machines"
        meta={meta}
        currentPage={currentPage}
        onPrev={onPrev}
        onNext={onNext}
        onPage={onPage}
      />
    </div>
  );
}

function PartsTab({ pageItems, meta, currentPage, onPrev, onNext, onPage, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto table-view">
        <table className="w-full text-sm">
          <thead className="table-header text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ITEM NAME</th>
              <th className="px-4 py-3 text-left font-semibold">MODEL NO</th>
              <th className="px-4 py-3 text-left font-semibold">SIZE</th>
              <th className="px-4 py-3 text-left font-semibold">MOC</th>
              <th className="px-4 py-3 text-left font-semibold">CLASS</th>
              <th className="px-4 py-3 text-left font-semibold">REMARK</th>
              <th className="px-4 py-3 text-center font-semibold">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  <i className="fas fa-cube text-4xl mb-2 text-slate-300"></i>
                  <p>No parts found. Add parts from the configuration page.</p>
                </td>
              </tr>
            ) : (
              pageItems.map((part, index) => {
                const globalIndex = meta.startIndex + index;
                return (
                  <tr key={`part-${globalIndex}`} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{part.itemName || part.item || part.part_name || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-700">{part.modelNo || part.model || part.equipment || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{part.size || part.qty || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{part.moc || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{part.class || part.invoice || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{part.remark || part.remarks || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onEdit(part)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs mr-1 font-medium"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => onDelete(part)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="card-view p-3">
        {pageItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <i className="fas fa-cube text-4xl mb-2 text-slate-300"></i>
            <p>No parts found.</p>
          </div>
        ) : (
          pageItems.map((part, index) => (
            <div key={`part-card-${meta.startIndex + index}`} className="mobile-card">
              <div className="mobile-card-header">
                <i className="fas fa-cube mr-2"></i>
                {part.itemName || part.item || part.part_name || 'N/A'}
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Model No:</span>
                <span className="mobile-card-value">{part.modelNo || part.model || part.equipment || '-'}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Size:</span>
                <span className="mobile-card-value">{part.size || part.qty || '-'}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">MOC:</span>
                <span className="mobile-card-value">{part.moc || '-'}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Class:</span>
                <span className="mobile-card-value">{part.class || part.invoice || '-'}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Remark:</span>
                <span className="mobile-card-value">{part.remark || part.remarks || '-'}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => onEdit(part)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-all"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  onClick={() => onDelete(part)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all"
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <PaginationControls
        tab="parts"
        meta={meta}
        currentPage={currentPage}
        onPrev={onPrev}
        onNext={onNext}
        onPage={onPage}
      />
    </div>
  );
}

function BomTab({ pageItems, meta, currentPage, onPrev, onNext, onPage, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto table-view">
        <table className="w-full text-sm">
          <thead className="table-header text-white" id="bomTableHead">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Valve Name</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                  <i className="fas fa-list text-4xl mb-2 text-slate-300"></i>
                  <p>No BOM templates found. Create BOMs from the configuration page.</p>
                </td>
              </tr>
            ) : (
              pageItems.map((bom, index) => (
                <tr key={`bom-${meta.startIndex + index}`} className="border-t border-slate-200 hover:bg-blue-50">
                  <td className="px-4 py-3 text-slate-700 font-medium">{bom.valveName || bom.partName || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(bom)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-all"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        onClick={() => onDelete(bom)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all"
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card-view p-3">
        {pageItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <i className="fas fa-list text-4xl mb-2 text-slate-300"></i>
            <p>No BOM templates found.</p>
          </div>
        ) : (
          pageItems.map((bom, index) => (
            <div key={`bom-card-${meta.startIndex + index}`} className="mobile-card">
              <div className="mobile-card-header">
                <i className="fas fa-list mr-2"></i>
                {bom.valveName || bom.partName || '-'}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                <button
                  onClick={() => onEdit(bom)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-all"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  onClick={() => onDelete(bom)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all"
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <PaginationControls
        tab="bom"
        meta={meta}
        currentPage={currentPage}
        onPrev={onPrev}
        onNext={onNext}
        onPage={onPage}
      />
    </div>
  );
}

function UsersTab({
  pageItems,
  meta,
  currentPage,
  onPrev,
  onNext,
  onPage,
  roleColors,
  onOpenUserConfig,
  onViewPermissions
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto table-view">
        <table className="w-full text-sm">
          <thead className="table-header text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">User Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Password</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  <i className="fas fa-users text-4xl mb-2 text-slate-300"></i>
                  <p>No users found.</p>
                </td>
              </tr>
            ) : (
              pageItems.map((user, index) => (
                <tr key={`user-${meta.startIndex + index}`} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{user.name}</td>
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
                  <td className="px-4 py-3 text-slate-700">{user.password || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                      {user.role || 'User'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenUserConfig(user.id)}
                        className="btn-view px-3 py-1 rounded-lg text-xs font-semibold"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onViewPermissions(user)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Permissions
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card-view p-3">
        {pageItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <i className="fas fa-users text-4xl mb-2 text-slate-300"></i>
            <p>No users found.</p>
          </div>
        ) : (
          pageItems.map((user, index) => (
            <div key={`user-card-${meta.startIndex + index}`} className="mobile-card">
              <div className="mobile-card-header">
                <i className="fas fa-user mr-2"></i>
                {user.name}
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Email:</span>
                <span className="mobile-card-value">{user.email}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Password:</span>
                <span className="mobile-card-value">{user.password || 'N/A'}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Role:</span>
                <span className="mobile-card-value">{user.role || 'User'}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => onOpenUserConfig(user.id)}
                  className="flex-1 btn-view px-3 py-2 rounded-lg text-xs font-semibold"
                >
                  View
                </button>
                <button
                  onClick={() => onViewPermissions(user)}
                  className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Permissions
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <PaginationControls
        tab="users"
        meta={meta}
        currentPage={currentPage}
        onPrev={onPrev}
        onNext={onNext}
        onPage={onPage}
      />
    </div>
  );
}

function MasterDataTab({ pageItems, filterType, meta, currentPage, onPrev, onNext, onPage, onDelete }) {
  const labelMap = {
    endConnections: 'End Connection',
    sizes: 'Size',
    classes: 'Class'
  };

  const titleLabel = labelMap[filterType] || filterType;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto table-view">
        <table className="w-full text-sm">
          <thead className="table-header text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Value</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  <i className="fas fa-database text-4xl mb-2 text-slate-300"></i>
                  <p>No {titleLabel}s found.</p>
                </td>
              </tr>
            ) : (
              pageItems.map((item, index) => {
                const globalIndex = meta.startIndex + index;
                return (
                  <tr key={`master-${globalIndex}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{globalIndex + 1}</td>
                    <td className="px-4 py-3 text-slate-900 font-medium">{item}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onDelete(filterType, globalIndex)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="card-view p-3">
        {pageItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <i className="fas fa-database text-4xl mb-2 text-slate-300"></i>
            <p>No {titleLabel}s found.</p>
          </div>
        ) : (
          pageItems.map((item, index) => {
            const globalIndex = meta.startIndex + index;
            return (
              <div key={`master-card-${globalIndex}`} className="mobile-card">
                <div className="mobile-card-header">
                  <i className="fas fa-database mr-2"></i>
                  {titleLabel} #{globalIndex + 1}
                </div>
                <div className="mobile-card-row">
                  <span className="mobile-card-label">Value:</span>
                  <span className="mobile-card-value">{item}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex gap-2">
                  <button
                    onClick={() => onDelete(filterType, globalIndex)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-all"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PaginationControls
        tab="masterdata"
        meta={meta}
        currentPage={currentPage}
        onPrev={onPrev}
        onNext={onNext}
        onPage={onPage}
      />
    </div>
  );
}

function PermissionsModal({ user, systemPages, onClose }) {
  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 text-white p-4 flex items-center justify-between" style={{ background: 'var(--primary)' }}>
          <h2 className="text-lg font-bold">{user.name} - Permissions</h2>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--primary)' }}>
              {user.name}
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ background: 'var(--primary)', color: 'white' }}>
                  <th className="border p-2 text-left">Page</th>
                  <th className="border p-2 text-center">C</th>
                  <th className="border p-2 text-center">R</th>
                  <th className="border p-2 text-center">U</th>
                  <th className="border p-2 text-center">D</th>
                </tr>
              </thead>
              <tbody>
                {systemPages.map((page) => {
                  const perms = user.permissions?.[page.id] || {
                    create: false,
                    read: false,
                    update: false,
                    delete: false
                  };

                  return (
                    <tr key={page.id} style={{ border: '1px solid #e0e0e0' }}>
                      <td className="p-2" style={{ fontWeight: 500 }}>{page.name}</td>
                      <td className="p-2 text-center">{perms.create ? <i className="fas fa-check text-green-600"></i> : '-'}</td>
                      <td className="p-2 text-center">{perms.read ? <i className="fas fa-check text-green-600"></i> : '-'}</td>
                      <td className="p-2 text-center">{perms.update ? <i className="fas fa-check text-green-600"></i> : '-'}</td>
                      <td className="p-2 text-center">{perms.delete ? <i className="fas fa-check text-green-600"></i> : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfigurationViewPage() {
  const controller = useConfigurationViewController();

  const machinesMeta = controller.getPaginationMeta('machines');
  const partsMeta = controller.getPaginationMeta('parts');
  const bomMeta = controller.getPaginationMeta('bom');
  const usersMeta = controller.getPaginationMeta('users');
  const masterMeta = controller.getPaginationMeta('masterdata');

  const machineItems = controller.getPageItems('machines');
  const partItems = controller.getPageItems('parts');
  const bomItems = controller.getPageItems('bom');
  const userItems = controller.getPageItems('users');
  const masterItems = controller.getPageItems('masterdata');

  return (
    <div className="configuration-view-page bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <TopNav />

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <StatsCards
          counts={{
            machineCount: controller.machineCount,
            partCount: controller.partCount,
            bomCount: controller.bomCount,
            userCount: controller.userCount,
            masterDataCount: controller.masterDataCount
          }}
          onSwitchTab={controller.switchTab}
        />

        <FiltersBar
          activeTab={controller.activeTab}
          onSwitchTab={controller.switchTab}
          processFilter={controller.processFilter}
          onProcessFilter={controller.setProcessFilter}
          partsCategoryFilter={controller.partsCategoryFilter}
          onPartsCategoryFilter={controller.setPartsCategoryFilter}
          masterDataFilter={controller.masterDataFilter}
          onMasterDataFilter={controller.setMasterDataFilter}
          processTypes={controller.processTypes}
          masterDataFilterOptions={controller.masterDataFilterOptions}
          onAddNew={() => controller.openConfigurationForm(controller.activeTab === 'users' ? 'users' : controller.activeTab)}
        />

        <div className={controller.activeTab === 'machines' ? '' : 'hidden'}>
          <MachinesTab
            pageItems={machineItems}
            meta={machinesMeta}
            currentPage={controller.pagination.machines.currentPage}
            onPrev={() => controller.prevPage('machines')}
            onNext={() => controller.nextPage('machines')}
            onPage={(page) => controller.goToPage('machines', page)}
            onEdit={controller.handleEditMachine}
            onDelete={controller.handleDeleteMachine}
          />
        </div>

        <div className={controller.activeTab === 'parts' ? '' : 'hidden'}>
          <PartsTab
            pageItems={partItems}
            meta={partsMeta}
            currentPage={controller.pagination.parts.currentPage}
            onPrev={() => controller.prevPage('parts')}
            onNext={() => controller.nextPage('parts')}
            onPage={(page) => controller.goToPage('parts', page)}
            onEdit={controller.handleEditPart}
            onDelete={controller.handleDeletePart}
          />
        </div>

        <div className={controller.activeTab === 'bom' ? '' : 'hidden'}>
          <BomTab
            pageItems={bomItems}
            meta={bomMeta}
            currentPage={controller.pagination.bom.currentPage}
            onPrev={() => controller.prevPage('bom')}
            onNext={() => controller.nextPage('bom')}
            onPage={(page) => controller.goToPage('bom', page)}
            onEdit={controller.handleEditBom}
            onDelete={controller.handleDeleteBom}
          />
        </div>

        <div className={controller.activeTab === 'users' ? '' : 'hidden'}>
          <UsersTab
            pageItems={userItems}
            meta={usersMeta}
            currentPage={controller.pagination.users.currentPage}
            onPrev={() => controller.prevPage('users')}
            onNext={() => controller.nextPage('users')}
            onPage={(page) => controller.goToPage('users', page)}
            roleColors={controller.userRoleColorMap}
            onOpenUserConfig={(userId) => controller.openConfigurationForm('users', { userId })}
            onViewPermissions={controller.viewUserPermissionsFromView}
          />
        </div>

        <div className={controller.activeTab === 'masterdata' ? '' : 'hidden'}>
          <MasterDataTab
            pageItems={masterItems}
            filterType={controller.masterDataFilter}
            meta={masterMeta}
            currentPage={controller.pagination.masterdata.currentPage}
            onPrev={() => controller.prevPage('masterdata')}
            onNext={() => controller.nextPage('masterdata')}
            onPage={(page) => controller.goToPage('masterdata', page)}
            onDelete={controller.handleDeleteMasterData}
          />
        </div>
      </div>

      <PermissionsModal
        user={controller.permissionModalUser}
        systemPages={controller.systemPages}
        onClose={controller.closePermissionsModal}
      />
    </div>
  );
}
