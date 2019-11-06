import { resolve } from 'path';

export default {
  define: {
    'process.env.API_DOMAIM': 'https://back.zanbogroup.com'
  },
  // context: {
  // 	iconFontCSS: '//at.alicdn.com/t/font_790434_uji0d1oep5p.css'
  // },
  alias: {
    themes: resolve(__dirname, './src/themes'),
    components: resolve(__dirname, './src/components'),
    utils: resolve(__dirname, './src/utils'),
    config: resolve(__dirname, './src/utils/config'),
    menus: resolve(__dirname, './src/utils/menus'),
    services: resolve(__dirname, './src/services'),
    models: resolve(__dirname, './src/models'),
    routes: resolve(__dirname, './src/routes'),
    pages: resolve(__dirname, './src/pages')
  },
  theme: './theme.config.js',
  urlLoaderExcludes: [/\.svg$/],
  ignoreMomentLocale: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        // hd: true,
        dva: {
          // immer: true,
          dynamicImport: true,
          hmr: true
        },
        library: 'react',
        // hardSource: /* isMac */ process.platform === "darwin",
        antd: true,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/Loader/Loader'
        },
        // dll: {
        //   include: ["dva", "dva/router", "dva/saga", "antd/es"],
        //   exclude: [],
        // },
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /tableConfig\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
            /chart\/Container\.js$/
          ]
        }
      }
    ]
  ],
  chainWebpack(config, { webpack }) {
    // 设置 svg
    config.module
      .rule('svg')
      .test(/\.svg$/i)
      .use('loader')
      .loader('svg-sprite-loader');
  }
};
