const { nxE2EPreset } = require('@nx/cypress/plugins/cypress-preset');
const { defineConfig } = require('cypress');
module.exports = defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'pnpm exec nx run @travel-planner/travel-planner-vue:dev',
        production:
          'pnpm exec nx run @travel-planner/travel-planner-vue:preview',
      },
      ciWebServerCommand:
        'pnpm exec nx run @travel-planner/travel-planner-vue:preview',
      ciBaseUrl: 'http://localhost:4300',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
