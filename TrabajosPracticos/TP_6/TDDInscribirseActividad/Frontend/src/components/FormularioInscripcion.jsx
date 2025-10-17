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
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, mensaje: "", tipo: "" });
  const [fecha, setFecha] = useState('');
  const [fechasDisponibles, setFechasDisponibles] = useState([]);

  const mostrarToast = (mensaje, tipo = "info") => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: "", tipo: "" }), 3000);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/actividades")
      .then((res) => res.json())
      .then((data) => {
        const actividadesFiltradas = data.filter((a) => a.cupo_disponible >= 0);
        setActividades(actividadesFiltradas);
        setPersonas([{ nombre: "", dni: "", edad: "", talla: "" }]);
        const fechas = [...new Set(actividadesFiltradas.map(a => a.fecha))];
        setFechasDisponibles(fechas);
      })
      .catch((err) => console.error("Error al obtener actividades:", err));
  }, []);


  const actividadesPorFecha = actividades.filter(a => a.fecha === fecha);
  const tiposUnicos = [...new Set(actividadesPorFecha.map(a => a.tipo))];
  const horariosDisponibles = actividadesPorFecha
    .filter((a) => a.tipo === tipoActividad)
    .map((a) => ({
      hora: a.hora,
      cupo: a.cupo_disponible,
    }))
    .filter((h) => h.cupo !== undefined); // ← solo los que tienen dato de cupo



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

    if (error) nuevosErrores[`${i}-${campo}`] = error;
    else delete nuevosErrores[`${i}-${campo}`];
    setErrores(nuevosErrores);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tipoActividad) return mostrarToast("No seleccionó el tipo de actividad a realizar");
    if (!horario) return mostrarToast("No seleccionó un horario");

    for (let i = 0; i < personas.length; i++) {
      const p = personas[i];
      if (!p.nombre) return mostrarToast(`Falta el nombre en la persona ${i + 1}`);
      if (!p.dni) return mostrarToast(`Falta el DNI en la persona ${i + 1}`);
      if (!p.edad) return mostrarToast(`Falta la edad en la persona ${i + 1}`);
      if (requiereTalla(tipoActividad) && !p.talla)
        return mostrarToast(`Falta seleccionar la talla en la persona ${i + 1}`);
    }

    if (!aceptaTerminos) return mostrarToast("Debes aceptar los términos y condiciones");
    if (Object.keys(errores).length > 0)
      return mostrarToast("Por favor corrige los errores antes de enviar.");

    mostrarToast("Inscripción enviada correctamente");
    console.log({ tipoActividad, horario, cantidad, personas, fecha });

    // 🔸 Enviar al backend por POST
    fetch("http://127.0.0.1:8000/api/inscribirse_actividad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        actividad: tipoActividad,
        fecha,
        horario,
        cantidad,
        personas
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
      })
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        mostrarToast("Inscripción guardada correctamente", "success");
        // 🔹 Podés limpiar el formulario acá si querés
      })
      .catch((err) => {
        console.error("Error al enviar inscripción:", err);
        mostrarToast("Ocurrió un error al enviar la inscripción", "error");
      });


  };

  return (
    <div className="formulario-container">
      <form onSubmit={handleSubmit} noValidate>
        <h2>Formulario de Inscripción</h2>
        {/* Fecha */}
        <label>Fecha:</label>
        <select value={fecha} onChange={(e) => {
          setFecha(e.target.value);
          setTipoActividad("");
          setHorario("");
          setCantidad(1);
          setPersonas([{ nombre: "", dni: "", edad: "", talla: "" }]);
          setErrores({});
          setAceptaTerminos(false);
        }}>

          <option value="">-- Seleccionar fecha --</option>
          {fechasDisponibles.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>


        {/* Actividad */}
        <label>Seleccioná una actividad:</label>
        <div className="botones-container">
          {actividades.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#888" }}>Cargando actividades...</p>
          ) : (
            [...new Set(actividades.map(a => a.tipo))].map((tipo) => {
              const actividadesDelTipo = actividades.filter(a => a.tipo === tipo);
              const tieneCupoEnHorario = !horario || actividadesDelTipo.some(a => a.hora === horario && a.cupo_disponible > 0);
              const estaSeleccionado = tipo === tipoActividad;
              const otraSeleccionada = tipoActividad && tipo !== tipoActividad;

              const clases = [
                "boton-toggle",
                estaSeleccionado ? "activo" : "",
                !tieneCupoEnHorario ? "inactivo" : "",
                otraSeleccionada ? "inactivo" : ""
              ].join(" ").trim();

              return (
                <button
                  key={tipo}
                  type="button"
                  className={clases}
                  onClick={() => {
                    if (tieneCupoEnHorario) setTipoActividad(tipo);
                  }}
                  disabled={!tieneCupoEnHorario}
                >
                  {tipo}
                </button>
              );
            })
          )}
        </div>

        {/* Mostrar actividad seleccionada */}
        {tipoActividad && (
          <div className="actividad-seleccionada">
            Actividad seleccionada: <b>{tipoActividad}</b>
          </div>
        )}


        {/* Horario */}
        <label>Horario:</label>
        <select
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          disabled={!tipoActividad} // 🔸 Se desactiva si no hay actividad
          required
        >
          {!tipoActividad ? (
            <option value="">-- Seleccioná una actividad --</option> // 🔹 Mensaje cuando no hay actividad
          ) : horariosDisponibles.length > 0 ? (
            <>
              <option value="">-- Seleccionar horario --</option>
              {horariosDisponibles.map((h, i) => (
                <option
                  key={i}
                  value={h.hora}
                  disabled={h.cupo <= 0}
                  style={{
                    color: h.cupo <= 0 ? "gray" : "black",
                    textDecoration: h.cupo <= 0 ? "line-through" : "none"
                  }}
                >
                  {h.hora} {h.cupo <= 0 ? "(sin cupo)" : ""}
                </option>
              ))}
            </>
          ) : (
            <option disabled value="">
              No hay horarios disponibles
            </option>
          )}
        </select>


        {/* Cantidad */}
        <label>Cantidad de personas:</label>
        <input type="number" value={cantidad} min="1" onChange={handleCantidadChange} required />

        {/* Datos de las personas */}
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

        {/* Términos y condiciones */}
        <div className="terminos-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            Acepto los {" "}
            <span className="link-terminos" onClick={(e) => {
              e.stopPropagation();
              setMostrarModal(true);
            }}
            >
              términos y condiciones
            </span>
          </label>
        </div>

        <button type="submit">Enviar inscripción</button>
      </form>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Términos y Condiciones de Participación</h3>
              <button className="cerrar-modal" onClick={() => setMostrarModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-texto">
              <p><strong>Última actualización:</strong> 14/10/2025</p>
              <p>
                Al inscribirse y participar en las actividades ofrecidas por EcoHarmony Park,
                usted acepta cumplir los siguientes términos:
              </p>
              <ul>
                <li>La inscripción es exclusiva mediante la aplicación de EcoHarmony Park.</li>
                <li>Debe completar todos los datos requeridos de forma veraz y completa.</li>
                <li>El uso de equipo de seguridad es obligatorio en actividades como Tirolesa y Palestra.</li>
                <li>El participante debe seguir las instrucciones del personal en todo momento.</li>
                <li>EcoHarmony Park puede modificar o cancelar actividades por razones operativas o climáticas.</li>
                <li>El participante asume los riesgos inherentes y exime al parque de responsabilidad, salvo negligencia grave.</li>
                <li>Los datos personales se utilizan exclusivamente para la gestión de la inscripción y seguridad.</li>
              </ul>
              <p>
                Al hacer clic en “Aceptar”, confirmas que has leído, comprendido y aceptado estos
                términos y condiciones.
              </p>
            </div>
            <div className="modal-botones">
              <button className="btn-secundario" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button
                className="btn-principal"
                onClick={() => {
                  setAceptaTerminos(true);
                  setMostrarModal(false);
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
      {toast.visible && (<div className={`toast ${toast.tipo}`}>
        {toast.mensaje}
      </div>
      )}
    </div>
  );
}
