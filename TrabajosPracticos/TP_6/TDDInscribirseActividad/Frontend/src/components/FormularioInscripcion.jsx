import { useState, useEffect } from 'react';

const requiereTalla = (tipo) => tipo === 'Tirolesa' || tipo === 'Palestra';

export default function FormularioInscripcion() {
  const [actividades, setActividades] = useState([]);
  const [tipoActividad, setTipoActividad] = useState('');
  const [horario, setHorario] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [personas, setPersonas] = useState([]);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/actividades')
      .then(res => res.json())
      .then(data => {
        const actividadesFiltradas = data.filter(a => a.cupo_disponible > 0);
        setActividades(actividadesFiltradas);
        console.log("Actividades cargadas:", actividadesFiltradas);
      })
      .catch(err => {
        console.error('Error al obtener actividades:', err);
      });
  }, []);

  const tiposUnicos = [...new Set(actividades.map(a => a.tipo))];
  console.log("Tipos unicos", tiposUnicos);

  const horariosDisponibles = actividades
    .filter(a => a.tipo === tipoActividad && a.cupo_disponible > 0)
    .map(a => a.hora);

  const handleCantidadChange = (e) => {
    const n = parseInt(e.target.value) || 0;
    setCantidad(n);
    setPersonas(Array.from({ length: n }, (_, i) => personas[i] || {
      nombre: '',
      dni: '',
      edad: '',
      talla: ''
    }));
  };

  const handlePersonaChange = (i, campo, valor) => {
    const copia = [...personas];
    copia[i][campo] = valor;
    setPersonas(copia);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!aceptaTerminos) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }
    console.log({
      tipoActividad,
      horario,
      cantidad,
      personas,
    });
    alert("Inscripción enviada correctamente");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Formulario de Inscripción</h2>

      {/* Actividades */}
      <label>Actividad:</label><br />
      <select value={tipoActividad} onChange={(e) => {
        setTipoActividad(e.target.value);
        setHorario('');
      }} required>
        <option value="">-- Seleccionar --</option>
        {tiposUnicos.map(tipo => (
          <option key={tipo} value={tipo}>{tipo}</option>
        ))}
      </select>

      {/* Horarios */}
      {tipoActividad && (
        <>
          <br /><br />
          <label>Horario:</label><br />
          <select value={horario} onChange={(e) => setHorario(e.target.value)} required>
            <option value="">-- Seleccionar --</option>
            {horariosDisponibles.map((h, i) => (
              <option key={i} value={h}>{h}</option>
            ))}
          </select>
        </>
      )}

      {/* Cantidad */}
      <br /><br />
      <label>Cantidad de personas:</label><br />
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
            <div key={i} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <label>Nombre:</label><br />
              <input type="text" value={p.nombre} onChange={(e) => handlePersonaChange(i, 'nombre', e.target.value)} required /><br />
              <label>DNI:</label><br />
              <input type="text" value={p.dni} onChange={(e) => handlePersonaChange(i, 'dni', e.target.value)} required /><br />
              <label>Edad:</label><br />
              <input type="number" value={p.edad} onChange={(e) => handlePersonaChange(i, 'edad', e.target.value)} required /><br />
              {requiereTalla(tipoActividad) && (
                <>
                  <label>Talla de vestimenta:</label><br />
                  <input type="text" value={p.talla} onChange={(e) => handlePersonaChange(i, 'talla', e.target.value)} required /><br />
                </>
              )}
            </div>
          ))}
        </>
      )}

      {/* Términos */}
      <br />
      <label>
        <input
          type="checkbox"
          checked={aceptaTerminos}
          onChange={(e) => setAceptaTerminos(e.target.checked)}
        />
        Acepto los términos y condiciones
      </label>
      <p style={{ fontSize: '12px', maxWidth: '500px' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non justo a magna fermentum dictum.
      </p>

      <br />
      <button type="submit">Enviar inscripción</button>
    </form>
  );
}
