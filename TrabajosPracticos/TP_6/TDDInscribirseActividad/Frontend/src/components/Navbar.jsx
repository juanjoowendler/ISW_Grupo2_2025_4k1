import React from 'react'
import '../styles/Navbar.css' // Estilos opcionales

export default function Navbar () {
  return (
    <nav className='navbar'>

      <div className='navbar-logo'>
        <img src='../public/EcoPark.png' alt='Logo' />
      </div>

      <div className='navbar-user'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='currentColor'
          className='user-icon'
          viewBox='0 0 16 16'
        >
          <path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z' />
          <path
            fillRule='evenodd'
            d='M8 8a3 3 0 100-6 3 3 0 000 6z'
          />
        </svg>
        <span className='usuario-texto'>Usuario</span>
      </div>
    </nav>
  )
}
