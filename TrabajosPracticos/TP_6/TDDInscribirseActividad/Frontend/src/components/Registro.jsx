// src/components/Registro.jsx
export default function Registro() {
    return (
      <div>
        <h2>Registro</h2>
        <form>
          <input type="text" placeholder="Nombre" /><br />
          <input type="email" placeholder="Email" /><br />
          <input type="password" placeholder="Contraseña" /><br />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    );
  }
  