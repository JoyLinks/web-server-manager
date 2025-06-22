const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	devServer: {
		static: './dist',
	},
	entry: {
		manage: './src/manage/index.js',
		webdav: './src/webdav/index.js',
		index: './src/index.js'
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[contenthash:8].css',
		}),
		new CopyWebpackPlugin({
			patterns: [{
				from: 'src/images/logo.png'
			}, {
				from: 'src/images/favicon.ico'
			}]
		}),
		new HtmlWebpackPlugin({
			title: 'MANAGE',
			template: 'src/manage/index.html',
			filename: 'manage.html',
			chunks: ['manage']
		}),
		new HtmlWebpackPlugin({
			title: 'MOBILE',
			template: 'src/webdav/index.html',
			filename: 'webdav.html',
			chunks: ['webdav']
		}),
		new HtmlWebpackPlugin({
			title: 'INDEX',
			template: 'src/index.html',
			filename: 'index.html',
			chunks: ['index']
		})
	],
	output: {
		filename: 'js/[contenthash:8].js',
		chunkFilename: '[chunkhash:8].js',
		assetModuleFilename: 'static/[contenthash:8][ext]',
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
		}
	},
	resolve: {
		alias: {
			components: path.resolve(__dirname, 'src/components/')
		}
	},
	module: {
		rules: [{
			test: /\.css$/i,
			use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
			// MiniCssExtractPlugin.loader 和 'style-loader' 有冲突不能同时配置
		}, {
			test: /\.(png|svg|jpg|jpeg|gif)$/i,
			type: 'asset/resource',
		}, {
			test: /\.(woff|woff2|eot|ttf|otf)$/i,
			type: 'asset/resource',
		}, {
			test: /\.html$/i,
			use: ['html-loader', '@joyzl/html-include-loader'],
		}]
	}
};