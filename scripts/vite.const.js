import path from 'path';
import fs from 'fs-extra';
import keys from 'lodash/keys';
import filter from 'lodash/filter';
import set from 'lodash/set';

const findJSModule = (folder) => {
    const moduleList = filter(fs.readdirSync(folder), (item) => {
        const extname = path.extname(item);
        return extname === '.js' && !item.startsWith('_');
    });
    return moduleList;
};

const lodash = path.join(__dirname, '../node_modules/lodash');
const moduleLodash = findJSModule(lodash);

// 构建模式下为这些外部化的依赖提供一个全局变量（lib:name）
const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'redux': 'redux',
    'react-redux': 'ReactRedux',
};
moduleLodash.forEach((item) => {
    const name = path.basename(item, '.js');
    set(globals, `lodash/${name}`, name);
});

// 忽略打包的模块
const external = keys(globals);

// 路径别称
const alias = { '@src': path.join(__dirname, '../src') };

export default {
    globals,
    external,
    alias,
};
