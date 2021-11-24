import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import  Home  from './homeComponents/Home.js';
import AllRestaurantInfo from './homeComponents/AllRestaurantInfo';
import Admin from './AdminComponent/Admin.js';



function App() {
  return (
  
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/admin" component={Admin} exact />
        </Switch>
      </Router>
    
  );
}

export default App;
