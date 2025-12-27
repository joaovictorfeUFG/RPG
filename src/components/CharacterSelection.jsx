import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../config/firebase'
import '../styles/CharacterSelection.css'

const CharacterSelection = ({ onSelectCharacter }) => {
  const [characters, setCharacters] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const canCreate = currentUserId === '5WiiSa077XbvjdPnF0SvZNQfloJ3'

  useEffect(() => {
    const carregarPersonagens = async () => {
      try {
        setCarregando(true)
        setErro(null)
        
        const personagensRef = collection(db, 'personagens')
        const querySnapshot = await getDocs(personagensRef)
        
        const personagensData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setCharacters(personagensData)
      } catch (error) {
        console.error('Erro ao carregar personagens:', error)
        setErro('Erro ao carregar personagens. Tente novamente.')
      } finally {
        setCarregando(false)
      }
    }

    carregarPersonagens()
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid || null)
    })
    return () => unsub()
  }, [])

  if (carregando) {
    return (
      <div className="character-selection">
        <h1 className="selection-title">Personagens</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando personagens...</p>
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="character-selection">
        <h1 className="selection-title">Personagens</h1>
        <div className="error-container">
          <p>{erro}</p>
        </div>
      </div>
    )
  }

  const handleAddCharacter = () => {
    // Criar novo personagem e redirecionar para a ficha
    onSelectCharacter('new')
  }

  if (characters.length === 0) {
    return (
      <div className="character-selection">
        <h1 className="selection-title">Personagens</h1>
        <div className="empty-container">
          <p>Nenhum personagem encontrado.</p>
          <div className="characters-grid">
            {canCreate && (
              <div
                className="character-card add-character-card"
                onClick={handleAddCharacter}
              >
                <div className="add-character-icon">+</div>
                <div className="character-info">
                  <h3 className="character-name">Novo Personagem</h3>
                  <p className="character-alias">Criar novo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="character-selection">
      <h1 className="selection-title">Personagens</h1>
      <div className="characters-grid">
        {characters.map((character) => (
          <div
            key={character.id}
            className="character-card"
            onClick={() => onSelectCharacter(character.id)}
          >
            <div className="character-image-container">
              {character.image ? (
                <img
                  src={character.image}
                  alt={character.name || 'Personagem'}
                  className="character-image"
                />
              ) : (
                <div className="character-image-placeholder">
                  <span className="placeholder-icon">👤</span>
                </div>
              )}
            </div>
            <div className="character-info">
              <h3 className="character-name">{character.name || 'Sem nome'}</h3>
              <p className="character-alias">{character.alias || character.vulgo || ''}</p>
            </div>
          </div>
        ))}
        {canCreate && (
          <div
            className="character-card add-character-card"
            onClick={handleAddCharacter}
          >
            <div className="add-character-icon">+</div>
            <div className="character-info">
              <h3 className="character-name">Novo Personagem</h3>
              <p className="character-alias">Criar novo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CharacterSelection

