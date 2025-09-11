import React from 'react'
import '../styles/auth.css'

const PartnerRegister = ()=>{
  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="brand">Food Reel</div>
        <h2 className="h-title">Partner sign up</h2>
        <p className="h-sub">Create a partner account to list your restaurant and receive orders.</p>
      </div>

      <div className="card">
        <div className="form-title">Create partner account</div>
        <div className="form-row">
          <label>Business name</label>
          <input type="text" placeholder="Restaurant or business name" />
        </div>
        <div className="form-row">
          <label>Contact email</label>
          <input type="email" placeholder="business@example.com" />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="Choose a secure password" />
        </div>

        <div className="actions">
          <button className="btn btn-primary">Create account</button>
          <button className="btn btn-ghost">Continue with Google</button>
        </div>

        <div className="helper">Already partnered? <a href="/food-partner/login">Sign in</a></div>
      </div>
    </div>
  )
}

export default PartnerRegister
