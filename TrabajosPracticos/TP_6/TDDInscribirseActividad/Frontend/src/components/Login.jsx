import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/login.css';

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Lógica para verificar usuario/contraseña (acá solo simulamos)
    // En un caso real, podrías validar contra un backend
    const usuarioValido = true;

    if (usuarioValido) {
      // Redirige a la vista del formulario de inscripción
      navigate('/inscripcion');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input type="text" placeholder="Usuario" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Ingresar</button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          ¿No tenés una cuenta?{' '}
          <Link to="/registro" style={{ color: '#3f51b5', textDecoration: 'none' }}>
            Registrate acá
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
