function changeNameFunc(name) {
  let arr = name.split("");
  arr.map((item, index) => {
    if (item == "_") {
      arr.splice(index, 1);
      arr[index] = arr[index].toUpperCase();
    }
  });
  return arr.join("")[0].toUpperCase() + arr.join("").substr(1);
}

module.exports = (options) => {
  return async (req, res, next) => {
    const modelName = changeNameFunc(req.baseUrl.slice(1));
    req.Model = require(`../model/${modelName}.js`);
    next();
  };
};
