import webpack from 'webpack'

const DEBUG = process.env.NODE_ENV === 'development'

const defaultConfig = {
  entry: {
    'main': './src/main.js'
  },
  output: {
    publicPath: "/assets/js",
    path: path.join(__dirname, '../build/assets/js'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
			{ test: /\.js(x?)$/, exclude: /node_modules/, loader: 'babel-loader' },
			// { test: /\.less$/, loader: 'style-loader!css-loader!postcss-loader!less-loader' },
			// { test: /\.css$/, loader: "style-loader!css-loader" },
			// { test: /\.png$/, loader: "url-loader?limit=100000" },
			// { test: /.gif$/, loader: "url-loader?mimetype=image/png" },
			// { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
			// { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      "srcRoot": path.join(__dirname, "./src"),
      "defineMyCSS": "./css/defineStyle.css",
      "bootstrapCSS": nodeRoot + "/bootstrap/dist/css/bootstrap.min.css",
      "components": path.join(__dirname, "./src/components"),
      "pages": path.join(__dirname, "./src/pages"),
      "actions": path.join(__dirname, "./src/actions"),
      "stores": path.join(__dirname, "./src/stores"),
      "locales": path.join(__dirname, "./src/locales"),
      "AppDispatcher": path.join(__dirname, "./src/dispatcher/AppDispatcher"),
      "net": path.join(__dirname, "./src/utils"),
      "utils": path.join(__dirname, "./src/utils"),
      "reducers": path.join(__dirname, "./src/reducers"),
      "my-redux": path.join(__dirname, "./src/redux")
    }
  },
  plugins: [
		new webpack.NoErrorsPlugin()
  ],
  postcss: function plugins() {
    return [ require('autoprefixer') ];
  }
};
