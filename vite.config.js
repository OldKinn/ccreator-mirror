const path = require('path');
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    lib: {
        entry: path.resolve(__dirname, 'src/mirror/index.js'),
        name: 'mirror',
        fileName: (format) => `mirror.${format}.js`,
    },
    rollupOptions: {
        external: [
            'react',
            'react-dom',
        ],
        output: {
            exports: 'named',
            // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
            globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
            },
        },
    },
},
})
