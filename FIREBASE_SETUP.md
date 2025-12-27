# Configuração do Firebase

## Passo a Passo para Configurar Firebase Authentication

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: "rpg-character-manager")
4. Siga as instruções para criar o projeto

### 2. Habilitar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", habilite "Email/Password"
4. Clique em "Email/Password" e ative a opção
5. Salve as alterações

### 3. Obter Credenciais do Firebase

1. No menu lateral, clique no ícone de engrenagem ⚙️ ao lado de "Visão geral do projeto"
2. Selecione "Configurações do projeto"
3. Role até "Seus apps" e clique no ícone da Web `</>`
4. Registre um app (dê um nome, ex: "RPG Character Manager")
5. Copie as credenciais do Firebase que aparecem

### 4. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto (mesmo nível do `package.json`)
2. Adicione as seguintes variáveis com os valores do seu projeto Firebase:

```env
VITE_FIREBASE_API_KEY=sua-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

**Importante:** 
- Substitua os valores acima pelas suas credenciais reais do Firebase
- Nunca commite o arquivo `.env` no Git (ele já está no `.gitignore`)
- O arquivo `.env` deve estar na raiz do projeto

### 5. Instalar Dependências

Execute no terminal:

```bash
npm install
```

### 6. Testar

1. Execute o projeto:
```bash
npm run dev
```

2. Acesse a aplicação e teste:
   - Criar uma nova conta (cadastrar-se)
   - Fazer login com a conta criada
   - Fazer logout

## Funcionalidades Implementadas

✅ Login com email e senha
✅ Cadastro de novos usuários
✅ Logout
✅ Persistência de sessão (usuário permanece logado ao recarregar a página)
✅ Tratamento de erros com mensagens amigáveis
✅ Validação de formulário

## Segurança

- As credenciais do Firebase são armazenadas em variáveis de ambiente
- O arquivo `.env` não é versionado no Git
- A autenticação é gerenciada pelo Firebase Authentication
- Senhas são criptografadas pelo Firebase

## Solução de Problemas

### Erro: "Firebase: Error (auth/invalid-api-key)"
- Verifique se as variáveis de ambiente estão corretas no arquivo `.env`
- Certifique-se de que o arquivo `.env` está na raiz do projeto
- Reinicie o servidor de desenvolvimento após criar/editar o `.env`

### Erro: "Firebase: Error (auth/operation-not-allowed)"
- Verifique se o método de autenticação Email/Password está habilitado no Firebase Console

### Erro: "Firebase: Error (auth/network-request-failed)"
- Verifique sua conexão com a internet
- Verifique se as regras do Firebase permitem a operação

