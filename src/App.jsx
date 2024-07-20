import React from 'react';
import { connect } from 'react-redux';
import mirror, { actions } from './mirror3';

const App = (props) => {

    const handleAdd = () => {
        mirror.model({
            name: 'xxx',
            state: {
                xx1: 'xx1',
                xx2: 'xx2'
            },
            effects: {
                asyncCall(data, rootState) {
                    console.log(rootState)
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(`${Math.random()}-${data}`);
                        }, 1000);
                    });
                }
            }
        });
    }

    const setModel = () => {
        actions.book.set({ author: 'Leon' });
        actions.xxx.set({ xx1: 'xxxxxx1', xxxx: '3333333' });
    }

    const resetModel = () => {
        actions.book.reset();
        actions.xxx.reset();
    }

    const callActions = async () => {
        const data = await actions.xxx.asyncCall(101010);
        console.log(data);
    }

    return (
        <div>
            <div>传递模型属性：</div>
            <div>{JSON.stringify(props)}</div>
            <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleAdd}>测试动态加载</button>
                <button onClick={setModel}>设置属性</button>
                <button onClick={resetModel}>重置属性</button>
                <button onClick={callActions}>调用actions</button>
            </div>
        </div>
    );
};

function dispatch({ book, xxx }) {
    return {
        author: book.author,
        price: book.price,
        xxx,
    };
}

export default connect(dispatch)(App);