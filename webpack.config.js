/* eslint-disable no-trailing-spaces */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');

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
    favicon: path.resolve(environment.paths.source, 'images', 'favicon.png'),
    inject: true,
    hash: false,
    filename: `${filename}.html`,
    chunks: chunks,
    template: path.resolve(environment.paths.source, template),
    base: {
      'href': '',
      'target': '_self',
    },
    meta: {
      'viewport': 'width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no',
      'format-detection': 'telephone=no',
      'msapplication-TileColor': '#222222',
      'theme-color': '#ffffff',
    }
  })
}
);

module.exports = {
  entry: entriesObj,
  output: {
    filename: 'js/[name].[chunkhash].js',
    path: environment.paths.output,
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'resolve-url-loader', { loader: 'sass-loader', options: { sourceMap: true } }],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/design/[name].[hash:6].[ext]',
              publicPath: '../',
              limit: environment.limits.images,
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {

            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:6].[ext]',
              publicPath: '../',
              limit: environment.limits.fonts,
            },
          },
        ],
      },
      {
        test: /\.hbs$/,
        use: [
          'handlebars-loader',
        ]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css',
    }),
    new ImageMinimizerPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: extendDefaultPlugins([
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ]),
            },
          ],
        ],
      },
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(environment.paths.source, 'images', 'content'),
          to: path.resolve(environment.paths.output, 'images', 'content'),
          toType: 'dir',
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },

        {
          from: path.resolve(environment.paths.source, 'bypass'),
          to: path.resolve(environment.paths.output),
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
