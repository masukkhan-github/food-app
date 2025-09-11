import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserRegister from './UserRegister.jsx'
import UserLogin from './UserLogin.jsx'
import PartnerRegister from './PartnerRegister.jsx'
import PartnerLogin from './PartnerLogin.jsx'

const AuthRoutes = () => {
  return (
    <Router>
        <Routes>
            <Route path="/user/register" element={<UserRegister/>}/>
            <Route path="/user/login" element={<UserLogin/>}/>
            <Route path="/food-partner/register" element={<PartnerRegister/>}/>
            <Route path="/food-partner/login" element={<PartnerLogin/>}/>
        </Routes>
    </Router>
  )
}

export default AuthRoutes