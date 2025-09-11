import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'

const PartnerLogin = ()=>{
  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="brand">Food Reel</div>
        <h2 className="h-title">Partner sign in</h2>
        <p className="h-sub">Sign in to manage your restaurant and orders.</p>
      </div>

      <div className="card">
        <div className="form-title">Sign in</div>
        <div className="form-row">
          <label>Contact email</label>
          <input type="email" placeholder="business@example.com" />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="Your password" />
        </div>

        <div className="actions">
          <button className="btn btn-primary">Sign in</button>
          <button className="btn btn-ghost">Continue with Google</button>
        </div>

  <div className="helper">Register as: <Link to="/user/register">Normal user</Link> · <Link to="/food-partner/register">Food partner</Link></div>
      </div>
    </div>
  )
}

export default PartnerLogin
