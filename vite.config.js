/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import Const from './scripts/vite.const';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh()],
    server: {
        host: '0.0.0.0',
        port: 3000,
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
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: Const.globals,
            },
        },
    },
});
