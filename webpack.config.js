const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "production",

  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3030,
  },
};
