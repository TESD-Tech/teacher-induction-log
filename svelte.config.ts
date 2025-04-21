import svelte from 'svelte/compiler';

export default {
  compilerOptions: {
    customElement: true,
    experimental: {
      emitUnknownOptions: true
    }
  },
  preprocess: []
};