const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: '.',
  use: { baseURL: 'http://localhost:4173' },
  webServer: { command: 'npx --yes serve -l 4173 ..', port: 4173, reuseExistingServer: true },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: /drag/ }]
});
