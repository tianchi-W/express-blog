function deleteNull(params) {
  let obj = {};
  for (const key in params) {
    if (
      params[key] === "" ||
      params[key] === null ||
      params[key] === undefined
    ) {
    } else {
      obj[key] = params[key];
    }
  }
  //   Object.entries(params).
  return obj;
}
module.exports = { deleteNull };
