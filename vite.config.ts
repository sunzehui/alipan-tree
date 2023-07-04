import { defineConfig } from 'vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import inject from '@rollup/plugin-inject'

const $ = cdn.bootcdn('jquery', 'jquery.js')
const fancytree = cdn.bootcdn('jquery.fancytree', 'jquery.fancytree-all-deps.js')
const fancytreecss = cdn.bootcdn('jquery.fancytree/dist/skin-lion/ui.fancytree.css', 'skin-awesome/ui.fancytree.css')

// https://vitejs.dev/config/
export default defineConfig(async (env) => {
  const serverHost = 'localhost'
  const serverPort = 3000
  return {
    server: {
      host: serverHost,
      port: serverPort,
      strictPort: true,
      origin: `http://${serverHost}:${serverPort}`,
    },
    plugins: [
      // 将 jQuery 注入到每个模块中
      inject({
        $: "jquery",  // 这里会自动载入 node_modules 中的 jquery
        jQuery: "jquery",
        // 'jquery.fancytree': 'jquery.fancytree',
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
          externalGlobals: {
            jquery: $.concat(
              await util.fn2dataUrl(() => {
                // @ts-ignore
                window.jQuery = window.jquery = $;
              })
            ),
            'jquery.fancytree': fancytree,
          },
          externalResource: {
            // 'jquery.fancytree/dist/skin-lion/ui.fancytree.css': fancytreecss
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
  }
})
