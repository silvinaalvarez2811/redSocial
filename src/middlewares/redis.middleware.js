const client = require("../redis");

const checkCache = (modelo) => {
  return async (req, res, next) => {
    const id = req.params.id ?? -1;
    const data = await client.get(`${modelo}-${id}`);
    if (data) {
      return res.status(200).json(JSON.parse(data));
    }
    next();
  };
}

const checkCacheAll = (modelo) => {
  return async (req, res, next) => {
    const data = await client.get(`${modelo}`);
    if (data) {
      return res.status(200).json(JSON.parse(data));
    }
    next();
  };
}

const deleteCache = (modelo) => {
  return async (req, res, next) => {
    const id = req.params.id ?? -1;
    const dataById = await client.get(`${modelo}-${id}`);
    const dataByModel = await client.get(`${modelo}-all`);

    if (dataById && dataByModel) {
      await client.del(`${modelo}-${id}`);
    }
    next(); 
  }
};

module.exports = { checkCache, checkCacheAll, deleteCache };