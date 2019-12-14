const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const staticAssets = ["pages", "posts"].map(folder => {
  return {from: `./${folder}`, to: `./${folder}`}
});
staticAssets.push({from: "./favicon.ico"});

module.exports = (env, argv) => ({
  mode: "development",
  entry: ["./src/index.js", "./src/sass/main.scss"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "app.js",
    publicPath: "/"
  },
  devtool: argv.mode === "development" ? "source-map" : false,
  devServer: {
    contentBase: "./public",
    historyApiFallback: {
      rewrites: [{
        from: /^\/404$/,
        to: "/404.html"
      }]
    }
  },
  watch: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/templates/index.html",
      filename: "index.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/templates/404.html",
      filename: "404.html",
      inject: false
    }),
    new CopyWebpackPlugin(staticAssets)
  ]
});
