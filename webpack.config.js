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
const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload');
const jsToScss = require("./jsToScss.js");
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./configuration/environment');

function getTemplateFiles(folderPaths) {
  //get files from an array of folder paths, including subfolders

  const filesList = [];

  if (folderPaths.length === 0) return

  let checkFolderPath = fp => {
    fp.forEach(folderPath => {
      const results = fs.readdirSync(folderPath);
      const files = results.filter(res => fs.lstatSync(path.resolve(folderPath, res)).isFile() && path.extname(res).toLowerCase() === '.hbs');

      if (files.length) {
        //if has files, get files with path included and push them to "filesList"
        const filePaths = files.map(file => path.resolve(folderPath, file));

        filePaths.forEach(file => {
          filesList.push(file);
        });
      }

      //check if folder has folders inside, and if so, recursively get files from these folders
      const folders = results.filter(res => fs.lstatSync(path.resolve(folderPath, res)).isDirectory());
      const innerFolderPaths = folders.map(folder => path.resolve(folderPath, folder));

      if (innerFolderPaths.length === 0) return

      checkFolderPath(innerFolderPaths);
    })
  }

  checkFolderPath(folderPaths);

  return filesList;
}
const templateFiles = getTemplateFiles([path.resolve(environment.paths.source, 'pages')]);

//read "js" folder and get JS files
const entryFiles = fs.readdirSync(
  path.resolve(environment.paths.source, "js")
).filter((file) => path.extname(file).toLowerCase() === '.js');

//object with files paths for use in HTMLWebpackPlugin chunks
let entriesObj = {
  "style": path.resolve(environment.paths.source, 'scss', 'app.scss')
}

//add JS files paths in "entriesObj"
entryFiles.forEach(f => {
  entriesObj[path.parse(f).name] = path.resolve(environment.paths.source, 'js', f)
});

const htmlPluginEntries = templateFiles.map((template) => {
  const filename = path.parse(template).name;
  const getdir = path.parse(template).dir;
  const getfolder = getdir.split('\\')[getdir.split('\\').length - 1];
  const folder = getfolder == 'pages' ? '' : getfolder;

  const chunks = [];
  //insert common.js in any html
  if (filename !== "common" && entriesObj.hasOwnProperty("common")) {
    chunks.push("common");
  }
  //if folder is not 'pages', which means it's a subfolder, insert [folder]-dir.js in the html
  if (getfolder !== 'pages') {
    chunks.push(folder + '-dir');
  }
  //insert [filename].js in the html
  if (entriesObj.hasOwnProperty(filename)) {
    chunks.push(filename);
  }
  //insert app.scss in any html
  chunks.push("style");

  /* https://plmlab.math.cnrs.fr/tbrousso/imt_maquette_reunionv4/-/tree/master/node_modules/html-webpack-plugin */
  return new HTMLWebpackPlugin({
    inject: true,
    hash: false,
    filename: `${(folder !== '' ? folder + '/' : '') + filename}.html`,
    chunks: chunks,
    template: path.resolve(environment.paths.source, template),
    templateParameters: globals, //add global variables
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
            additionalData: jsToScss(globals) //add global variables
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
              precompileOptions: {
                knownHelpersOnly: false,
              },
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
    /*
    use o plugin abaixo para pré-carregar arquivos usando tags <link rel="preload">
    usando regex para identificar os arquivos e atribuindo atributos a ele
    https://github.com/principalstudio/html-webpack-inject-preload
    */
    new HtmlWebpackInjectPreload({
      files: [
        {
          match: /\.(png|gif|jpe?g|svg)$/i,
          attributes: { as: 'image' },
        }
      ]
    }),
  ].concat(htmlPluginEntries),
  target: 'web',
};
