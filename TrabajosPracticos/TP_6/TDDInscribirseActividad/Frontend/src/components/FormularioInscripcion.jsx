import { useState, useEffect } from "react";
import "../styles/FormularioInscripcion.css";

const requiereTalla = (tipo) => tipo === "Tirolesa" || tipo === "Palestra";

export default function FormularioInscripcion() {
  const [actividades, setActividades] = useState([]);
  const [tipoActividad, setTipoActividad] = useState("");
  const [horario, setHorario] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [personas, setPersonas] = useState([]);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/actividades")
      .then((res) => res.json())
      .then((data) => {
        const actividadesFiltradas = data.filter((a) => a.cupo_disponible > 0);
        setActividades(actividadesFiltradas);
        setPersonas([{ nombre: "", dni: "", edad: "", talla: "" }]);
      })
      .catch((err) => {
        console.error("Error al obtener actividades:", err);
      });
  }, []);

  const tiposUnicos = [...new Set(actividades.map((a) => a.tipo))];
  const horariosDisponibles = actividades
    .filter((a) => a.tipo === tipoActividad && a.cupo_disponible > 0)
    .map((a) => a.hora);

  const handleCantidadChange = (e) => {
    const n = parseInt(e.target.value) || 0;
    setCantidad(n);
    setPersonas(
      Array.from({ length: n }, (_, i) => personas[i] || { nombre: "", dni: "", edad: "", talla: "" })
    );
  };

  const handlePersonaChange = (i, campo, valor) => {
    const copia = [...personas];
    copia[i][campo] = valor;
    setPersonas(copia);
    validarCampo(i, campo, valor);
  };

  const validarCampo = (i, campo, valor) => {
    const nuevosErrores = { ...errores };
    let error = "";

    if (campo === "nombre" && valor.trim().length < 3)
      error = "El nombre debe tener al menos 3 caracteres.";
    if (campo === "dni" && !/^\d{7,8}$/.test(valor))
      error = "El DNI debe tener 7 u 8 números.";
    if (campo === "edad" && (valor < 1 || valor > 100))
      error = "Edad inválida.";
    if (campo === "talla" && requiereTalla(tipoActividad) && !valor)
      error = "Selecciona una talla.";

    if (error) {
      nuevosErrores[`${i}-${campo}`] = error;
    } else {
      delete nuevosErrores[`${i}-${campo}`];
    }
    setErrores(nuevosErrores);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tipoActividad) {
      alert("No selecciono el tipo de actividad a realizar");
      return;
    }

    if (!horario) {
        alert("No a seleccionado un horario");
        return;
      }

    for (let i = 0; i < personas.length; i++) {
  const p = personas[i];

  if (!p.nombre) {
    alert(`Falta ingresar el nombre en el formulario de la persona ${i + 1}`);
    return;
  }

  if (!p.dni) {
    alert(`Falta ingresar el DNI en el formulario de la persona ${i + 1}`);
    return;
  }

  if (!p.edad) {
    alert(`Falta ingresar la edad en el formulario de la persona ${i + 1}`);
    return;
  }

  if (requiereTalla(tipoActividad) && !p.talla) {
    alert(`Falta seleccionar la talla en el formulario de la persona ${i + 1}`);
    return;
  }
}
    if (!aceptaTerminos) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    if (Object.keys(errores).length > 0) {
      alert("Por favor corrige los errores antes de enviar.");
      return;
    }

    alert("Inscripción enviada correctamente");
    console.log({
      tipoActividad,
      horario,
      cantidad,
      personas,
    });
    window.location.href = "/"
  };

  return (
    <div className="formulario-container">
      <form onSubmit={handleSubmit} noValidate>
        <h2>Formulario de Inscripción</h2>

        {/* Actividades */}
        <label>Actividad:</label>
        <select
          value={tipoActividad}
          onChange={(e) => {
            setTipoActividad(e.target.value);
            setHorario("");
          }}
          required
        >
          <option value="">-- Seleccionar --</option>
          {tiposUnicos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        {/* Horarios */}
        {tipoActividad && (
          <>
            <label>Horario:</label>
            <select value={horario} onChange={(e) => setHorario(e.target.value)} required>
              <option value="">-- Seleccionar --</option>
              {horariosDisponibles.map((h, i) => (
                <option key={i} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Cantidad */}
        <label>Cantidad de personas:</label>
        <input
          type="number"
          value={cantidad}
          min="1"
          onChange={handleCantidadChange}
          required
        />

        {/* Personas */}
        {personas.length > 0 && (
          <>
            <h3>Datos de las personas:</h3>
            {personas.map((p, i) => (
              <div key={i} className="persona-card">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={p.nombre}
                  onChange={(e) => handlePersonaChange(i, "nombre", e.target.value)}
                  className={errores[`${i}-nombre`] ? "error" : ""}
                />
                {errores[`${i}-nombre`] && <span className="mensaje-error">{errores[`${i}-nombre`]}</span>}

                <label>DNI:</label>
                <input
                  type="text"
                  value={p.dni}
                  onChange={(e) => handlePersonaChange(i, "dni", e.target.value)}
                  className={errores[`${i}-dni`] ? "error" : ""}
                />
                {errores[`${i}-dni`] && <span className="mensaje-error">{errores[`${i}-dni`]}</span>}

                <label>Edad:</label>
                <input
                  type="number"
                  value={p.edad}
                  onChange={(e) => handlePersonaChange(i, "edad", e.target.value)}
                  className={errores[`${i}-edad`] ? "error" : ""}
                />
                {errores[`${i}-edad`] && <span className="mensaje-error">{errores[`${i}-edad`]}</span>}

                {requiereTalla(tipoActividad) && (
                  <>
                    <label>Talla:</label>
                    <select
                      value={p.talla}
                      onChange={(e) => handlePersonaChange(i, "talla", e.target.value)}
                      className={errores[`${i}-talla`] ? "error" : ""}
                    >
                      <option value="">-- Seleccionar --</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                    {errores[`${i}-talla`] && (
                      <span className="mensaje-error">{errores[`${i}-talla`]}</span>
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        )}

        {/* Términos */}
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
          />
          Acepto los términos y condiciones
        </label>
        <p className="nota">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non justo a magna fermentum dictum.
        </p>

        <button type="submit">Enviar inscripción</button>
      </form>
    </div>
  );
}