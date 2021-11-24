import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import  Home  from './homeComponents/Home.js';
import AllRestaurantInfo from './homeComponents/AllRestaurantInfo';
import RestaurantMenu from './homeComponents/RestaurantMenu.js';
import Admin from './AdminComponent/Admin'


function App() {
  return (
  
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/menuitems" component={RestaurantMenu} exact/>
          <Route path="/admin" component={Admin} exact/>
        </Switch>
      </Router>
    
  );
}

export default App;
