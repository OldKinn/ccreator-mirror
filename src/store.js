import mirror from './mirror3';

mirror.model({
    name: 'book',
    state: {
        author: '张三',
        price: 10,
    },
});

const store = mirror.createStore();

export default store;
