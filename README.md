# SOM DAS SEIS - Gerenciador de Personagens RPG

Sistema web para gerenciamento de personagens de RPG desenvolvido com React, baseado na ficha de personagem "SOM DAS SEIS".

## 🎲 Características

- **Ficha Completa**: Todos os campos da ficha original estão implementados
- **Estados React**: Cada campo possui seu próprio estado gerenciado
- **Visual Vintage**: Design inspirado em fichas clássicas de RPG
- **Interativo**: Clique nos círculos para ajustar níveis de atributos e antecedentes
- **Gerenciamento de Habilidades**: Adicione e remova habilidades facilmente

## 📋 Campos Implementados

### Identificação
- Nome do personagem
- Nível

### Atributos (0-5 níveis cada)
- Físico
- Agilidade
- Intelecto
- Coragem

### Estatísticas Principais
- Vida
- Defesa

### Características Pessoais
- Tormento
- Recompensa

### Economia de Ação
- Iniciativa
- Ações

### Antecedentes (0-5 níveis cada)
- Combate
- Negócios
- Montaria
- Tradição
- Labuta
- Exploração
- Roubo
- Medicina

### Habilidades
- Lista editável de habilidades do personagem

## 🚀 Como Usar

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o Firebase:
   - Siga as instruções no arquivo `FIREBASE_SETUP.md`
   - Crie um arquivo `.env` na raiz do projeto com suas credenciais do Firebase
   - Habilite Email/Password Authentication no Firebase Console

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## 🛠️ Tecnologias

- **React 18**: Biblioteca JavaScript para interfaces
- **Vite**: Build tool moderna e rápida
- **Firebase Authentication**: Sistema de autenticação com email e senha
- **CSS3**: Estilização com visual vintage/retro

## 🔐 Autenticação

O sistema utiliza Firebase Authentication para gerenciar usuários:
- Login com email e senha
- Cadastro de novos usuários
- Logout
- Persistência de sessão
- Tratamento de erros

Para configurar, consulte o arquivo `FIREBASE_SETUP.md`.

## 📝 Estrutura do Projeto

```
RPG/
├── src/
│   ├── components/
│   │   ├── CharacterSheet.jsx    # Componente principal da ficha
│   │   └── Login.jsx              # Componente de autenticação
│   ├── config/
│   │   └── firebase.js            # Configuração do Firebase
│   ├── styles/
│   │   ├── CharacterSheet.css     # Estilos da ficha
│   │   └── Login.css              # Estilos do login
│   ├── App.jsx                    # Componente raiz
│   ├── App.css                    # Estilos do App
│   ├── main.jsx                   # Ponto de entrada
│   └── index.css                  # Estilos globais
├── index.html                     # HTML principal
├── package.json                   # Dependências
├── vite.config.js                # Configuração do Vite
├── .env                           # Variáveis de ambiente (criar)
├── FIREBASE_SETUP.md             # Instruções de configuração do Firebase
└── README.md                      # Este arquivo
```

## 🎨 Personalização

Todos os estados são gerenciados no componente `CharacterSheet.jsx`. Você pode:
- Modificar valores iniciais
- Adicionar validações
- Integrar com localStorage para salvar personagens
- Adicionar múltiplos personagens
- Exportar/importar fichas

## 📄 Licença

Este projeto é de código aberto e está disponível para uso pessoal e educacional.


