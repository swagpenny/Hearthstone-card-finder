import React from 'react';
import logo from './logo.svg';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import './App.css';
import Login from './components/login'
import Signup from './components/signup'
import changePass from './components/updatePass'
import Dashboard from './components/dashboard'
import CardDetails from './components/cardDetails'
import Success from './components/success'
import Favorites from './components/favorites'

function App() {
  return (
    <BrowserRouter className="App">
     <Switch>
       <Route exact path='/' component={Login} />
       <Route path='/login' component={Login} />
       <Route path='/signup' component={Signup} />
       <Route path='/dashboard' component={Dashboard} />
       <Route path='/card/:id' component={CardDetails} />
       <Route path='/updatePassword' component={changePass} />
       <Route path='/success' component={Success} />
       <Route path='/favorites' component={Favorites} />
     </Switch>
    </BrowserRouter>
  );
}

export default App;
