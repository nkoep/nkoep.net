const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const devMode = argv.mode !== "production";

  const staticAssets = ["pages", "posts"].map(folder => {
    return {from: `./${folder}`, to: `./${folder}`}
  });
  ["favicon.ico", "posts.toml"].forEach(
    asset => staticAssets.push({from: `./${asset}`}));

  return {
    mode: "development",
    entry: {
      "app": ["./src/index.js", "./src/sass/main.scss"],
      "404": ["./src/404.js", "./src/sass/404.scss"]
    },
    output: {
      path: path.resolve(__dirname, "public"),
      filename: "[name].js",
      publicPath: "/"
    },
    devtool: devMode ? "source-map" : false,
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
              presets: [
                ["@babel/preset-env", {modules: false}]
              ]
            }
          }
        },
        {
          test: /\.(s*)css$/i,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin(staticAssets),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/templates/index.html",
        filename: "index.html",
        chunks: ["app"]
      }),
      new HtmlWebpackPlugin({
        template: "./src/templates/404.html",
        filename: "404.html",
        chunks: ["404"]
      })
    ]
  }
};
