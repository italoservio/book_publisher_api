
const helperService = {

  validDate(str) {
    var arr = str.split('-');
    if (
    str.length !== 10   ||
    arr[0].length !== 4 ||
    arr[1].length !== 2 ||
    arr[2].length !== 2) {
      return false
    }
    return true
  },

  empty(val) {
    if (
    val === undefined ||
    val === "" ||
    val === [] ||
    val === {} ||
    val === null ||
    val === 0
    ) {
      return true;
    }
    return false;
  }
}

module.exports = helperService;