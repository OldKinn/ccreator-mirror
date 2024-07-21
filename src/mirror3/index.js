import * as mirror from './mirror';
import debug from './debug';

const version = import.meta.env.VITE_PKG_VERSION || 'x.x.x';
const time = import.meta.env.VITE_TIMESTAMP || 'xxxx-xx-xx xx:xx:xx';
const message = `当前版本:${version}, 编译时间:${time}`;
debug(message, '@ccreator/mirror', 'orange');

export { Provider, connect } from 'react-redux';

export * from './mirror';

export default mirror;
