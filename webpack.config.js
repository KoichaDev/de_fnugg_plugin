const autoprefixer = require('autoprefixer');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin'); // This is to bundle our CSS
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // This is to minifi CSS files
const TerserPlugin = require('terser-webpack-plugin'); // This is to minify JavaScript files
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // This is to minify JavaScript files

// argv contains any options that we send in our command. When we run npm start with development mode to check error s
module.exports = (env, argv) => {
  function isDevelopment() {
    return argv.mode === 'development';
  }

  const config = {
    entry: './src/editor.js', // our entry point
    output: {
      filename: 'bundle.js',
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true,
            },
          },
        }),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCSSExtractPlugin({
        filename: 'bundle.css',
      }),
    ],
    devtool: isDevelopment() ? 'cheap-module-source-map' : 'source-map', // This will give more accurate code information when checkin on the console tab window of your code
    module: {
      rules: [
        // Rules can add loaders, and loaders let you do some kind of transformation to files before bundling them in Webpack
        {
          test: /\.js$|jsx/, //regex to tell webpack what files we want to run this loader for
          exclude: /(node_modules)/, // no need to transpile our node_modules. Only our test /\.js$/ files
          use: {
            loader: 'babel-loader', // transpile ES6 features to ES5. Babel loader is the webpack integration of the babel library
            options: {
              presets: [
                '@babel/preset-env',
                [
                  '@babel/preset-react',
                  {
                    pragma: 'React.createElement',
                    pragmaFragment: 'React.Fragment',
                    development: isDevelopment(), // This will give more information in our React error message
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss/, // This regex will match SASS,SCSS or CSS
          use: [
            MiniCSSExtractPlugin.loader, // this will the css-loader, put it on your tag head-tag, because WP requires the wp_enqueue
            'css-loader', // CSS Loader will take the output of the SASS-loader which is compiled to CSS
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer()],
              },
            },
            'sass-loader', // compile SASS into CSS
          ],
        },
      ],
    },
  };
  return config;
};
