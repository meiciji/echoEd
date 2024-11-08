import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import Summary from "./pages/Summary/Summary";
import Modal from 'react-modal';


Modal.setAppElement('#root'); // Set your app element (usually the root div)

const routes = (
  <Router>
    <Routes>
    <Route path="/dashboard" exact element ={<Home />} />
      <Route path="/login" exact element ={<Login />} />
      <Route path="/Signup" exact element ={<SignUp  />} />
      <Route path="/summary" exact element ={<Summary  />} />
      
      
    </Routes>
  </Router>
);

const App = () => {
    return <div>{routes}</div>;
};

export default App;