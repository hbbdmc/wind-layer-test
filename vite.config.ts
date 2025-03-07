
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
        // 支持jsx或者tsx语法 @link https://www.npmjs.com/package/@vitejs/plugin-vue-jsx
        vueJsx: VueJsx()
      }
    })
  ],
  // server:{
  //   https: false,
  //   proxy: {
  //     '/hfWeatherApi': {
  //       target: 'https//w3.hifleet.com', // 接口的域名
  //       // target: 'http://localhost:3000', // 接口的域名
  //       secure: true, // 如果是https接口，需要配置这个参数
  //       changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
  //       rewrite: path => path.replace(/^\/hfWeatherApi`/, ''),
  //     },
  //   }
  // }
})
