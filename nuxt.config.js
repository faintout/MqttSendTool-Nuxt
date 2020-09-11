const webpack = require("webpack");
module.exports = {
  plugins: [
    {
      src: "~plugins/ElementUI",
      ssr: true,
    },
  ],
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
      }),
    ],
    vendor: ["element-ui"],
  },
  head:{
      title:'MQTT批处理工具',
    meta: [
      { charset: 'utf-8' },
    ],
      link:[
        // {rel:'icon',type:'image/x-icon',href:''}
      ]
  }
};
