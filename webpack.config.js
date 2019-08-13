const devCerts = require("office-addin-dev-certs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const webpack = require("webpack");

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: "@babel/polyfill",
      "src/taskpane/taskpane": "./src/taskpane/taskpane.js",
      "src/commands/commands": "./src/commands/commands.js",
      "src/helper/config":"./src/helper/config.js",
      "src/helper/login":"./src/helper/login.js",
      "src/helper/message":"./src/helper/message.js",
      "src/settings/login":"./src/settings/login.js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"]
    },
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
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader"
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: "file-loader"
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "src/taskpane/taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane"]
      }),
      new CopyWebpackPlugin([
        {
          to: "src/taskpane/taskpane.css",
          from: "./src/taskpane/taskpane.css"
        }
      ]),
      new HtmlWebpackPlugin({
        filename: "src/commands/commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"],
        inject: "body"
      }),
      new HtmlWebpackPlugin({
        filename: "src/settings/login.html",
        template: "./src/settings/login.html",
        chunks: ["polyfill", "login"]
      }),
      new CopyWebpackPlugin([
        {
          to: "src/settings/login.css",
          from: "./src/settings/login.css"
        }
      ]),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      disableHostCheck: true,      
      https: (options.https !== undefined) ? options.https : await devCerts.getHttpsServerOptions(),
      port: process.env.npm_package_config_dev_server_port || 3000
    }
  };

  return config;
};
