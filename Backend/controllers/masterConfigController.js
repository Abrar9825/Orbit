const {
  getMasterConfigDocument,
  addMasterConfigValue,
  setMasterConfigValues,
  removeMasterConfigValue,
} = require('../services/masterConfigService');

async function getConfigMaster(req, res) {
  const configData = await getMasterConfigDocument();

  return res.status(200).json({
    status: 'success',
    message: 'Master config fetched successfully',
    data: configData,
  });
}

async function addConfigMasterValue(req, res) {
  try {
    const { key, value } = req.body;
    const configData = await addMasterConfigValue(key, value);

    return res.status(200).json({
      status: 'success',
      message: 'Master config value added successfully',
      data: configData,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message,
    });
  }
}

async function updateConfigMaster(req, res) {
  try {
    const configData = await setMasterConfigValues(req.body || {});

    return res.status(200).json({
      status: 'success',
      message: 'Master config updated successfully',
      data: configData,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message,
    });
  }
}

async function removeConfigMasterValue(req, res) {
  try {
    const key = req.body?.key || req.query?.key;
    const value = req.body?.value || req.query?.value;
    const configData = await removeMasterConfigValue(key, value);

    return res.status(200).json({
      status: 'success',
      message: 'Master config value removed successfully',
      data: configData,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message,
    });
  }
}

module.exports = {
  getConfigMaster,
  addConfigMasterValue,
  updateConfigMaster,
  removeConfigMasterValue,
};
