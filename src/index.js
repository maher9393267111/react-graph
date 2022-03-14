import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "react-toastify/dist/ReactToastify.css";
import reportWebVitals from './reportWebVitals';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/authContext';
import { BrowserRouter } from 'react-router-dom';
// apollo client
import { ApolloClient, InMemoryCache, gql,ApolloProvider } from "@apollo/client";

// const client = new ApolloClient({
// uri:'http://localhost:8000/graphql',
//   // credentials: true,
//   cache: new InMemoryCache(),
// });




ReactDOM.render(
  
     <BrowserRouter>
            <AuthProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </AuthProvider>
        </BrowserRouter>
 
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
