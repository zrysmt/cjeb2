var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin'); // 生成html文件
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopywebpackPlugin = require('copy-webpack-plugin');

var cesiumSource = 'node_modules/cesium/Source';
var cesiumWorkers = '../Build/Cesium/Workers';

var projectName = "cjeb2";
var assetsFolder = '';
var templateFolder = '';


// 定义当前是否处于开发debug阶段
var isDebug = JSON.stringify(JSON.parse(process.env.DEBUG || 'false'));
var webRoot = JSON.stringify(JSON.parse(process.env.WEBROOT || 'false')); //是否是一般的服务器地址

if (webRoot === 'true') { //for normal server
    assetsFolder = '';
    templateFolder = '';
} else { //for PHP
    assetsFolder = '/assets/' + projectName + '/';
    templateFolder = '/template/' + projectName + '/';
}

// 根据isDebug变量定义相关config变量
if (process.argv[1].indexOf('webpack-dev-server') !== -1) isDebug = 'true'; //兼容mac端

var configVarObj = {};
if (isDebug === 'true') { //for debug
    console.log('I am in debuging............');
    configVarObj = {
        htmlPath: 'index.html', // 定义输出html文件路径
        // devtool: 'cheap-source-map' // 生成sourcemap,便于开发调试
        devtool: 'eval' // 生成sourcemap,便于开发调试
    };
} else { //for release
    console.log('I am in releasing............');
    configVarObj = {
        htmlPath: path.join(__dirname, 'output' + templateFolder + '/index.html'), // 定义输出html文件路径
        devtool: ''
    };
}

module.exports = {
    context: path.join(__dirname, 'app'),
    // 获取项目入口JS文件
    entry: {
        app: './index.jsx',
        vendors: [
            'react',
            'react-dom',
            'react-router/lib/Router',
            'react-router/lib/hashHistory',
            'react-router/lib/useRouterHistory',
            'echarts'
            // 'jquery'
        ]
    },
    output: {
        // 文件输出目录
        path: path.resolve(__dirname, 'output'),
        // 输出文件名
        filename: assetsFolder + 'js' + '/[name].min.js?[hash]',
        // cmd、amd异步加载脚本配置名称
        chunkFilename: assetsFolder + 'js' + '/[name].chunk.js?[hash]',
        publicPath: '',
        // Needed to compile multiline strings in Cesium
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty'
    },
    module: {
        loaders: [{
                test: /\.css$/,
                exclude: /\.useable\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass"
            },
            {
                test: /\.useable\.css$/,
                exclude: /node_modules/,
                loader: "style-loader/useable!css-loader"
            },
            /*下面两行的作用是分离css*/
            /*{ example: /\.css$/, loader:ExtractTextPlugin.extract("style-loader", "css-loader") },
              { example: /\.scss$/, loader:ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader") }, //sass加载器*/
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            },
            {
                test: /\.(png|jpg|svg)$/,
                loader: 'url?limit=8192&name=imgs/[hash:8].[name].[ext]'
            },
            { test: /\.json$/, exclude: /node_modules/, loader: 'json-loader' },
        ],
        noParse: [path.join(__dirname, "node_modules/openlayers/dist/ol.js")]
    },
    postcss: [
        autoprefixer()
    ],
    devtool: configVarObj.devtool, // 生成sourcemap,便于开发调试
    resolve: {
        extensions: ['', '.js', '.jsx', '.json'],
        alias: {
            // Cesium module name
            cesium: path.resolve(__dirname, cesiumSource)
        }
    },
    // enable dev server
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        // ajax 代理到6000端口
        proxy: {
            '/**': {
                target: 'http://127.0.0.1:8000',
                secure: false
            }
        },
        host: '127.0.0.1'
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: 'cjeb2',
            template: path.join(__dirname, './app/index.html'),
            filename: configVarObj.htmlPath,
            minify: {
                minifyJS: true,
                removeComments: true,
                minifyCSS: true
            },
        }),
        //热替换的时候最好关闭
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),*/
        // new ExtractTextPlugin("output/[name].css"),//独立css文件
        // new webpack.optimize.CommonsChunkPlugin('vendors', assetsFolder + 'js/[name].chunk.js?[hash]'),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: assetsFolder + 'js/[name].chunk.js?[hash]' }),

        /* new webpack.ProvidePlugin({
            "$": "jquery"
         }),*/
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new CopywebpackPlugin([ { from: path.join('../',cesiumSource, cesiumWorkers), to: 'Workers' } ]),
        new CopywebpackPlugin([ { from: path.join('../',cesiumSource, 'Assets'), to: 'Assets' } ]),
        new CopywebpackPlugin([ { from: path.join('../',cesiumSource, 'Widgets'), to: 'Widgets' } ])  ,       
        //定义全局变量
        new webpack.DefinePlugin({
            __DEV__: isDebug,
            __WEBROOT__: webRoot,
            CESIUM_BASE_URL: JSON.stringify('')
        })
        
    ]
};