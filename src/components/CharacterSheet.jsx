import { useState, useEffect, useRef } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../config/firebase'
import '../styles/CharacterSheet.css'

const CharacterSheet = ({ characterId }) => {
  // Estados para identificação
  const [nome, setNome] = useState('')
  const [vulgo, setVulgo] = useState('')
  const [imagem, setImagem] = useState('')

  // Estados para atributos (cada um com 5 níveis)
  const [fisico, setFisico] = useState(0)
  const [agilidade, setAgilidade] = useState(0)
  const [intelecto, setIntelecto] = useState(0)
  const [coragem, setCoragem] = useState(0)

  // Estados para estatísticas principais
  const [vida, setVida] = useState(6)
  const [defesa, setDefesa] = useState(5)

  // Estados para características pessoais
  const [tormento, setTormento] = useState('')
  const [recompensa, setRecompensa] = useState('')

  // Estados para economia de ação (valores base)
  const [iniciativaBase, setIniciativaBase] = useState(1)
  const [acoesBase, setAcoesBase] = useState(4)
  
  // Valores calculados baseados nos atributos
  const iniciativa = iniciativaBase + coragem
  const acoes = acoesBase + agilidade
  const maxAntecedentes = 2 + intelecto
  const maxAtributos = 4

  // Estados para antecedentes (cada um com 2 níveis máximo, valor inicial 0)
  const [combate, setCombate] = useState(0)
  const [negocios, setNegocios] = useState(0)
  const [montaria, setMontaria] = useState(0)
  const [tradicao, setTradicao] = useState(0)
  const [trabalho, setTrabalho] = useState(0)
  const [exploracao, setExploracao] = useState(0)
  const [roubo, setRoubo] = useState(0)
  const [medicina, setMedicina] = useState(0)

  // Estado para habilidades (textarea)
  const [habilidades, setHabilidades] = useState('')

  // Estado para controlar qual campo de combate está selecionado
  const [selectedCombatField, setSelectedCombatField] = useState(null)

  // Controle de sincronização com Firestore
  const [hasHydrated, setHasHydrated] = useState(false)
  const saveTimeout = useRef(null)
  const [ownerId, setOwnerId] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const canEdit = !!currentUserId && !!ownerId && currentUserId === ownerId

  // Função para comprimir e converter imagem para base64
  const handleImageUpload = (e) => {
    if (!canEdit) return
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxWidth = 300
        const maxHeight = 400
        let width = img.width
        let height = img.height

        // Calcular novo tamanho mantendo proporção
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const base64 = canvas.toDataURL('image/jpeg', 0.8)
        setImagem(base64)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Funções para incrementar/decrementar valores de combate
  const incrementValue = (field) => {
    switch(field) {
      case 'vida':
        setVida(vida + 1)
        break
      case 'defesa':
        setDefesa(defesa + 1)
        break
      case 'iniciativa':
        setIniciativaBase(iniciativaBase + 1)
        break
      case 'acoes':
        setAcoesBase(acoesBase + 1)
        break
      default:
        break
    }
  }

  const decrementValue = (field) => {
    switch(field) {
      case 'vida':
        setVida(Math.max(0, vida - 1))
        break
      case 'defesa':
        setDefesa(Math.max(0, defesa - 1))
        break
      case 'iniciativa':
        setIniciativaBase(Math.max(0, iniciativaBase - 1))
        break
      case 'acoes':
        setAcoesBase(Math.max(0, acoesBase - 1))
        break
      default:
        break
    }
  }

  // Carregar dados do Firestore
  useEffect(() => {
    if (!characterId) return

    let active = true
    const carregarFicha = async () => {
      try {
        const ref = doc(db, 'personagens', characterId)
        const snap = await getDoc(ref)
        if (!snap.exists() || !active) return

        const data = snap.data()
        const atributos = data.atributos || {}
        const antecedentes = data.antecedentes || {}
        setOwnerId(data.owner || null)

        setNome(data.name || '')
        setVulgo(data.alias || data.vulgo || '')
        setImagem(data.image || '')

        setFisico(atributos.fisico ?? 0)
        setAgilidade(atributos.agilidade ?? 0)
        setIntelecto(atributos.intelecto ?? 0)
        setCoragem(atributos.coragem ?? 0)

        setVida(data.vida ?? 6)
        setDefesa(data.defesa ?? 5)

        const iniciativaDoc = data.iniciativa ?? 1
        const acoesDoc = data['ações'] ?? data.acoes ?? 4
        const coragemVal = atributos.coragem ?? 0
        const agilidadeVal = atributos.agilidade ?? 0
        setIniciativaBase(Math.max(0, iniciativaDoc - coragemVal))
        setAcoesBase(Math.max(0, acoesDoc - agilidadeVal))

        setTormento(data.tormento || '')
        setRecompensa(data.recompensa || '')

        setCombate(antecedentes.combate ?? 0)
        setNegocios(antecedentes.negocios ?? 0)
        setMontaria(antecedentes.montaria ?? 0)
        setTradicao(antecedentes.tradicao ?? 0)
        setTrabalho(antecedentes.trabalho ?? 0)
        setExploracao(antecedentes.exploracao ?? 0)
        setRoubo(antecedentes.roubo ?? 0)
        setMedicina(antecedentes.medicina ?? 0)

        setHabilidades(data.habilidades || '')

        setHasHydrated(true)
      } catch (error) {
        console.error('Erro ao carregar ficha:', error)
      }
    }

    setHasHydrated(false)
    carregarFicha()

    return () => {
      active = false
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [characterId])

  // Obter usuário atual (Auth)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid || null)
    })
    return () => unsub()
  }, [])

  // Função para renderizar checkboxes quadrados
  const renderCheckboxes = (currentLevel, maxLevel, onLevelChange) => {
    return Array.from({ length: maxLevel }, (_, index) => {
      const level = index + 1
      const isChecked = level <= currentLevel
      
      return (
        <button
          key={index}
          type="button"
          className={`checkbox-square ${isChecked ? 'checked' : ''}`}
          onClick={() => {
            if (level === currentLevel) {
              onLevelChange(level - 1)
            } else {
              onLevelChange(level)
            }
          }}
          aria-label={`Nível ${level}`}
        >
          {isChecked ? '✓' : ''}
        </button>
      )
    })
  }

  // Função para renderizar checkboxes de atributos com limite global (máximo 4 pontos no total)
  const renderAtributoCheckboxes = (currentLevel, onLevelChange) => {
    const totalAtributos = fisico + agilidade + intelecto + coragem
    const remaining = Math.max(0, maxAtributos - totalAtributos)

    return Array.from({ length: 4 }, (_, index) => {
      const level = index + 1
      const isChecked = level <= currentLevel
      const maxReachableLevel = currentLevel + remaining
      const isDisabled = (!isChecked && level > maxReachableLevel) || !canEdit

      return (
        <button
          key={index}
          type="button"
          className={`checkbox-square ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}`}
          onClick={() => {
            if (!canEdit) return
            if (level === currentLevel) {
              onLevelChange(level - 1)
            } else {
              const delta = level - currentLevel
              if (remaining <= 0 && delta > 0) return
              const newLevel = currentLevel + Math.min(delta, remaining)
              onLevelChange(newLevel)
            }
          }}
          disabled={isDisabled}
          aria-label={`Nível ${level}`}
        >
          {isChecked ? '✓' : ''}
        </button>
      )
    })
  }

  // Função para renderizar checkboxes de antecedentes com limite global
  const renderAntecedenteCheckboxes = (currentLevel, onLevelChange) => {
    const totalAntecedentes = combate + negocios + montaria + tradicao + trabalho + exploracao + roubo + medicina
    const remaining = Math.max(0, maxAntecedentes - totalAntecedentes)

    return Array.from({ length: 2 }, (_, index) => {
      const level = index + 1
      const isChecked = level <= currentLevel
      const maxReachableLevel = currentLevel + remaining
      const isDisabled = (!isChecked && level > maxReachableLevel) || !canEdit

      return (
        <button
          key={index}
          type="button"
          className={`checkbox-square ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}`}
          onClick={() => {
            if (!canEdit) return
            if (level === currentLevel) {
              onLevelChange(level - 1)
            } else {
              const delta = level - currentLevel
              if (remaining <= 0) return
              const newLevel = currentLevel + Math.min(delta, remaining)
              onLevelChange(newLevel)
            }
          }}
          disabled={isDisabled}
          aria-label={`Nível ${level}`}
        >
          {isChecked ? '✓' : ''}
        </button>
      )
    })
  }

  // Auto-save no Firestore sempre que um valor muda
  useEffect(() => {
    if (!characterId || !hasHydrated || !canEdit) return

    if (saveTimeout.current) clearTimeout(saveTimeout.current)

    saveTimeout.current = setTimeout(async () => {
      try {
        const ref = doc(db, 'personagens', characterId)
        await updateDoc(ref, {
          name: nome,
          alias: vulgo,
          image: imagem || null,
          vida,
          defesa,
          iniciativa,
          ações: acoes,
          iniciativaBase,
          acoesBase,
          atributos: {
            fisico,
            agilidade,
            intelecto,
            coragem
          },
          antecedentes: {
            combate,
            negocios,
            montaria,
            tradicao,
            trabalho,
            exploracao,
            roubo,
            medicina
          },
          habilidades,
          tormento,
          recompensa
        })
      } catch (error) {
        console.error('Erro ao salvar ficha:', error)
      }
    }, 400)

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [
    characterId,
    hasHydrated,
    canEdit,
    nome,
    vulgo,
    imagem,
    fisico,
    agilidade,
    intelecto,
    coragem,
    vida,
    defesa,
    iniciativaBase,
    acoesBase,
    tormento,
    recompensa,
    combate,
    negocios,
    montaria,
    tradicao,
    trabalho,
    exploracao,
    roubo,
    medicina,
    habilidades
  ])

  return (
    <div className="character-sheet">
      <div className="sheet-header">
        <h1 className="sheet-title">O SOM DAS SEIS</h1>
      </div>

      <div className="sheet-content">
        {/* Seção Superior: Nome e Nível */}
        <div className="section identification-section">
          <div className="image-container">
            <div className="portrait-wrapper">
              {imagem ? (
                <img
                  src={imagem}
                  alt={nome || 'Personagem'}
                  className="character-portrait"
                />
              ) : (
                <div className="character-portrait-placeholder">👤</div>
              )}
            </div>
            {
              canEdit &&
              <>
                <label htmlFor="upload-image" className="file-upload-button">Alterar imagem</label>
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input-hidden"
                  disabled={!canEdit}
                />
              </>
            }
          </div>
          
          <div className='info-container'>
            <div className="info-fields">
              <div className="field-group">
                <label className="field-label">nome</label>
                <input
                  type="text"
                  className="field-input large-input"
                  value={nome}
                  onChange={(e) => canEdit && setNome(e.target.value)}
                  disabled={!canEdit}
                />
              </div>
              <div className="field-group">
                <label className="field-label">vulgo</label>
                <input
                  type="text"
                  className="field-input large-input"
                  value={vulgo}
                  onChange={(e) => canEdit && setVulgo(e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seção Esquerda: Atributos */}
        <div className="section attributes-section">
          <div className="section-title-row">
            <h2 className="section-title">atributos</h2>
            <span className="max-antecedentes">máximo: {maxAtributos}</span>
          </div>
          <div className="attribute-row">
            <span className="attribute-name">físico</span>
            <div className="checkboxes-container">
              {renderAtributoCheckboxes(fisico, setFisico)}
            </div>
          </div>
          <div className="attribute-row">
            <span className="attribute-name">agilidade</span>
            <div className="checkboxes-container">
              {renderAtributoCheckboxes(agilidade, setAgilidade)}
            </div>
          </div>
          <div className="attribute-row">
            <span className="attribute-name">intelecto</span>
            <div className="checkboxes-container">
              {renderAtributoCheckboxes(intelecto, setIntelecto)}
            </div>
          </div>
          <div className="attribute-row">
            <span className="attribute-name">coragem</span>
            <div className="checkboxes-container">
              {renderAtributoCheckboxes(coragem, setCoragem)}
            </div>
          </div>
        </div>

        {/* Seção Combate: Vida, Defesa, Iniciativa e Ações */}
        <div className="section combat-section">
          <h2 className="section-title">combate</h2>
          <div className="combat-fields">
            <div className="combat-field-item">
              <label className="field-label">vida</label>
              <div 
                className={`combat-value-box ${selectedCombatField === 'vida' ? 'selected' : ''}`}
                onClick={() => {
                  if (!canEdit) return
                  setSelectedCombatField(selectedCombatField === 'vida' ? null : 'vida')
                }}
              >
                {selectedCombatField === 'vida' && (
                  <div className="combat-controls">
                    <button 
                      type="button"
                      className="combat-btn combat-btn-minus"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!canEdit) return
                        decrementValue('vida')
                      }}
                    >
                      −
                    </button>
                    <span className="combat-value">{vida}</span>
                    <button 
                      type="button"
                      className="combat-btn combat-btn-plus"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!canEdit) return
                        incrementValue('vida')
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
                {selectedCombatField !== 'vida' && (
                  <span className="combat-value">{vida}</span>
                )}
              </div>
            </div>
            <div className="combat-field-item">
              <label className="field-label">defesa</label>
              <div 
                className={`combat-value-box ${selectedCombatField === 'defesa' ? 'selected' : ''}`}
                onClick={() => {
                  if (!canEdit) return
                  setSelectedCombatField(selectedCombatField === 'defesa' ? null : 'defesa')
                }}
              >
                {selectedCombatField === 'defesa' && (
                  <div className="combat-controls">
                    <button 
                      type="button"
                      className="combat-btn combat-btn-minus"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!canEdit) return
                        decrementValue('defesa')
                      }}
                    >
                      −
                    </button>
                    <span className="combat-value">{defesa}</span>
                    <button 
                      type="button"
                      className="combat-btn combat-btn-plus"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!canEdit) return
                        incrementValue('defesa')
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
                {selectedCombatField !== 'defesa' && (
                  <span className="combat-value">{defesa}</span>
                )}
              </div>
            </div>
            <div className="combat-field-item">
              <label className="field-label">iniciativa</label>
              <div 
                className={`combat-value-box ${selectedCombatField === 'iniciativa' ? 'selected' : ''}`}
                onClick={() => {
                  if (!canEdit) return
                  setSelectedCombatField(selectedCombatField === 'iniciativa' ? null : 'iniciativa')
                }}
              >
                {selectedCombatField === 'iniciativa' && (
                  <div className="combat-controls">
                    <button 
                      type="button"
                      className="combat-btn combat-btn-minus"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!canEdit) return
                        decrementValue('iniciativa')
                      }}
                    >
                      −
                    </button>
                    <span className="combat-value">{iniciativa}</span>
                    <button 
                      type="button"
                      className="combat-btn combat-btn-plus"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!canEdit) return
                        incrementValue('iniciativa')
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
                {selectedCombatField !== 'iniciativa' && (
                  <span className="combat-value">{iniciativa}</span>
                )}
              </div>
            </div>
            <div className="combat-field-item">
              <label className="field-label">ações</label>
              <div 
                className={`combat-value-box ${selectedCombatField === 'acoes' ? 'selected' : ''}`}
                onClick={() => {
                  if (!canEdit) return
                  setSelectedCombatField(selectedCombatField === 'acoes' ? null : 'acoes')
                }}
              >
                {selectedCombatField === 'acoes' && (
                  <div className="combat-controls">
                    <button 
                      type="button"
                      className="combat-btn combat-btn-minus"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!canEdit) return
                        decrementValue('acoes')
                      }}
                    >
                      −
                    </button>
                    <span className="combat-value">{acoes}</span>
                    <button 
                      type="button"
                      className="combat-btn combat-btn-plus"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!canEdit) return
                        incrementValue('acoes')
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
                {selectedCombatField !== 'acoes' && (
                  <span className="combat-value">{acoes}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seção Tormento e Recompensa */}
        {
          canEdit &&
          <div className="section traits-section">
            <div className="field-group">
              <label className="field-label">tormento</label>
              <input
                type="text"
                className="field-input large-text-input"
                value={tormento}
                onChange={(e) => canEdit && setTormento(e.target.value)}
                disabled={!canEdit}
              />
            </div>
            <div className="field-group">
              <label className="field-label">recompensa</label>
              <input
                type="text"
                className="field-input large-text-input"
                value={recompensa}
                onChange={(e) => canEdit && setRecompensa(e.target.value)}
                disabled={!canEdit}
              />
            </div>
          </div>
        }

        {/* Seção Inferior: Antecedentes */}
        <div className="section backgrounds-section">
          <div className="section-title-row">
            <h2 className="section-title">antecedentes</h2>
            <span className="max-antecedentes">máximo: {maxAntecedentes}</span>
          </div>
          <div className="background-row">
            <span className="background-name">combate</span>
            <div className="checkboxes-container">
              {renderAntecedenteCheckboxes(combate, setCombate)}
            </div>
          </div>
          <div className="background-row">
            <span className="background-name">negócios</span>
            <div className="checkboxes-container">
              {renderAntecedenteCheckboxes(negocios, setNegocios)}
            </div>
          </div>
          <div className="background-row">
            <span className="background-name">montaria</span>
            <div className="checkboxes-container">
              {renderAntecedenteCheckboxes(montaria, setMontaria)}
            </div>
          </div>
          <div className="background-row">
            <span className="background-name">tradição</span>
            <div className="checkboxes-container">
              {renderAntecedenteCheckboxes(tradicao, setTradicao)}
            </div>
          </div>
          <div className="background-row">
            <span className="background-name">trabalho</span>
            <div className="checkboxes-container">
              {renderAntecedenteCheckboxes(trabalho, setTrabalho)}
            </div>
          </div>
          <div className="background-row">
            <span className="background-name">exploração</span>
            <div className="checkboxes-container">
              {renderAntecedenteCheckboxes(exploracao, setExploracao)}
            </div>
          </div>
          <div className="background-row">
            <span className="background-name">roubo</span>
            <div className="checkboxes-container">
              {renderAntecedenteCheckboxes(roubo, setRoubo)}
            </div>
          </div>
          <div className="background-row">
            <span className="background-name">medicina</span>
            <div className="checkboxes-container">
              {renderAntecedenteCheckboxes(medicina, setMedicina)}
            </div>
          </div>
        </div>

        {/* Seção Direita: Habilidades */}
        <div className="section skills-section">
          <h2 className="section-title">habilidades</h2>
          <textarea
            className="skills-textarea"
            value={habilidades}
            onChange={(e) => canEdit && setHabilidades(e.target.value)}
            disabled={!canEdit}
            placeholder="Descreva as habilidades do personagem..."
          />
        </div>
      </div>
    </div>
  )
}

export default CharacterSheet

