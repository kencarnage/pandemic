const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/scripts/main.js', // Main entry point for your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: true, // Clean the output directory before each build
    assetModuleFilename: 'assets/[name][ext]', // Output folder for assets
  },
  mode: 'development', // Set the mode to development
  devtool: 'source-map', // Enable source maps for debugging
  devServer: {
    static: path.resolve(__dirname, 'public'), // Serve static files from the public directory
    open: true, // Open the browser automatically
    port: 3000, // Port for the dev server
    hot: true, // Enable hot module replacement
    compress: true, // Enable gzip compression for faster loading
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Rule for processing CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|glb|gltf)$/, // Rule for handling static assets
        type: 'asset/resource',
      },
      {
        test: /\.js$/, // Rule for JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel to transpile ES6+ code
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template file for the HTML
      filename: 'index.html', // Output file name
      scriptLoading: 'module', // Ensures ES module script loading
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.glb', '.gltf'], // Resolve these extensions automatically
  },
};
