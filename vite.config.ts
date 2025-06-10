import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path from 'path';

// Read package.json to get the project name
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
);

// Use the package name as the base path (remove any scope if present)
const projectName = packageJson.name.replace(/^@[^/]+\//, '');

// Gather all .svelte files in src/lib/components, src/lib root, and src root
function gatherSvelteEntries() {
  const entries: Record<string, string> = {};

  const componentDirs = [
    path.resolve(__dirname, 'src/lib/components'),
    path.resolve(__dirname, 'src/lib'),
    path.resolve(__dirname, 'src')
  ];

  for (const dir of componentDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.svelte')) {
        const name = file.replace(/\.svelte$/, '').toLowerCase();
        entries[name] = path.resolve(dir, file);
      }
    }
  }

  return entries;
}

const componentEntries = gatherSvelteEntries();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
        dev: true
      },
      emitCss: false
    })
  ],
  base: `/${projectName}/`,
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  build: {
    outDir: `dist/WEB_ROOT/${projectName}/`,
    assetsDir: 'assets',
    rollupOptions: {
      input: componentEntries,
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
