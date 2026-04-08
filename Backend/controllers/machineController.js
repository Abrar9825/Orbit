const Machine = require('../models/Machine');

function escapeRegex(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function createMachinesBulk(req, res) {
  try {
    const { procesType, machines } = req.body;

    if (!procesType) {
      return res.status(400).json({
        status: 'error',
        message: 'Process Type is required',
      });
    }

    if (!machines || !Array.isArray(machines) || machines.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one machine is required',
      });
    }

    // Validate all machines
    for (let machine of machines) {
      if (!machine.machineName || !machine.machineCode || !machine.capacity) {
        return res.status(400).json({
          status: 'error',
          message: 'Machine Name, Machine Code, and Capacity are required for all machines',
        });
      }
    }

    // Check for duplicate machine codes in the request
    const machineCodes = machines.map((m) => m.machineCode);
    if (new Set(machineCodes).size !== machineCodes.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate machine codes in request',
      });
    }

    // Check if any machine code already exists in database
    const existingMachines = await Machine.find({ machineCode: { $in: machineCodes } });
    if (existingMachines.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Machine codes already exist: ${existingMachines.map((m) => m.machineCode).join(', ')}`,
      });
    }

    // Create all machines
    const machineData = machines.map((machine) => ({
      procesType,
      machineName: machine.machineName,
      machineCode: machine.machineCode,
      capacity: machine.capacity,
    }));

    const createdMachines = await Machine.insertMany(machineData);

    res.status(201).json({
      status: 'success',
      message: `${createdMachines.length} machines created successfully`,
      data: createdMachines,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function createMachine(req, res) {
  try {
    const { procesType, machineName, machineCode, capacity } = req.body;

    if (!procesType || !machineName || !machineCode || !capacity) {
      return res.status(400).json({
        status: 'error',
        message: 'Process Type, Machine Name, Machine Code, and Capacity are required',
      });
    }

    const existingMachine = await Machine.findOne({ machineCode });
    if (existingMachine) {
      return res.status(400).json({
        status: 'error',
        message: 'Machine Code already exists',
      });
    }

    const newMachine = new Machine({
      procesType,
      machineName,
      machineCode,
      capacity,
    });

    await newMachine.save();

    res.status(201).json({
      status: 'success',
      message: 'Machine created successfully',
      data: newMachine,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getAllMachines(req, res) {
  try {
    const rawProcesType = String(req.query.procesType || req.query.processType || '').trim();

    let query = { isActive: true };
    if (rawProcesType) {
      query.procesType = new RegExp(`^${escapeRegex(rawProcesType)}$`, 'i');
    }

    const machines = await Machine.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      message: 'Machines fetched successfully',
      data: machines,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getMachineById(req, res) {
  try {
    const { id } = req.params;
    const machine = await Machine.findById(id);

    if (!machine) {
      return res.status(404).json({ status: 'error', message: 'Machine not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Machine fetched successfully',
      data: machine,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateMachine(req, res) {
  try {
    const { id } = req.params;
    const { procesType, machineName, machineCode, capacity } = req.body;

    const machine = await Machine.findById(id);

    if (!machine) {
      return res.status(404).json({ status: 'error', message: 'Machine not found' });
    }

    if (!procesType || !machineName || !machineCode || !capacity) {
      return res.status(400).json({
        status: 'error',
        message: 'Process Type, Machine Name, Machine Code, and Capacity are required',
      });
    }

    if (machineCode !== machine.machineCode) {
      const existingMachine = await Machine.findOne({ machineCode });
      if (existingMachine) {
        return res.status(400).json({
          status: 'error',
          message: 'Machine Code already exists',
        });
      }
    }

    machine.procesType = procesType;
    machine.machineName = machineName;
    machine.machineCode = machineCode;
    machine.capacity = capacity;

    await machine.save();

    res.status(200).json({
      status: 'success',
      message: 'Machine updated successfully',
      data: machine,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteMachine(req, res) {
  try {
    const { id } = req.params;
    const machine = await Machine.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!machine) {
      return res.status(404).json({ status: 'error', message: 'Machine not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Machine deleted successfully',
      data: machine,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getMachinesByProcessType(req, res) {
  try {
    const procesType = String(req.params.procesType || '').trim();

    const machines = await Machine.find({
      procesType: new RegExp(`^${escapeRegex(procesType)}$`, 'i'),
      isActive: true,
    }).sort({ machineName: 1 });

    res.status(200).json({
      status: 'success',
      message: `Machines for ${procesType} fetched successfully`,
      data: machines,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  createMachine,
  createMachinesBulk,
  getAllMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
  getMachinesByProcessType,
};
