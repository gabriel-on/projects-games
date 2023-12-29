import React from 'react'
import { Link } from 'react-router-dom'
import '../Navbar/Navbar.css'

function Navbar() {
  return (
    <div className='navbar'>
      <Link to={"/"}>
        <h1>Logo</h1>
      </Link>
      <ul>
        <li>
          <Link to={"/new"}>Adiciona Jogo</Link>
        </li>
        <li>
          <Link to={"/about"}>Sobre</Link>
        </li>
        <li>
          <Link to={"/dashboard"}>Dashboard</Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar