import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import '../styles/CreateCharacter.css'

const CreateCharacter = ({ onCharacterCreated, onCancel }) => {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    basicos: true,
    atributos: true,
    antecedentes: false,
    habilidades: false,
    equipamentos: false
  })

  const [formData, setFormData] = useState({
    nome: '',
    vulgo: '',
    vida: '6',
    defesa: '5',
    iniciativa: '1',
    ações: '1',
    atributos: {
      fisico: '',
      agilidade: '',
      intelecto: '',
      coragem: ''
    },
    antecedentes: {
      combate: '',
      negocios: '',
      montaria: '',
      tradicao: '',
      trabalho: '',
      exploracao: '',
      roubo: '',
      medicina: ''
    },
    habilidades: '',
    equipamentos: '',
    imagem: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAttributeChange = (attribute, value) => {
    setFormData(prev => ({
      ...prev,
      atributos: {
        ...prev.atributos,
        [attribute]: value
      }
    }))
  }

  const handleBackgroundChange = (background, value) => {
    setFormData(prev => ({
      ...prev,
      antecedentes: {
        ...prev.antecedentes,
        [background]: value
      }
    }))
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nome.trim()) {
      setErro('Nome do personagem é obrigatório.')
      return
    }

    try {
      setCarregando(true)
      setErro(null)

      const personagensRef = collection(db, 'personagens')
      
      // Converter valores vazios em null para melhor armazenamento
      const dataToSave = {
        name: formData.nome,
        alias: formData.vulgo,
        image: formData.imagem || null,
        vida: formData.vida ? parseInt(formData.vida) : 6,
        defesa: formData.defesa ? parseInt(formData.defesa) : 5,
        iniciativa: formData.iniciativa ? parseInt(formData.iniciativa) : 1,
        ações: formData.ações ? parseInt(formData.ações) : 1,
        atributos: {
          fisico: formData.atributos.fisico ? parseInt(formData.atributos.fisico) : 0,
          agilidade: formData.atributos.agilidade ? parseInt(formData.atributos.agilidade) : 0,
          intelecto: formData.atributos.intelecto ? parseInt(formData.atributos.intelecto) : 0,
          coragem: formData.atributos.coragem ? parseInt(formData.atributos.coragem) : 0
        },
        qntAntecedentes: 4,
        antecedentes: {
          combate: formData.antecedentes.combate ? parseInt(formData.antecedentes.combate) : 0,
          negocios: formData.antecedentes.negocios ? parseInt(formData.antecedentes.negocios) : 0,
          montaria: formData.antecedentes.montaria ? parseInt(formData.antecedentes.montaria) : 0,
          tradicao: formData.antecedentes.tradicao ? parseInt(formData.antecedentes.tradicao) : 0,
          trabalho: formData.antecedentes.trabalho ? parseInt(formData.antecedentes.trabalho) : 0,
          exploracao: formData.antecedentes.exploracao ? parseInt(formData.antecedentes.exploracao) : 0,
          roubo: formData.antecedentes.roubo ? parseInt(formData.antecedentes.roubo) : 0,
          medicina: formData.antecedentes.medicina ? parseInt(formData.antecedentes.medicina) : 0
        },
        habilidades: formData.habilidades,
        equipamentos: formData.equipamentos,
        criadoEm: new Date()
      }

      const docRef = await addDoc(personagensRef, dataToSave)
      onCharacterCreated(docRef.id)
    } catch (error) {
      console.error('Erro ao criar personagem:', error)
      setErro('Erro ao criar personagem. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="create-character">
      <h1 className="create-title">Novo Personagem</h1>
      
      {erro && <div className="error-message">{erro}</div>}

      <form onSubmit={handleSubmit} className="character-form">
        {/* Seção Básica */}
        <div className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('basicos')}
          >
            <span className="section-toggle">{expandedSections.basicos ? '▼' : '▶'}</span>
            <h2>Informações Básicas</h2>
          </button>

          {expandedSections.basicos && (
            <div className="section-content">
              <div className="form-group">
                <label htmlFor="nome">Nome *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Nome do personagem"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="vulgo">Vulgo</label>
                <input
                  type="text"
                  id="vulgo"
                  name="vulgo"
                  value={formData.vulgo}
                  onChange={handleInputChange}
                  placeholder="Apelido ou nome alternativo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="imagem">URL da Imagem</label>
                <input
                  type="url"
                  id="imagem"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Seção de Atributos Primários */}
        <div className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('atributos')}
          >
            <span className="section-toggle">{expandedSections.atributos ? '▼' : '▶'}</span>
            <h2>Atributos Primários</h2>
          </button>

          {expandedSections.atributos && (
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vida">Vida</label>
                  <input
                    type="number"
                    id="vida"
                    name="vida"
                    value={formData.vida}
                    onChange={handleInputChange}
                    placeholder="Ex: 20"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="defesa">Defesa</label>
                  <input
                    type="number"
                    id="defesa"
                    name="defesa"
                    value={formData.defesa}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="iniciativa">Iniciativa</label>
                  <input
                    type="number"
                    id="iniciativa"
                    name="iniciativa"
                    value={formData.iniciativa}
                    onChange={handleInputChange}
                    placeholder="Ex: 5"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ações">Ações</label>
                  <input
                    type="number"
                    id="ações"
                    name="ações"
                    value={formData.ações}
                    onChange={handleInputChange}
                    placeholder="Ex: 3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Atributos de Personagem */}
        <div className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('atributosPersonagem')}
          >
            <span className="section-toggle">{expandedSections.atributosPersonagem ? '▼' : '▶'}</span>
            <h2>Atributos de Personagem</h2>
          </button>

          {expandedSections.atributosPersonagem && (
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fisico">Físico</label>
                  <input
                    type="number"
                    id="fisico"
                    value={formData.atributos.fisico}
                    onChange={(e) => handleAttributeChange('fisico', e.target.value)}
                    placeholder="Ex: 3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="agilidade">Agilidade</label>
                  <input
                    type="number"
                    id="agilidade"
                    value={formData.atributos.agilidade}
                    onChange={(e) => handleAttributeChange('agilidade', e.target.value)}
                    placeholder="Ex: 2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="intelecto">Intelecto</label>
                  <input
                    type="number"
                    id="intelecto"
                    value={formData.atributos.intelecto}
                    onChange={(e) => handleAttributeChange('intelecto', e.target.value)}
                    placeholder="Ex: 3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="coragem">Coragem</label>
                  <input
                    type="number"
                    id="coragem"
                    value={formData.atributos.coragem}
                    onChange={(e) => handleAttributeChange('coragem', e.target.value)}
                    placeholder="Ex: 2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Antecedentes */}
        <div className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('antecedentes')}
          >
            <span className="section-toggle">{expandedSections.antecedentes ? '▼' : '▶'}</span>
            <h2>Antecedentes</h2>
          </button>

          {expandedSections.antecedentes && (
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="combate">Combate</label>
                  <input
                    type="number"
                    id="combate"
                    value={formData.antecedentes.combate}
                    onChange={(e) => handleBackgroundChange('combate', e.target.value)}
                    placeholder="Ex: 2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="negocios">Negócios</label>
                  <input
                    type="number"
                    id="negocios"
                    value={formData.antecedentes.negocios}
                    onChange={(e) => handleBackgroundChange('negocios', e.target.value)}
                    placeholder="Ex: 1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="montaria">Montaria</label>
                  <input
                    type="number"
                    id="montaria"
                    value={formData.antecedentes.montaria}
                    onChange={(e) => handleBackgroundChange('montaria', e.target.value)}
                    placeholder="Ex: 1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tradicao">Tradição</label>
                  <input
                    type="number"
                    id="tradicao"
                    value={formData.antecedentes.tradicao}
                    onChange={(e) => handleBackgroundChange('tradicao', e.target.value)}
                    placeholder="Ex: 0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="trabalho">Trabalho</label>
                  <input
                    type="number"
                    id="trabalho"
                    value={formData.antecedentes.trabalho}
                    onChange={(e) => handleBackgroundChange('trabalho', e.target.value)}
                    placeholder="Ex: 1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="exploracao">Exploração</label>
                  <input
                    type="number"
                    id="exploracao"
                    value={formData.antecedentes.exploracao}
                    onChange={(e) => handleBackgroundChange('exploracao', e.target.value)}
                    placeholder="Ex: 2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="roubo">Roubo</label>
                  <input
                    type="number"
                    id="roubo"
                    value={formData.antecedentes.roubo}
                    onChange={(e) => handleBackgroundChange('roubo', e.target.value)}
                    placeholder="Ex: 1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="medicina">Medicina</label>
                  <input
                    type="number"
                    id="medicina"
                    value={formData.antecedentes.medicina}
                    onChange={(e) => handleBackgroundChange('medicina', e.target.value)}
                    placeholder="Ex: 0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Habilidades */}
        <div className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('habilidades')}
          >
            <span className="section-toggle">{expandedSections.habilidades ? '▼' : '▶'}</span>
            <h2>Habilidades</h2>
          </button>

          {expandedSections.habilidades && (
            <div className="section-content">
              <div className="form-group">
                <label htmlFor="habilidades">Descrição de Habilidades</label>
                <textarea
                  id="habilidades"
                  name="habilidades"
                  value={formData.habilidades}
                  onChange={handleInputChange}
                  placeholder="Liste as habilidades do personagem..."
                  rows="5"
                />
              </div>
            </div>
          )}
        </div>

        {/* Seção de Equipamentos */}
        <div className="form-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection('equipamentos')}
          >
            <span className="section-toggle">{expandedSections.equipamentos ? '▼' : '▶'}</span>
            <h2>Equipamentos</h2>
          </button>

          {expandedSections.equipamentos && (
            <div className="section-content">
              <div className="form-group">
                <label htmlFor="equipamentos">Descrição de Equipamentos</label>
                <textarea
                  id="equipamentos"
                  name="equipamentos"
                  value={formData.equipamentos}
                  onChange={handleInputChange}
                  placeholder="Liste os equipamentos do personagem..."
                  rows="5"
                />
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={carregando}
          >
            {carregando ? 'Criando...' : 'Criar Personagem'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={carregando}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCharacter
