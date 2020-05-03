import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider, connect, useDispatch, useSelector } from 'react-redux';

// import { renderRoutes } from 'react-router-config';
import './App.scss';
import { store } from './store';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

function App(){
  return (
    <Provider store={store}>
      <Router>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <PrivateRoute>
                <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
              </PrivateRoute>
            </Switch>
          </React.Suspense>
      </Router>
    </Provider>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  const dispatch = useDispatch();
  const { isInitialized, isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    if(!isInitialized) {
      dispatch({
        type: 'user/loadFromStorage',
      });
    }
  }, [isInitialized]);

  console.log('PrivateRoute Loading');

  if(!isInitialized) {
    return loading();
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
      isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
