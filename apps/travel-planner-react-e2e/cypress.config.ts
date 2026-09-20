const { nxE2EPreset } = require('@nx/cypress/plugins/cypress-preset');
const { defineConfig } = require('cypress');
module.exports = defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'pnpm exec nx run @travel-planner/travel-planner-react:dev',
        production:
          'pnpm exec nx run @travel-planner/travel-planner-react:preview',
      },
      ciWebServerCommand:
        'pnpm exec nx run @travel-planner/travel-planner-react:preview',
      ciBaseUrl: 'http://localhost:4300',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
