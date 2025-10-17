import React from 'react';
import { Link } from 'react-router-dom';
import '../style/registro.css';

function Registro() {
  return (
    <div className="registro-container">
      <form className="registro-form">
        <h2>Crear cuenta</h2>
        <input type="text" placeholder="Nombre completo" />
        <input type="email" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />
        <input type="password" placeholder="Confirmar contraseña" />
        <button type="submit">Registrarse</button>

        <p>
          ¿Ya tenés una cuenta?{' '}
          <Link to="/" style={{ color: '#0077c2', textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Registro;
