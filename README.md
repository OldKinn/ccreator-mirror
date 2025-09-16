# Mirror

## Installation

```bash
# Install the library
npm i @ccreator/mirror
# or
yarn add @ccreator/mirror
```

## Usage

### 1. Define Model

Note: When a model is loaded, set, reset and get methods are automatically added. Please do not add these methods to the model, otherwise they will be overwritten.
 
```js
// src/models/demo.js
import { actions } from '@ccreator/mirror';

export default {
    // Model name
    name: 'demo',
    // Model state
    state: { books: [] },
    // Synchronous methods
    reducers: {
        // Usage: actions.demo.addBook({ name: 'Bookname', author: 'Author' });
        addBook(state, payload) {
            const { books } = state;
            books.push(payload);
            return { ...state, books: [...books] };
        }
    },
    // Asynchronous methods
    effects: {
        // Usage: actions.demo.fetchList({ author: 'Author' });
        async fetchList(payload, getState) {
            // getState() gets all state data
            // console.log(getState());
            const resp = await fetch(`/books?author=${payload.author}`);
            const books = await resp.json();
            actions.demo.set({ books });
        }
    },
}
```

### 2. Initialize State Store

```js
// store.js
import mirror from '@ccreator/mirror';
import app from './models/app';
import demo from './models/demo';

// 1. Load models
mirror.model(app);
mirror.model(demo);
// Try to split models into separate files
mirror.model({
    name: 'loading',
    state: 0,
    reducers: {... ...}
});

// 2. Create data store
const store = mirror.createStore();

export default store;
```

### 3. Inject State Store

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import mirror, { Provider } from '@ccreator/mirror';
import App from './App'
import store from './store';

// Action execution callback hook
mirror.hook(console.log)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
)

```

### 4. Connect Child Components to State Store

```js
const App = ({ author, price, xxx }) => {
    ... ...
}

function dispatch({ book, xxx }) {
    return {
        author: book.author,
        price: book.price,
        xxx,
    };
}

export default connect(dispatch)(App);
```

## Dynamic Model Loading
1. Note: Models must be loaded first before calling model actions, otherwise actions.{model}.{action} will throw null value exceptions
2. Note: If using React.lazy to load components, it's recommended to use approach 1 for business module splitting
3. Note: Keep model names unique to prevent model properties and action methods from being overwritten
```js
import React from 'react';
import mirror, { actions, connect } from '@ccreator/mirror';
import model from './user';
import get from 'lodash/get';

// Approach 1: Dynamic loading with React.lazy
mirror.model(model);

const Main = ({ page, dataSource }) => {

    React.useEffect(() => {
        // Approach 2: Dynamic loading within component
        // mirror.model(model);
        const temp = actions.user.get('page');
        console.log(temp);
        actions.user.set({ page: { index: 100, size: 1024 } });
    }, []);

    return <>{JSON.stringify({ page, dataSource })}</>;
};

function dispatch({ user }) {
    // Note: When user model is not loaded, user is undefined, use lodash.get to prevent null value exceptions
    return {
        page: {
            index: get(user, 'page.index', 1),
            size: get(user, 'page.size', 10)
        },
        dataSource: user?.dataSource,
    };
}

export default connect(dispatch)(Main);
```

## Updates

**2024-07-20**
1. Implemented dynamic model loading for easier code splitting
2. Updated dependencies

**2023-01-17**  
1. Removed react-router-dom dependency
2. Modified initialization to support React 18.x
3. Removed routing-related code and optimized code structure


**2021-12-09**  
1. Upgraded react-router-dom
2. Removed react-router-redux
3. Added export declarations for Router (HashRouter), BrowserRouter, MemoryRouter and other components
4. Changed route navigation to actions.route.push() and actions.route.replace()
5. Added default set, reset and get methods to models
6. Allowed model reloading for on-demand loading scenarios
7. Models now use state for initial state values
