const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const mode = process.env.NODE_ENV || 'development';

console.log("========================");
console.log("webpack mode", mode);
console.log("========================");

const cssnano = require('cssnano');

const cssnanoProcess = cssnano.process;

cssnano.process = function(source, processOpts, pluginOpts) {
  return cssnanoProcess.call(this, source, processOpts, Object.assign(pluginOpts || {}, {
    preset: [ 'default', { calc: false } ]
  }));
};

module.exports = {
    mode: mode,
    entry: {
        bundle: path.resolve(__dirname, './src/web/js/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js'
    },
    plugins: [
        new LiveReloadPlugin({appendScriptTag: true}),
        new CopyPlugin([
            {from: './src/web/index.html', to: 'index.html', toType: 'file'},
            {from: './src/web/icons', to: 'icons/'}
        ]),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].[id].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnanoProcess,
            cssProcessorPluginOptions: {
                preset: ['default', {discardComments: {removeAll: true}}]
            },
            canPrint: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.(html|svelte)$/,
                use: 'svelte-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [
                                    './theme',
                                    './node_modules'
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
};
