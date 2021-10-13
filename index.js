const hash = require("md5-file");
const { statSync } = require("fs");

console.log(
  statSync(
    `C:\\Users\\xnerhu\\projects\\wexond\\cloud\\services\\updates\\e2e\\assets\\4.0.0.patch`,
  ),
);
