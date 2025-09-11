import React from 'react'
import '../styles/auth.css'

const UserRegister = ()=>{
  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="brand">Food Reel</div>
        <h2 className="h-title">Welcome, foodie.</h2>
        <p className="h-sub">Create an account to start exploring and ordering from nearby restaurants.</p>
      </div>

      <div className="card">
        <div className="form-title">Create your account</div>
        <div className="form-row">
          <label>Name</label>
          <input type="text" placeholder="Your full name" />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" placeholder="Choose a secure password" />
        </div>

        <div className="actions">
          <button className="btn btn-primary">Create account</button>
          <button className="btn btn-ghost">Continue with Google</button>
        </div>

        <div className="helper">Already have an account? <a href="/user/login">Sign in</a></div>
      </div>
    </div>
  )
}

export default UserRegister
