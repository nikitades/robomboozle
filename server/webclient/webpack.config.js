// export default {
//   entry: 'src/index.ts',
//   output: {
//     path: path.resolve(__dirname, "..","public","js"),
//   },
// };

const path = require("path");
const HtmlWebpackPlugin = require('./node_modules/html-webpack-plugin');
const { CleanWebpackPlugin } = require('./node_modules/clean-webpack-plugin/dist/clean-webpack-plugin');

const config = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, "..", "public", "js"),
    filename: 'bundle.[hash].min.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "templates", "index.html"),
      filename: path.resolve(__dirname, "..", "public", "index.html")
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["bundle*js"]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      { test: /\.tsx?$/, loader: "ts-loader" }
    ],
  },
};

module.exports = config;