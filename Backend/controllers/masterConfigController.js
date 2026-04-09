const {
  getMasterConfigDocument,
  addMasterConfigValue,
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

module.exports = {
  getConfigMaster,
  addConfigMasterValue,
};
