import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Home  from './homeComponents/Home.js';
import AllRestaurantInfo from './homeComponents/AllRestaurantInfo';



function App() {
  return (
  
      <Router>
        <Routes>
          <Route path="/" exact component={Home} />
        </Routes>
      </Router>
    
  );
}

export default App;
