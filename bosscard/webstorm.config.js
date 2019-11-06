const path = require('path')

module.exports = {
  resolve: {
    // for WebStorm
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname),
      'themes': path.resolve(__dirname, './src/themes'),
      'components': path.resolve(__dirname,"./src/components"),
      'utils': path.resolve(__dirname,"./src/utils"),
      'config': path.resolve(__dirname,"./src/utils/config"),
      'menus': path.resolve(__dirname,"./src/utils/menus"),
      'services': path.resolve(__dirname,"./src/services"),
      'models': path.resolve(__dirname,"./src/models"),
      'routes': path.resolve(__dirname,"./src/routes"),
    },
  },
}
