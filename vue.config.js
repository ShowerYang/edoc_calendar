module.exports = {
  pluginOptions: {
    quasar: {
      treeShake: true
    }
  },
  transpileDependencies: [
    /[\\\/]node_modules[\\\/]quasar[\\\/]/
  ],
  // project deployment base
  publicPath: '',
  // where to output built files
  outputDir: 'dist',
  // where to put static assets (js/css/img/font/...)
  assetsDir: 'static_exceptional_days',
  // filename for index.html (relative to outputDir)
  indexPath: 'exceptional_days.php',  
}
