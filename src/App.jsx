import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    celular: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres'
    }

    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es obligatoria'
    } else if (!/^\d{6,12}$/.test(formData.cedula.replace(/\D/g, ''))) {
      newErrors.cedula = 'Ingrese una cédula válida (6-12 dígitos)'
    }

    if (!formData.celular.trim()) {
      newErrors.celular = 'El celular es obligatorio'
    } else if (!/^\d{10}$/.test(formData.celular.replace(/\D/g, ''))) {
      newErrors.celular = 'Ingrese un número de celular válido (10 dígitos)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let filteredValue = value

    // Filtrar caracteres según el campo
    if (name === 'nombre') {
      // Solo letras, espacios y tildes (sin números)
      filteredValue = value.replace(/[0-9]/g, '')
    } else if (name === 'cedula' || name === 'celular') {
      // Solo números (sin letras ni caracteres especiales)
      filteredValue = value.replace(/\D/g, '')
    }

    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFocus = (name) => {
    setFocused(prev => ({ ...prev, [name]: true }))
  }

  const handleBlur = (name) => {
    setFocused(prev => ({ ...prev, [name]: false }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          cedula: formData.cedula.replace(/\D/g, ''),
          celular: formData.celular.replace(/\D/g, '')
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Gracias por registrarte con Vivo.' })
        setSubmitted(true)
        setFormData({ nombre: '', cedula: '', celular: '' })
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al registrar' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Por favor intente nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  const handleNewRegister = () => {
    setSubmitted(false)
    setMessage({ type: '', text: '' })
  }

  const isActive = (name) => focused[name] || formData[name]

  return (
    <div className="app">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="container">
        <div className="card">
          <div className="logo-container">
            <div className="logo">
              <img src="/ogo.svg" alt="Vivo" className="logo-img" />
            </div>
            <p className="tagline">Conectando tu mundo</p>
          </div>

          {!submitted ? (
            <>
              <h1 className="title">Registro</h1>
              <p className="subtitle">Completa tus datos para unirte a Vivo</p>

              <form onSubmit={handleSubmit} className="form">
                <div className={`input-group ${errors.nombre ? 'error' : ''} ${isActive('nombre') ? 'active' : ''}`}>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onFocus={() => handleFocus('nombre')}
                    onBlur={() => handleBlur('nombre')}
                    placeholder="Nombre completo"
                    autoComplete="name"
                  />
                  {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                </div>

                <div className={`input-group ${errors.cedula ? 'error' : ''} ${isActive('cedula') ? 'active' : ''}`}>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <line x1="7" y1="8" x2="17" y2="8" />
                      <line x1="7" y1="12" x2="13" y2="12" />
                      <line x1="7" y1="16" x2="10" y2="16" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="cedula"
                    id="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    onFocus={() => handleFocus('cedula')}
                    onBlur={() => handleBlur('cedula')}
                    placeholder="Número de cédula"
                    autoComplete="off"
                    inputMode="numeric"
                  />
                  {errors.cedula && <span className="error-text">{errors.cedula}</span>}
                </div>

                <div className={`input-group ${errors.celular ? 'error' : ''} ${isActive('celular') ? 'active' : ''}`}>
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <line x1="12" y1="18" x2="12" y2="18" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="celular"
                    id="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    onFocus={() => handleFocus('celular')}
                    onBlur={() => handleBlur('celular')}
                    placeholder="Número de celular"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  {errors.celular && <span className="error-text">{errors.celular}</span>}
                </div>

                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  className={`submit-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Registrando...
                    </>
                  ) : (
                    'Registrarme'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="success-container">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2>¡Bienvenido!</h2>
              <p className="success-text">{message.text}</p>
              <button onClick={handleNewRegister} className="new-register-btn">
                Nuevo registro
              </button>
            </div>
          )}
        </div>

        <footer className="footer">
          <p>© 2026 Vivo</p>
        </footer>
      </div>
    </div>
  )
}

export default App
