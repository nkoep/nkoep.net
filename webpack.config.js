const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: ["./src/index.js", "./src/sass/main.scss"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "app.js"
  },
  devtool: "source-map",
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
    })
  ]
};
