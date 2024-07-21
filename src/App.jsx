import React from 'react';
import { connect } from 'react-redux';
import mirror, { actions } from './mirror3';
import debug from './mirror3/debug';

const App = (props) => {

    const handleAdd = () => {
        mirror.model({
            name: 'xxx',
            state: {
                xx1: 'xx1',
                xx2: 'xx2'
            },
            effects: {
                asyncCall(payload, getState) {
                    console.log(getState());
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(`${Math.random()}-${payload}`);
                        }, 1000);
                    });
                }
            }
        });
    }

    const setModel = () => {
        actions.book.set({ author: 'Leon' });
        actions.xxx.set({ xx1: 'xxxxxx1', xx2: '3333333' });
    }

    const resetModel = () => {
        actions.book.reset();
        actions.xxx.reset();
    }

    const callActions = async () => {
        debug(actions.xxx.get(), '调用actions.xxx.get()');
        debug(actions.xxx.get('xx1'), '调用actions.xxx.get(\'xx1\')');
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
                <button onClick={() => console.log(mirror.getState())}>获取所有状态</button>
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