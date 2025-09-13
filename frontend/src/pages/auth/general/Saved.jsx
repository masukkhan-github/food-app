import React from 'react'

import './home.css'

import { Link } from 'react-router-dom'

const Saved = ()=>{
  return (
    <main className="saved-page">
      <div className="saved-card">
        <h2>Saved</h2>
        <p>No saved items yet.</p>
        <p><Link to="/home">Go back home</Link></p>
      </div>
    </main>
  )
}

export default Saved
