import { defineConfig } from 'vite';
import monkey, { cdn,util } from 'vite-plugin-monkey';
import inject from '@rollup/plugin-inject'

const $ =  cdn.bootcdn('jquery', 'jquery.js')
const fancytree = cdn.bootcdn('jquery.fancytree', 'jquery.fancytree-all-deps.js')
const fancytreecss = cdn.bootcdn('jquery.fancytree/dist/skin-lion/ui.fancytree.css','skin-awesome/ui.fancytree.css')


function modifyCssUrlsPlugin() {
  let config:any = {}
  let server:any = {}
  let url = '/'
  return {
    name: 'modify-css-urls',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
      configureServer(_server) {
        server = _server;
      url = 'http://'+server.config.server.host + ':' + server.config.server.port;
      
    },
    transform(code, id) {
      if (id.endsWith('.css')) {
        // 读取 CSS 文件内容
        const cssContent = code;

        // 修改 CSS 文件中的 URL 相对路径
        const modifiedCssContent = cssContent.replace(/url\((.*?)\)/g, (match, _url) => {
          // 处理 URL 相对路径
          const modifiedUrl = resolveRelativeUrl(_url, url);
          // 返回修改后的 URL
          return `url(${modifiedUrl})`;
        });

        // 返回修改后的 CSS 代码
        return {
          code: modifiedCssContent,
          map: null, // 如果需要生成 Source Map，请配置正确的 Source Map
        };
      }
    },
  };
}

function resolveRelativeUrl(url, cssFilePath) {
  // 示例：将 URL 相对路径解析为绝对路径
  return cssFilePath +url.replace(/'|"/g, '')
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    modifyCssUrlsPlugin(),

    // 将 jQuery 注入到每个模块中
    inject({
      $: "jquery",  // 这里会自动载入 node_modules 中的 jquery
      jQuery: "jquery",
      'jquery.fancytree': 'jquery.fancytree',
    }),

    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://www.aliyundrive.com/s/*'],
      },
      build: {
        // 替换外部依赖为头部@require
        externalGlobals:{
          jquery: $.concat(
            await util.fn2dataUrl(() => {
              // @ts-ignore
              window.jQuery = window.jquery = $;
            })
          ),
          'jquery.fancytree': fancytree,
        },
        externalResource: {
          'jquery.fancytree/dist/skin-lion/ui.fancytree.css': cdn.bootcdn()
        }
      }
    }),
  ],
  build: {
    commonjsOptions: {
      // 支持 commonjs 的 require
      transformMixedEsModules: true
    }
  }
});
