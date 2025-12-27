import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './config/firebase'
import Login from './components/Login'
import CharacterSelection from './components/CharacterSelection'
import CharacterSheet from './components/CharacterSheet'
import CreateCharacter from './components/CreateCharacter'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false)

  useEffect(() => {
    // Observar mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setCarregando(false)
    })

    // Limpar subscription ao desmontar
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleSelectCharacter = (characterId) => {
    if (characterId === 'new') {
      setIsCreatingCharacter(true)
    } else {
      setSelectedCharacter(characterId)
    }
  }

  const handleCharacterCreated = (characterId) => {
    setIsCreatingCharacter(false)
    setSelectedCharacter(characterId)
  }

  // Mostrar loading enquanto verifica autenticação
  if (carregando) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : isCreatingCharacter ? (
        <div className="app-content">
          <CreateCharacter 
            onCharacterCreated={handleCharacterCreated}
            onCancel={() => setIsCreatingCharacter(false)}
          />
          <div className="header-bar">
            <button 
              className="back-button" 
              onClick={() => setIsCreatingCharacter(false)}
            >
              Voltar
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      ) : selectedCharacter ? (
        <div className="app-content">
          <CharacterSheet characterId={selectedCharacter} />
          <div className="header-bar">
            <button 
              className="back-button" 
              onClick={() => setSelectedCharacter(null)}
            >
              Voltar
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      ) : (
        <div className="app-content">
          <CharacterSelection onSelectCharacter={handleSelectCharacter} />
          <div className="header-bar">
            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

