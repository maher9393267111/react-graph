import "./App.css";
import { gql, useQuery } from "@apollo/client";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Nav from "./components/Navbar";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import React, { useState, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import PrivateRoute from "./components/PrivateRoute";
import { split, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
 import PasswordForgot from './pages/auth/PasswordForgot';
 import PasswordUpdate from './pages/auth/PasswordUpdate';
import Post from './pages/post/Post'
import Profile from './pages/auth/Profile'
import PublicRoute from './components/PublicRoute'
import Users from './pages/Users';
import SingleUser from './pages/SingleUser'
import PostUpdate from './pages/post/PostUpdate';
import SinglePost from "./pages/post/SinglePost";
import SearchResult from './components/SearchResult';
function App() {
  const { state } = useContext(AuthContext);
  const { user } = state;

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });


 // 1. create websocket link
 const wsLink = new WebSocketLink({
  uri:process.env.REACT_APP_GRAPHQL_WS_ENDPOINT ,
  options: {
      reconnect: true
  }
});




  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem("id_token");
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authtoken: user ? user.token : "",
        // authorization: token ? `Bearer ${token}` : '',
      },
    };
  });


     // 4. concat http and authtoken link
     const httpAuthLink = authLink.concat(httpLink);

     const link = split(
      // split based on operation type
      ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpAuthLink
  );


  const client = new ApolloClient({
    link:   link,
    // link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1 className="chart">hello react</h1>

        <Nav />

        <ToastContainer />
        <Switch>
        <Route exact path="/users" component={Users} />
        <Route exact path="/user/:username" component={SingleUser} />
          <Route exact path="/" component={Home} />
          <PublicRoute exact path="/register" component={Register} />
          <PublicRoute exact path="/login" component={Login} />
          
          <Route exact path="/password/forgot" component={PasswordForgot} />

          <PrivateRoute exact path="/password/update" component={PasswordUpdate} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/create/post" component={Post} />
          <Route exact path="/post/:postid" component={SinglePost} />
          <PrivateRoute exact path="/post/update/:postid" component={PostUpdate} />
          <Route exact path="/search/:query" component={SearchResult} />

          <Route
            exact
            path="/complete-registration"
            component={CompleteRegistration}
          />
        </Switch>
      </div>
    </ApolloProvider>
  );
}

export default App;

// console.log(user.token)
//   const client = new ApolloClient({
//       uri: 'http://localhost:8000/graphql',
//        cache: new InMemoryCache(),
//       request:operation => {
//           operation.setContext({
//               headers: {
//                 authtoken:  user.token
//               }
//           });
//       }
//   });
