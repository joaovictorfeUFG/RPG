import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'
import '../styles/Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    // Validação
    if (!email.trim()) {
      setErro('Por favor, insira um email')
      setCarregando(false)
      return
    }

    if (!senha.trim()) {
      setErro('Por favor, insira uma senha')
      setCarregando(false)
      return
    }

    if (senha.length < 6) {
      setErro('Senha deve ter pelo menos 6 caracteres')
      setCarregando(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha)
      // O estado de autenticação será gerenciado pelo App.jsx via onAuthStateChanged
    } catch (error) {
      console.error('Erro de autenticação:', error)
      
      // Mensagens de erro amigáveis
      switch (error.code) {
        case 'auth/user-not-found':
          setErro('Usuário não encontrado. Verifique o email ou cadastre-se.')
          break
        case 'auth/wrong-password':
          setErro('Senha incorreta.')
          break
        case 'auth/email-already-in-use':
          setErro('Este email já está em uso. Faça login ou use outro email.')
          break
        case 'auth/invalid-email':
          setErro('Email inválido.')
          break
        case 'auth/weak-password':
          setErro('Senha muito fraca. Use pelo menos 6 caracteres.')
          break
        case 'auth/network-request-failed':
          setErro('Erro de conexão. Verifique sua internet.')
          break
        default:
          setErro('Erro ao autenticar. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1 className="login-title">SOM DAS SEIS</h1>
          <p className="login-subtitle">Gerenciador de Personagens RPG</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input
              type="password"
              id="senha"
              className="form-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          {erro && (
            <div className="error-message">
              {erro}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={carregando}
          >
            {carregando ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

