/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh()],
    build: {
        minify: false,
        lib: {
            entry: path.resolve(__dirname, 'src/mirror/index.js'),
            name: 'mirror',
            fileName: (format) => `mirror.${format}.js`,
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'lodash/set',
                'lodash/get',
                'lodash/forEach',
                'lodash/remove',
                'lodash/cloneDeep',
                'lodash/pick',
                'lodash/isArray',
            ],
            output: {
                exports: 'named',
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'lodash/set': 'set',
                    'lodash/get': 'get',
                    'lodash/forEach': 'forEach',
                    'lodash/remove': 'remove',
                    'lodash/cloneDeep': 'cloneDeep',
                    'lodash/pick': 'pick',
                    'lodash/isArray': 'isArray',
                },
            },
        },
    },
});
