import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { configureStore } from './store/configureStore';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import './utils/firebase';

const client = new ApolloClient({
  uri: 'http://localhost/graphql',
  cache: new InMemoryCache()
});

ReactDOM.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
    <Provider store={configureStore()}>
      <Router>
        <App />
      </Router>
    </Provider>
  </ApolloProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
