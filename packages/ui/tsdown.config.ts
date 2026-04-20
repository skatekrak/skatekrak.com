import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: false,
    clean: true,
    deps: {
        neverBundle: ['react', 'react-dom', '@tanstack/react-table'],
        alwaysBundle: [/^@krak\/ui/, /^@krak\/utils/],
    },
    banner: '"use client";',
});
