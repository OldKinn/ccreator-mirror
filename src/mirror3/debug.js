/* eslint-disable no-console */

const debug = (content, type = '', color = 'teal') => {
    console.log(`%c---------------->${type}`, `color:${color};font-weight:bolder;`);
    console.log(content);
    console.log('%c<----------------', `color:${color};font-weight:bolder;`);
};

export default debug;
