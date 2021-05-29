function genRowKey() {
    var d = new Date();
    var Y = d.getFullYear();
    var M = ("0" + (d.getMonth() + 1)).slice(-2);
    var D = ("0" + d.getDate()).slice(-2);
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var ms = ("0" + d.getMilliseconds()).slice(-3);
    var rowkey = Y + M + D + h + m + s + ms;
    return rowkey;
  }