import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: false,
    clean: true,
    deps: {
        neverBundle: ['react', 'react-dom'],
        alwaysBundle: [/^@krak\/ui/],
    },
    banner: '"use client";',
});
