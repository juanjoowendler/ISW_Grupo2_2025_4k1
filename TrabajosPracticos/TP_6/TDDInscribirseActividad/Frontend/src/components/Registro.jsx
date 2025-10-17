import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/registro.css';

function Registro() {
  const navigate = useNavigate();
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí podrías agregar la lógica de registro real (API, validaciones, etc.)
    // ...

    // Mostrar el mensaje de éxito
    setRegistroExitoso(true);
  };

  const handleIrInicio = () => {
    navigate('/');
  };

  return (
    <div className="registro-container">
      {!registroExitoso ? (
        <form className="registro-form" onSubmit={handleSubmit}>
          <h2>Crear cuenta</h2>
          <input type="text" placeholder="Nombre completo" required />
          <input type="email" placeholder="Correo electrónico" required />
          <input type="password" placeholder="Contraseña" required />
          <input type="password" placeholder="Confirmar contraseña" required />
          <button type="submit">Registrarse</button>

          <p>
            ¿Ya tenés una cuenta?{' '}
            <Link to="/" style={{ color: '#0077c2', textDecoration: 'none' }}>
              Iniciar sesión
            </Link>
          </p>
        </form>
      ) : (
        <div className="mensaje-exito">
          <h2>🎉 ¡Registro exitoso!</h2>
          <p>Tu cuenta ha sido creada correctamente.</p>
          <button onClick={handleIrInicio}>Ir a iniciar sesión</button>
        </div>
      )}
    </div>
  );
}

export default Registro;
