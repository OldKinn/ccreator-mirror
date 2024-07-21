import * as mirror from './mirror';

const version = import.meta.env.VITE_PKG_VERSION || 'x.x.x';
const time = import.meta.env.VITE_TIMESTAMP || 'xxxx-xx-xx xx:xx:xx';
mirror.debug(`当前版本:${version}, 编译时间:${time}`, '@ccreator/mirror', 'orange');

export { Provider, connect } from 'react-redux';

export * from './mirror';

export default mirror;
