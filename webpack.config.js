// eslint-disable-next-line no-undef
module.exports = {
  devtool: "cheap-module-source-map",
  "process.env": {
    NODE_ENV: JSON.stringify("production"),
  },
  resolve: {
    // eslint-disable-next-line no-undef
    fallback: { crypto: false },
  },
};
