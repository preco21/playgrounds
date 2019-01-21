import React from 'react';
import {hot} from 'react-hot-loader';
import {Switch, Route, Redirect} from 'react-router-dom';
import importedComponent from 'react-imported-component';

const Index = importedComponent(() => import('./index'));
const Second = importedComponent(() => import('./second'));

function _Routes() {
  return (
    <Switch>
      <Route path="/" component={Index} exact />
      <Route path="/second" component={Second} exact />
      <Redirect to="/" />
    </Switch>
  );
}

export const Routes = hot(module)(_Routes);
