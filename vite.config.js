/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import Const from './scripts/vite.const';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));

process.env.VITE_TIMESTAMP = new Date().toLocaleString();
process.env.VITE_PKG_VERSION = pkg.version;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh()],
    server: {
        host: '0.0.0.0',
        port: 3030,
    },
    build: {
        minify: false,
        lib: {
            entry: path.resolve(__dirname, 'src/mirror3/index.js'),
            name: 'mirror',
            fileName: (format) => `mirror.${format}.js`,
        },
        rollupOptions: {
            external: Const.external,
            output: {
                exports: 'named',
                globals: Const.globals,
            },
        },
    },
});
