import { defineNuxtModule } from 'nuxt/kit';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from "@tailwindcss/vite";

const stripRouterVolarPlugin = defineNuxtModule({
  meta: {
    name: 'strip-router-volar-plugin',
  },

  setup(_options, nuxt) {
    nuxt.hook('modules:done', () => {
      nuxt.hook('prepare:types', ({ tsConfig }) => {
        const plugins = tsConfig.vueCompilerOptions?.plugins;

        if (!Array.isArray(plugins)) {
          return;
        }

        tsConfig.vueCompilerOptions!.plugins = plugins.filter(
          (plugin) => plugin !== 'vue-router/volar/sfc-route-blocks',
        );
      });
    });
  }
});

export default defineNuxtConfig({
  workspaceDir: '../../',

  modules: [stripRouterVolarPlugin],

  devtools: {
    enabled: true,
  },

  devServer: {
    host: 'localhost',
    port: 4200,
  },

  typescript: {
    typeCheck: true,
  },

  imports: {
    autoImport: true,
  },

  css: ['~/assets/css/styles.css'],

  vite: {
    plugins: [
      nxViteTsPaths(),
      tailwindcss()
    ],
  },
});