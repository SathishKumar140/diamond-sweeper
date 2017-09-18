const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

app.set("view engine", "ejs");
if (process.env.NODE_ENV === 'dev') {
  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: false, 
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
  }
  }));
  app.use(require("webpack-hot-middleware")(compiler,{
    log: false,
    path: "/__what",
    heartbeat: 2000
  }));
}else{
  app.use(express.static('public'))
}

app.get('/', function (req, res) {
  var diamondContainer = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0
  ]
  res.render("home/index",{data:diamondContainer})
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
});
