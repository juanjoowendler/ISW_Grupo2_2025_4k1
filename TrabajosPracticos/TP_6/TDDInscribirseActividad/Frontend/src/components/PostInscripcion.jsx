import React from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/PostInscripcion.css";

export default function PostInscripcion({ datos }) {
  const navigate = useNavigate(); 

  if (!datos) return <p>No hay datos para mostrar.</p>;

  const { fecha, horario, tipo, cantidad } = datos;

  return (
    <div className="postinscripcion-container">
        <div className="postinscripcion-form">

      
      <h2>¡Inscripción realizada con éxito!</h2>
      <p><strong>Fecha de la visita:</strong> {fecha}</p>
      <p><strong>Horario de la visita:</strong> {horario}</p>
      <p><strong>Tipo de actividad:</strong> {tipo}</p>
      <p><strong>Cantidad de personas:</strong> {cantidad}</p>

      {/* ✅ 3. Botón para volver */}
      <button
        className="btn-volver"
        onClick={() => navigate("/inscripcion")}
      >
        Volver a inscripciones
      </button>
    </div>
        </div>

  );
}
