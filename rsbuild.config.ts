import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    favicon: './src/assets/icon.svg',
  },
  plugins: [pluginReact()],
});
