/* eslint-disable no-trailing-spaces */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const globals = require("./globals.js");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const jsToScss = require("./jsToScss.js");
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./configuration/environment');

const templateFiles = fs.readdirSync(environment.paths.source)
  .filter((file) => path.extname(file).toLowerCase() === '.hbs');

const entryFiles = fs.readdirSync(
  path.resolve(environment.paths.source, "js")
).filter((file) => path.extname(file).toLowerCase() === '.js');

const entriesObj = {
  "style": path.resolve(environment.paths.source, 'scss', 'app.scss')
}

entryFiles.forEach(f => {
  entriesObj[path.parse(f).name] = path.resolve(environment.paths.source, 'js', f)
});

const htmlPluginEntries = templateFiles.map((template) => {
  const filename = path.parse(template).name
  const chunks = [];
  if (filename !== "common" && entriesObj.hasOwnProperty("common")) {
    chunks.push("common");
  }

  if (entriesObj.hasOwnProperty(filename)) {
    chunks.push(filename);
  }

  chunks.push("style")

  /* https://plmlab.math.cnrs.fr/tbrousso/imt_maquette_reunionv4/-/tree/master/node_modules/html-webpack-plugin */
  return new HTMLWebpackPlugin({
    inject: true,
    hash: false,
    filename: `${filename}.html`,
    chunks: chunks,
    template: path.resolve(environment.paths.source, template),
    templateParameters: globals,
  })
}
);

module.exports = {
  entry: entriesObj,
  output: {
    filename: (pathData, assetInfo) => {
      let fn = '[name].[chunkhash]';
      fn = fn.replace('.min', '');
      return `js/${fn}.min.js`;
    },
    path: environment.paths.output,
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', {
          loader: "sass-loader",
          options: {
            additionalData: jsToScss(globals)
          }
        }],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'images/[name].[hash:6][ext]',
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'fonts/[name].[hash:6][ext]',
        },
      },
      {
        test: /\.(handlebars|hbs)$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              runtime: path.resolve(__dirname, 'handlebars.config.js'),
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: [
                    {
                      name: 'removeViewBox',
                      active: false,
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: (pathData, assetInfo) => {
        let fn = '[name].[chunkhash]';
        fn = fn.replace('.min', '');
        return `css/${fn}.min.css`;
      },
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(environment.paths.source, 'bypass'),
          to: path.resolve(environment.paths.output),
          toType: 'dir',
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },
        {
          from: path.resolve(environment.paths.source, 'images', 'assets'),
          to: path.resolve(environment.paths.output, 'images', 'assets'),
          toType: 'dir',
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },
      ],
    }),
  ].concat(htmlPluginEntries),
  target: 'web',
};
