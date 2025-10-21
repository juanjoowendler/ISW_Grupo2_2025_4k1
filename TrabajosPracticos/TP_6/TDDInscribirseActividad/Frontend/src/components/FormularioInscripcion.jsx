import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/FormularioInscripcion.css'
import Navbar from './Navbar'
const requiereTalla = (tipo) => tipo === 'Tirolesa' || tipo === 'Palestra'

const DatosPersona = ({ index, persona, tipoActividad, handlePersonaChange, errores, estaAbierta, onToggle }) => {
  const mostrarTalla = requiereTalla(tipoActividad)

  // Determina si hay errores en esta persona para mostrar una advertencia
  const tieneErrores = Object.keys(errores).some(key => key.startsWith(`${index}-`))

  return (
    <div className={`persona-card ${estaAbierta ? 'abierta' : ''} ${tieneErrores ? 'error-card' : ''}`}>
      {/* Encabezado del Acordeón/Toggle */}
      <div className='persona-header' onClick={() => onToggle(index)}>
        <h4>
          Persona {index + 1}: {persona.nombre || 'Participante'}
          {tieneErrores && <span className='error-indicator'> (⚠️ Error)</span>}
        </h4>
        <span className='toggle-icon'>{estaAbierta ? '▲' : '▼'}</span>
      </div>

      {/* Contenido Desplegable (se muestra solo si estaAbierta es true) */}
      <div className={`persona-content ${estaAbierta ? 'visible' : 'oculta'}`}>
        <label>Nombre:</label>
        <input
          type='text'
          value={persona.nombre}
          onChange={(e) => handlePersonaChange(index, 'nombre', e.target.value)}
          className={errores[`${index}-nombre`] ? 'error' : ''}
          placeholder='Nombre completo'
        />
        {errores[`${index}-nombre`] && <span className='mensaje-error'>{errores[`${index}-nombre`]}</span>}

        <label>DNI:</label>
        <input
          type='number'
          value={persona.dni}
          onChange={(e) => handlePersonaChange(index, 'dni', e.target.value)}
          className={errores[`${index}-dni`] ? 'error' : ''}
          placeholder='DNI (7 u 8 números)'
        />
        {errores[`${index}-dni`] && <span className='mensaje-error'>{errores[`${index}-dni`]}</span>}

        <label>Edad:</label>
        <input
          type='number'
          value={persona.edad}
          onChange={(e) => handlePersonaChange(index, 'edad', e.target.value)}
          className={errores[`${index}-edad`] ? 'error' : ''}
          placeholder='Edad'
        />
        {errores[`${index}-edad`] && <span className='mensaje-error'>{errores[`${index}-edad`]}</span>}

        {mostrarTalla && (
          <>
            <label>Talla (requerida):</label>
            <select
              value={persona.talla}
              onChange={(e) => handlePersonaChange(index, 'talla', e.target.value)}
              className={errores[`${index}-talla`] ? 'error' : ''}
            >
              <option value=''>-- Seleccionar --</option>
              <option value='XS'>XS</option>
              <option value='S'>S</option>
              <option value='M'>M</option>
              <option value='L'>L</option>
              <option value='XL'>XL</option>
              <option value='XXL'>XXL</option>
            </select>
            {errores[`${index}-talla`] && (
              <span className='mensaje-error'>{errores[`${index}-talla`]}</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function FormularioInscripcion () {
  const [actividades, setActividades] = useState([])
  const [tipoActividad, setTipoActividad] = useState('')
  const [horario, setHorario] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [personas, setPersonas] = useState([])
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [errores, setErrores] = useState({})
  const [mostrarModal, setMostrarModal] = useState(false)
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: '' })
  const [fecha, setFecha] = useState('')
  const [fechasDisponibles, setFechasDisponibles] = useState([])
  const [personaAbierta, setPersonaAbierta] = useState(0)

  const mostrarToast = (mensaje, tipo = 'info') => {
    setToast({ visible: true, mensaje, tipo })
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: '' }), 3000)
  }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/actividades')
      .then((res) => res.json())
      .then((data) => {
        const ahora = new Date()

        const actividadesFuturas = data.filter((a) => {
          const fechaHoraActividad = new Date(`${a.fecha}T${a.hora}`)
          return fechaHoraActividad > ahora && a.cupo_disponible >= 0
        })

        setActividades(actividadesFuturas)
        setPersonas([{ nombre: '', dni: '', edad: '', talla: '' }])

        const fechas = [...new Set(actividadesFuturas.map((a) => a.fecha))]
        setFechasDisponibles(fechas)
      })
      .catch((err) => console.error('Error al obtener actividades:', err))
  }, [])

  const actividadesPorFecha = actividades.filter(a => a.fecha === fecha)

  const ahora = new Date()

  const horariosDisponibles = actividadesPorFecha
    .filter((a) => a.tipo === tipoActividad)
    .filter((a) => {
      const fechaHoraActividad = new Date(`${a.fecha}T${a.hora}`)
      return fechaHoraActividad > ahora
    })
    .map((a) => ({
      hora: a.hora,
      cupo: a.cupo_disponible
    }))

  const handleCantidadChange = (e) => {
    let n = parseInt(e.target.value) || 0

    // 🔸 Buscar el cupo disponible de la actividad seleccionada
    const actividad = actividades.find(
      (a) => a.tipo === tipoActividad && a.hora === horario && a.fecha === fecha
    )

    const cupoDisponible = actividad ? actividad.cupo_disponible : 0

    if (n > cupoDisponible) {
      mostrarToast(`Solo hay ${cupoDisponible} cupos disponibles`, 'error')
      n = cupoDisponible
    }

    setCantidad(n)
    setPersonas(
      Array.from({ length: n }, (_, i) => personas[i] || { nombre: '', dni: '', edad: '', talla: '' })
    )
  }

  const handlePersonaChange = (i, campo, valor) => {
    const copia = [...personas]
    copia[i][campo] = valor
    setPersonas(copia)
    validarCampo(i, campo, valor)
  }

  const validarCampo = (i, campo, valor) => {
    const nuevosErrores = { ...errores }
    let error = ''

    if (campo === 'nombre' && valor.trim().length < 3) { error = 'El nombre debe tener al menos 3 caracteres.' }
    if (campo === 'dni' && !/^\d{7,8}$/.test(valor)) { error = 'El DNI debe tener 7 u 8 números.' }
    if (campo === 'edad') {
      const edadNum = parseInt(valor)
      if (isNaN(edadNum) || edadNum < 1 || edadNum > 100) {
        error = 'Edad inválida.'
      } else {
        if (tipoActividad === 'Tirolesa' && edadNum < 8) { error = 'Edad mínima para Tirolesa: 8 años.' }
        if (tipoActividad === 'Palestra' && edadNum < 12) { error = 'Edad mínima para Palestra: 12 años.' }
      }
    }

    if (campo === 'talla' && requiereTalla(tipoActividad) && !valor) { error = 'Selecciona una talla.' }

    if (error) nuevosErrores[`${i}-${campo}`] = error
    else delete nuevosErrores[`${i}-${campo}`]
    setErrores(nuevosErrores)
  }
  const navigate = useNavigate()

  // 🆕 FUNCIÓN NUEVA: Maneja el despliegue del acordeón
  const handleTogglePersona = (index) => {
    setPersonaAbierta(personaAbierta === index ? -1 : index)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    for (let i = 0; i < personas.length; i++) {
      const p = personas[i]
      if (!p.nombre) return mostrarToast(`Falta el nombre en la persona ${i + 1}`, 'error')
      if (!p.dni) return mostrarToast(`Falta el DNI en la persona ${i + 1}`, 'error')
      if (!p.edad) return mostrarToast(`Falta la edad en la persona ${i + 1}`, 'error')
      if (requiereTalla(tipoActividad) && !p.talla) { return mostrarToast(`Falta seleccionar la talla en la persona ${i + 1}, "error"`) }
    }
    if (!aceptaTerminos) return mostrarToast('Debes aceptar los términos y condiciones', 'error')
    if (Object.keys(errores).length > 0) { return mostrarToast('Por favor corrige los errores antes de enviar.', 'error') }

    const actividadSeleccionada = actividades.find(
      (a) => a.tipo === tipoActividad && a.hora === horario && a.fecha === fecha
    )

    if (!actividadSeleccionada) {
      return mostrarToast('No se encontró la actividad con esa fecha y horario', 'error')
    }

    const payload = {
      id_actividad: actividadSeleccionada.id_actividad,
      terminosYcondiciones: aceptaTerminos,
      cant_personas: cantidad,
      personas: personas.map((p) => ({
        dni: parseInt(p.dni),
        nombre: p.nombre,
        edad: parseInt(p.edad),
        talle: requiereTalla(tipoActividad) ? p.talla : null
      }))
    }

    fetch('http://127.0.0.1:8000/api/inscribirse_actividad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error en el envío')
        return res.json()
      })
      .then((data) => {
        mostrarToast('Inscripción enviada correctamente', 'success')
        console.log('Respuesta del servidor:', data)

        navigate('/post-inscripcion', {
          state: {
            fecha,
            horario,
            tipo: tipoActividad,
            cantidad
          }
        })
      })
      .catch((err) => {
        console.error('Error al enviar inscripción:', err)
        console.error(err.response?.json())
        mostrarToast('Hubo un error al enviar la inscripción', 'error')
      })
  }

  return (
    <div className='formul'>
      <Navbar />

      <div className='formulario-container'>
        <form className='inscripcion-form' onSubmit={handleSubmit} noValidate>
          <h2>Formulario de Inscripción</h2>
          {/* Fecha */}
          <label>Fecha:</label>
          <select
            value={fecha} onChange={(e) => {
              setFecha(e.target.value)
              setTipoActividad('')
              setHorario('')
              setCantidad(1)
              setPersonas([{ nombre: '', dni: '', edad: '', talla: '' }])
              setErrores({})
              setAceptaTerminos(false)
            }}
          >

            <option value=''>-- Seleccionar fecha --</option>
            {fechasDisponibles.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          {/* Actividad */}
          <label>Seleccioná una actividad:</label>
          <div className='botones-container'>
            {actividades.length === 0
              ? (
                <p style={{ fontStyle: 'italic', color: '#888' }}>Cargando actividades...</p>
                )
              : (
                  [...new Set(actividades.map(a => a.tipo))].map((tipo) => {
                    const actividadesDelTipo = actividades.filter(a => a.tipo === tipo)
                    const tieneCupoEnHorario = !horario || actividadesDelTipo.some(a => a.hora === horario && a.cupo_disponible > 0)
                    const estaSeleccionado = tipo === tipoActividad
                    const otraSeleccionada = tipoActividad && tipo !== tipoActividad

                    const clases = [
                      'boton-toggle',
                      estaSeleccionado ? 'activo' : '',
                      !tieneCupoEnHorario ? 'inactivo' : '',
                      otraSeleccionada ? 'inactivo' : ''
                    ].join(' ').trim()

                    return (
                      <button
                        key={tipo}
                        type='button'
                        className={clases}
                        onClick={() => {
                          if (tieneCupoEnHorario) {
                            setTipoActividad(tipo)

                            //  Revalidar edad de todas las personas según el nuevo mínimo
                            setErrores((prev) => {
                              const nuevos = { ...prev }
                              personas.forEach((p, i) => {
                                const edadMin = tipo === 'Tirolesa' ? 8 : tipo === 'Palestra' ? 12 : null
                                if (edadMin && p.edad && parseInt(p.edad) < edadMin) {
                                  nuevos[`${i}-edad`] = `Debe tener al menos ${edadMin} años para esta actividad.`
                                } else {
                                  delete nuevos[`${i}-edad`]
                                }
                              })
                              return nuevos
                            })
                          }
                        }}
                        disabled={!tieneCupoEnHorario}
                      >
                        {tipo}
                      </button>
                    )
                  })
                )}
          </div>

          {/* Mostrar actividad seleccionada */}
          {tipoActividad && (
            <div className='actividad-seleccionada'>
              Actividad seleccionada: <b>{tipoActividad}</b>
            </div>
          )}

          {/* Horario */}
          <label>Horario:</label>
          <select
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            disabled={!tipoActividad}
            required
          >
            {!tipoActividad
              ? (
                <option value=''>-- Seleccioná una actividad --</option>
                )
              : horariosDisponibles.length > 0
                ? (
                  <>
                    <option value=''>-- Seleccionar horario --</option>
                    {horariosDisponibles.map((h, i) => (
                      <option
                        key={i}
                        value={h.hora}
                        disabled={h.cupo <= 0}
                        style={{
                          color: h.cupo <= 0 ? 'gray' : 'black',
                          textDecoration: h.cupo <= 0 ? 'line-through' : 'none'
                        }}
                      >
                        {h.hora} {h.cupo <= 0 ? '(sin cupo)' : ''}
                      </option>
                    ))}
                  </>
                  )
                : (
                  <option disabled value=''>
                    No hay horarios disponibles
                  </option>
                  )}
          </select>

          {/* Cantidad */}
          <label>Cantidad de personas:</label>
          <input type='number' value={cantidad} min='1' onChange={handleCantidadChange} required />

          {/* Datos de las personas - RENDERIZADO MODIFICADO CON ACORDEÓN */}
          {personas.length > 0 && (
            <>
              <h3>Datos de las personas:</h3>
              <p className='nota'>Hacé click en cada participante para ver y editar sus datos.</p> {/* Nota para guiar al usuario */}
              {personas.map((p, i) => (
                <DatosPersona
                  key={i}
                  index={i}
                  persona={p}
                  tipoActividad={tipoActividad}
                  handlePersonaChange={handlePersonaChange}
                  errores={errores}
                  estaAbierta={personaAbierta === i} // Pasa si esta persona está abierta
                  onToggle={handleTogglePersona}
                />
              ))}
            </>
          )}

          {/* Términos y condiciones */}
          <div className='terminos-container'>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              Acepto los {' '}
              <span
                className='link-terminos' onClick={(e) => {
                  e.stopPropagation()
                  setMostrarModal(true)
                }}
              >
                términos y condiciones
              </span>
            </label>
          </div>

          <button type='submit'>Enviar inscripción</button>
        </form>

        {/* Modal */}
        {mostrarModal && (
          <div className='modal-overlay' onClick={() => setMostrarModal(false)}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
              <div className='modal-header'>
                <h3>Términos y Condiciones de Participación</h3>
                <button className='cerrar-modal' onClick={() => setMostrarModal(false)}>
                  ✕
                </button>
              </div>
              <div className='modal-texto'>
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
                  <li>Todo participante menor de edad deberá ir acompañado de un adulto responsable. La organización
                    no se hace responsable de verificar si el menor es acompañado o no.
                  </li>
                </ul>
                <p>
                  Al hacer clic en “Aceptar”, confirmas que has leído, comprendido y aceptado estos
                  términos y condiciones.
                </p>
              </div>
              <div className='modal-botones'>
                <button className='btn-secundario' onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button
                  className='btn-principal'
                  onClick={() => {
                    setAceptaTerminos(true)
                    setMostrarModal(false)
                  }}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
        {toast.visible && (<div className={`toast ${toast.tipo}`}> {toast.mensaje} </div>
        )}
      </div>
    </div>
  )
}
