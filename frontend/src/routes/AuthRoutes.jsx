import React from 'react';
import { Routes, Route } from 'react-router-dom';

import UserRegister from '../pages/auth/UserRegister.jsx';
import UserLogin from '../pages/auth/UserLogin.jsx';
import PartnerRegister from '../pages/auth/PartnerRegister.jsx';
import PartnerLogin from '../pages/auth/PartnerLogin.jsx';
import Home from '../pages/auth/general/Home.jsx';
import CreateFood from '../pages/auth/food-item/CreateFood.jsx';
import Profile from '../pages/auth/food-item/Profile.jsx';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/food-partner/register" element={<PartnerRegister />} />
      <Route path="/food-partner/login" element={<PartnerLogin />} />
      <Route path="/" element={<Home />} />
      <Route path="/create-food" element={<CreateFood />} />
      <Route path="/food-partner/:id" element={<Profile />} />
    </Routes>
  );
};

export default AuthRoutes;
