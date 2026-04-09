import useConfigurationController from './useConfigurationController';
import './configuration.css';

function SuccessToast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 font-medium z-50 backdrop-blur-sm">
      <i className="fas fa-check-circle text-lg"></i>
      <span>{message}</span>
    </div>
  );
}

function TopHeader({ onBack, onDashboard }) {
  return (
    <div className="primary-gradient">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            title="Back"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-semibold text-white">Configuration Management</h1>
        </div>
        <button
          onClick={onDashboard}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all border border-white/20"
        >
          <i className="fas fa-gauge"></i> Go to Dashboard
        </button>
      </div>
    </div>
  );
}

function Tabs({ activeTab, onSwitch }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-3">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'machines', icon: 'fas fa-cogs', desktop: 'Machine Configuration', mobile: 'Machines' },
          { id: 'parts', icon: 'fas fa-puzzle-piece', desktop: 'Parts Configuration', mobile: 'Parts' },
          { id: 'bom', icon: 'fas fa-list-alt', desktop: 'BOM Template Management', mobile: 'BOM' },
          { id: 'pages', icon: 'fas fa-users-cog', desktop: 'User Information & Access Control', mobile: 'Users' },
          { id: 'masterdata', icon: 'fas fa-database', desktop: 'Master Data', mobile: 'Master' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSwitch(tab.id)}
            className={`tab-item whitespace-nowrap ${activeTab === tab.id ? 'active' : ''}`}
          >
            <i className={tab.icon}></i>
            <span className="hidden sm:inline">{tab.desktop}</span>
            <span className="sm:hidden">{tab.mobile}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MachinesSection({
  processType,
  processTypes,
  machineDetails,
  onChangeProcess,
  onChangeMachine,
  onAddMachineRow,
  onRemoveMachineRow,
  onSubmit,
  onReset,
  isEditMode
}) {
  return (
    <div className="content-section p-2 sm:p-3">
      <div className="config-card">
        <div className="section-title text-sm" style={{ color: 'var(--primary)' }}>
          <i className="fas fa-cogs text-sm"></i>
          Machine Configuration
        </div>

        <div className="mb-3">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Process Type <span className="text-red-500">*</span>
          </label>
          <select
            value={processType}
            onChange={(event) => onChangeProcess(event.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
          >
            <option value="">Select Process Type</option>
            {processTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div id="machineDetailsContainer">
          {machineDetails.map((row, index) => (
            <div key={row.id} id={`machineDetail${index + 1}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">Machine Name</label>
                  <input
                    type="text"
                    placeholder="Enter machine name"
                    value={row.name}
                    onChange={(event) => onChangeMachine(row.id, 'name', event.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">Machine Code</label>
                  <input
                    type="text"
                    placeholder="Enter machine code"
                    value={row.code}
                    onChange={(event) => onChangeMachine(row.id, 'code', event.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">Size</label>
                  <input
                    type="text"
                    placeholder="Enter size"
                    value={row.size}
                    onChange={(event) => onChangeMachine(row.id, 'size', event.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
              </div>

              {index > 0 ? (
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => onRemoveMachineRow(row.id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                  >
                    <i className="fas fa-trash text-red-500"></i> Remove
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddMachineRow}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
          >
            <i className="fas fa-plus"></i> Add More Machine
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 px-4 py-1.5 primary-btn rounded-lg text-sm font-medium"
          >
            <i className="fas fa-save"></i> {isEditMode ? 'Update Machine' : 'Add Machine'}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
          >
            <i className="fas fa-redo"></i> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function PartsSection({ selectedPartCategory, partState, onFieldChange, onSubmit, onReset, isEditMode }) {
  const isValve = selectedPartCategory === 'valve';

  return (
    <div className="content-section p-2 sm:p-3">
      <div className="config-card">
        <div className="section-title text-sm" style={{ color: 'var(--primary)' }}>
          <i className="fas fa-puzzle-piece text-sm"></i>
          Part Configuration
        </div>

        <div id="partDynamicInputs">
          {isValve ? (
            <div className="bg-white p-3 rounded-xl border-2 border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    ITEM NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={partState.valve.itemName}
                    onChange={(event) => onFieldChange('valve', 'itemName', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">MODEL NO</label>
                  <input
                    type="text"
                    value={partState.valve.modelNo}
                    onChange={(event) => onFieldChange('valve', 'modelNo', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter model number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    SIZE <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={partState.valve.size}
                    onChange={(event) => onFieldChange('valve', 'size', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter size"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    MOC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={partState.valve.moc}
                    onChange={(event) => onFieldChange('valve', 'moc', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Material of Construction"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">CLASS</label>
                  <input
                    type="text"
                    value={partState.valve.class}
                    onChange={(event) => onFieldChange('valve', 'class', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter class"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">REMARK</label>
                  <input
                    type="text"
                    value={partState.valve.remark}
                    onChange={(event) => onFieldChange('valve', 'remark', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter remark"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-3 rounded-xl border-2 border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    ITEM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={partState.parts.item}
                    onChange={(event) => onFieldChange('parts', 'item', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">EQUIPMENT</label>
                  <input
                    type="text"
                    value={partState.parts.equipment}
                    onChange={(event) => onFieldChange('parts', 'equipment', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Equipment name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    MOC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={partState.parts.moc}
                    onChange={(event) => onFieldChange('parts', 'moc', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Material of Construction"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">REMARKS</label>
                  <input
                    type="text"
                    value={partState.parts.remarks}
                    onChange={(event) => onFieldChange('parts', 'remarks', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Remarks"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    QTY <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={partState.parts.qty}
                    onChange={(event) => onFieldChange('parts', 'qty', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">INVOICE</label>
                  <input
                    type="text"
                    value={partState.parts.invoice}
                    onChange={(event) => onFieldChange('parts', 'invoice', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Invoice number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">PARTY</label>
                  <input
                    type="text"
                    value={partState.parts.party}
                    onChange={(event) => onFieldChange('parts', 'party', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Party name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">DATE</label>
                  <input
                    type="date"
                    value={partState.parts.date}
                    onChange={(event) => onFieldChange('parts', 'date', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 px-4 py-1.5 primary-btn rounded-lg text-sm font-medium"
          >
            <i className="fas fa-save"></i> {isEditMode ? 'Update Part' : 'Add Part'}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
          >
            <i className="fas fa-redo"></i> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function BomSection({
  selectedBomType,
  bomState,
  bomParts,
  onBomField,
  onAddPart,
  onRemovePart,
  onPartField,
  onSubmit,
  onReset,
  isEditMode
}) {
  const isValve = selectedBomType === 'valve';

  return (
    <div className="content-section p-2 sm:p-3">
      <div className="config-card">
        <div className="section-title text-sm" style={{ color: 'var(--primary)' }}>
          <i className="fas fa-list-alt text-sm"></i>
          BOM Template
        </div>

        <div id="bomDynamicInputs" className="mb-4">
          {isValve ? (
            <div className="bg-white p-3 rounded-xl border-2 border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    Valve Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bomState.valve.valveName}
                    onChange={(event) => onBomField('valve', 'valveName', event.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  >
                    <option value="">Select valve type</option>
                    <option value="Butterfly Valve">Butterfly Valve</option>
                    <option value="Dual Plate Check Valve">Dual Plate Check Valve</option>
                    <option value="Air Valve">Air Valve</option>
                    <option value="Sluice Valve">Sluice Valve</option>
                    <option value="Non Return Valve">Non Return Valve</option>
                    <option value="Flow Control Valve">Flow Control Valve</option>
                    <option value="Pressure Reducing Valve">Pressure Reducing Valve</option>
                    <option value="Altitude Control Valve">Altitude Control Valve</option>
                    <option value="On/Off Valve">On/Off Valve</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bomState.valve.valveSize}
                    onChange={(event) => onBomField('valve', 'valveSize', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter size"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bomState.valve.valveClass}
                    onChange={(event) => onBomField('valve', 'valveClass', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter class"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    MOC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bomState.valve.valveMOC}
                    onChange={(event) => onBomField('valve', 'valveMOC', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Material of Construction"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    End Connection <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bomState.valve.valveEndConnection}
                    onChange={(event) => onBomField('valve', 'valveEndConnection', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter end connection"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    Flanged Std <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bomState.valve.valveFlangedStd}
                    onChange={(event) => onBomField('valve', 'valveFlangedStd', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter flanged standard"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    Operation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bomState.valve.valveOperation}
                    onChange={(event) => onBomField('valve', 'valveOperation', event.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                  >
                    <option value="">Select operation type</option>
                    <option value="Gear">Gear</option>
                    <option value="Manual">Manual</option>
                    <option value="Actuator">Actuator</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-3 rounded-xl border-2 border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    Part Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bomState.parts.partName}
                    onChange={(event) => onBomField('parts', 'partName', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter part name"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bomState.parts.partSize}
                    onChange={(event) => onBomField('parts', 'partSize', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter size"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={bomState.parts.partQuantity}
                    onChange={(event) => onBomField('parts', 'partQuantity', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-600">Remarks</label>
                  <input
                    type="text"
                    value={bomState.parts.partRemarks}
                    onChange={(event) => onBomField('parts', 'partRemarks', event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter remarks"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div id="bomPartsContainer" className="mb-4 space-y-3">
          {bomParts.map((row, index) => (
            <div key={row.id} className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-blue-800">Part {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => onRemovePart(row.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-all"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Part Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter part name"
                    value={row.partName}
                    onChange={(event) => onPartField(row.id, 'partName', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter size"
                    value={row.size}
                    onChange={(event) => onPartField(row.id, 'size', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={row.quantity}
                    onChange={(event) => onPartField(row.id, 'quantity', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={onAddPart}
            className="inline-flex items-center gap-2 px-4 py-2 primary-btn rounded-lg text-sm font-medium"
          >
            <i className="fas fa-plus"></i> Add Part
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 px-4 py-1.5 primary-btn rounded-lg text-sm font-medium"
          >
            <i className="fas fa-save"></i> {isEditMode ? 'Update BOM Template' : 'Save BOM Template'}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
          >
            <i className="fas fa-redo"></i> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function UsersSection({
  userForm,
  systemPages,
  permissions,
  onUserField,
  onPermissionChange,
  onApproveAll,
  onSave,
  onClear,
  isEditMode
}) {
  return (
    <div className="content-section p-2 sm:p-3">
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center gap-2 mb-3">
          <i className="fas fa-users-cog text-sm" style={{ color: 'var(--primary)' }}></i>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            Add New User & Assign Pages
          </h2>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
        >
          <div className="mb-3">
            <h3 className="text-xs font-semibold mb-2 text-gray-900">User Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">User Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name"
                  value={userForm.name}
                  onChange={(event) => onUserField('name', event.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  value={userForm.email}
                  onChange={(event) => onUserField('email', event.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={userForm.password}
                  onChange={(event) => onUserField('password', event.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Role</label>
                <select
                  value={userForm.role}
                  onChange={(event) => onUserField('role', event.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Select Page Access & CRUD Operations</h3>
              <button
                type="button"
                onClick={onApproveAll}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-all"
              >
                <i className="fas fa-check-double"></i> Approve All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3" id="pageCardsContainer">
              {systemPages.map((page) => {
                const perms = permissions[page.id] || {
                  create: true,
                  read: true,
                  update: true,
                  delete: true
                };

                return (
                  <div key={page.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--primary)' }}>
                        {page.name}
                      </h4>
                      <p className="text-xs text-gray-500">{page.file}</p>
                    </div>

                    <div className="space-y-1.5">
                      {[
                        { key: 'create', color: 'text-green-600', label: 'Create' },
                        { key: 'read', color: 'text-blue-600', label: 'Read' },
                        { key: 'update', color: 'text-yellow-600', label: 'Update' },
                        { key: 'delete', color: 'text-red-600', label: 'Delete' }
                      ].map((permission) => (
                        <label key={permission.key} className="flex items-center gap-2 cursor-pointer p-1 rounded">
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 cursor-pointer"
                            style={{ accentColor: 'var(--primary)' }}
                            checked={Boolean(perms[permission.key])}
                            onChange={(event) =>
                              onPermissionChange(page.id, permission.key, event.target.checked)
                            }
                          />
                          <i className={`fas fa-circle ${permission.color}`} style={{ fontSize: '6px' }}></i>
                          <span className="text-xs font-medium text-gray-700">{permission.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-white rounded text-sm font-medium transition-all"
              style={{ background: 'var(--primary)' }}
            >
              <i className="fas fa-save"></i> {isEditMode ? 'Update User' : 'Save User'}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MasterDataSection({ rows, onAdd, onRemove, onChange, onSave }) {
  const sections = [
    {
      key: 'endConnections',
      title: 'End Connections',
      icon: 'fas fa-plug',
      wrapperClass: 'bg-blue-50 border-blue-200',
      headingClass: 'text-blue-900',
      buttonClass: 'bg-blue-600 hover:bg-blue-700',
      placeholder: 'e.g., Flanged, Threaded, Welded',
      addText: 'Add End Connection'
    },
    {
      key: 'sizes',
      title: 'Sizes',
      icon: 'fas fa-ruler',
      wrapperClass: 'bg-green-50 border-green-200',
      headingClass: 'text-green-900',
      buttonClass: 'bg-green-600 hover:bg-green-700',
      placeholder: 'e.g., 1", 2", 4", DN50, DN100',
      addText: 'Add Size'
    },
    {
      key: 'classes',
      title: 'Classes',
      icon: 'fas fa-layer-group',
      wrapperClass: 'bg-purple-50 border-purple-200',
      headingClass: 'text-purple-900',
      buttonClass: 'bg-purple-600 hover:bg-purple-700',
      placeholder: 'e.g., 150#, 300#, 600#, PN16, PN25',
      addText: 'Add Class'
    }
  ];

  return (
    <div className="content-section p-2 sm:p-3">
      <div className="config-card">
        <div className="section-title">
          <i className="fas fa-database"></i>
          Master Data Management
        </div>
        <p className="text-xs text-gray-600 mb-4">
          Manage End Connections, Sizes, and Classes that will appear in dropdowns across the
          application.
        </p>

        {sections.map((section) => (
          <div key={section.key} className={`mb-6 p-4 rounded-lg border ${section.wrapperClass}`}>
            <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${section.headingClass}`}>
              <i className={section.icon}></i> {section.title}
            </h3>
            <div className="space-y-2">
              {rows[section.key].map((row) => (
                <div key={row.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={row.value}
                    placeholder={section.placeholder}
                    onChange={(event) => onChange(section.key, row.id, event.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(section.key, row.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-all"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onAdd(section.key)}
              className={`mt-3 px-3 py-1.5 text-white rounded-lg text-xs font-medium transition-all ${section.buttonClass}`}
            >
              <i className="fas fa-plus"></i> {section.addText}
            </button>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSave}
            className="primary-btn px-6 py-2 rounded-lg text-sm font-semibold"
          >
            <i className="fas fa-save"></i> Save All Master Data
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionsModal({ user, pages, onClose }) {
  if (!user) {
    return null;
  }

  const assignedPages = Object.entries(user.permissions || {});

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-[95vw] sm:max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 text-white p-3 sm:p-4 flex items-center justify-between" style={{ background: 'var(--primary)' }}>
          <h2 className="text-base sm:text-lg font-bold">{user.name}&apos;s Permissions</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <i className="fas fa-times text-sm sm:text-base"></i>
          </button>
        </div>

        <div className="p-3 sm:p-6">
          {assignedPages.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-ban text-gray-300 text-5xl mb-3"></i>
              <p className="text-gray-500 text-sm">No permissions assigned</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedPages.map(([pageId, perms]) => {
                const page = pages.find((item) => item.id === pageId);
                if (!page) {
                  return null;
                }

                return (
                  <div key={pageId} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-xs">{page.name}</h4>
                      <span className="text-xs text-gray-500">{page.file}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {perms.create ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                          <i className="fas fa-plus-circle"></i> Create
                        </span>
                      ) : null}
                      {perms.read ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                          <i className="fas fa-eye"></i> Read
                        </span>
                      ) : null}
                      {perms.update ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                          <i className="fas fa-edit"></i> Update
                        </span>
                      ) : null}
                      {perms.delete ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                          <i className="fas fa-trash"></i> Delete
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfigurationPage() {
  const controller = useConfigurationController();

  return (
    <div className="configuration-page bg-gray-50 min-h-screen font-sans text-gray-800">
      <SuccessToast message={controller.successMessage} />

      <TopHeader onBack={controller.goToViewPage} onDashboard={controller.goToDashboard} />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <Tabs activeTab={controller.activeTab} onSwitch={controller.switchTab} />

        <div className={controller.activeTab === 'machines' ? '' : 'hidden'}>
          <MachinesSection
            processType={controller.processType}
            processTypes={controller.processTypes}
            machineDetails={controller.machineDetails}
            onChangeProcess={controller.setProcessType}
            onChangeMachine={controller.setMachineField}
            onAddMachineRow={controller.addMachineDetail}
            onRemoveMachineRow={controller.removeMachineDetail}
            onSubmit={controller.handleAddMachine}
            onReset={controller.resetMachineForm}
            isEditMode={controller.isMachineEditMode}
          />
        </div>

        <div className={controller.activeTab === 'parts' ? '' : 'hidden'}>
          <PartsSection
            selectedPartCategory={controller.selectedPartCategory}
            partState={controller.partState}
            onFieldChange={controller.setPartField}
            onSubmit={controller.handleAddPart}
            onReset={controller.resetPartForm}
            isEditMode={controller.isPartEditMode}
          />
        </div>

        <div className={controller.activeTab === 'bom' ? '' : 'hidden'}>
          <BomSection
            selectedBomType={controller.selectedBomType}
            bomState={controller.bomState}
            bomParts={controller.bomParts}
            onBomField={controller.setBomField}
            onAddPart={controller.addBomPart}
            onRemovePart={controller.removeBomPart}
            onPartField={controller.setBomPartField}
            onSubmit={controller.handleAddBom}
            onReset={controller.resetBomForm}
            isEditMode={controller.isBomEditMode}
          />
        </div>

        <div className={controller.activeTab === 'pages' ? '' : 'hidden'}>
          <UsersSection
            userForm={controller.userForm}
            systemPages={controller.systemPages}
            permissions={controller.userPermissions}
            onUserField={controller.setUserField}
            onPermissionChange={controller.togglePermission}
            onApproveAll={controller.approveAllPages}
            onSave={controller.saveUser}
            onClear={controller.clearUserForm}
            isEditMode={controller.isUserEditMode}
          />
        </div>

        <div className={controller.activeTab === 'masterdata' ? '' : 'hidden'}>
          <MasterDataSection
            rows={controller.masterDataRows}
            onAdd={controller.addMasterDataRow}
            onRemove={controller.removeMasterDataRow}
            onChange={controller.setMasterDataRowValue}
            onSave={controller.saveMasterDataValues}
          />
        </div>
      </div>

      <PermissionsModal
        user={controller.permissionModalUser}
        pages={controller.systemPages}
        onClose={controller.closePermissionsModal}
      />
    </div>
  );
}
