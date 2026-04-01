# 💸 Onda Finance

> Simulação de um aplicativo bancário moderno, focado em **UX**, **boas práticas de front-end** e **arquitetura escalável**.

---

## 📌 Sobre o Projeto

O **Onda Finance** é uma aplicação web que simula funcionalidades básicas de um banco digital, como:

* 🔐 Login com persistência de sessão (mock)
* 💰 Visualização de saldo
* 📊 Histórico de transações (mock)
* ⚡ Transferência via PIX com validações
* 🧪 Estrutura preparada para testes

O projeto foi desenvolvido como parte de um desafio técnico, com foco em **organização de código**, **boas práticas** e **uso de tecnologias modernas do ecossistema React**.

---

## 🚀 Tecnologias Utilizadas

* ⚛️ React + TypeScript
* ⚡ Vite
* 🎨 Tailwind CSS + CVA
* 🧩 shadcn/ui + Radix UI
* 🔀 React Router
* 📦 Zustand (gerenciamento de estado)
* 🧾 React Hook Form + Zod (formulários e validação)
* 🌐 Axios
* 🧪 Vitest

---

## ▶️ Como Rodar o Projeto

### 📦 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/onda-finance.git
cd onda-finance
```

### 📥 2. Instalar dependências

```bash
npm install
```

### ▶️ 3. Rodar o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

---

## 🧠 Decisões Técnicas

### 📁 Estrutura baseada em **features**

Organização por domínio de negócio:

```
src/
 ├── features/
 │    ├── auth/
 │    ├── dashboard/
 │    └── transfer/
```

👉 Facilita escalabilidade e manutenção.

---

### 🧩 Zustand para estado global

* Simples e direto
* Evita boilerplate excessivo (como Redux)
* Ideal para aplicações pequenas/médias

---

### 📋 React Hook Form + Zod

* Validação declarativa e segura
* Integração perfeita com TypeScript
* Melhora a experiência do usuário com feedback imediato

---

### 🎨 Tailwind + shadcn/ui

* UI consistente e moderna
* Componentes reutilizáveis
* Alta produtividade no desenvolvimento

---

### ⚡ Vite

* Build extremamente rápido
* Melhor DX (Developer Experience)

---

### 🔒 Simulação de autenticação (Mock)

* Dados armazenados localmente
* Persistência usando storage
* Ideal para ambiente de teste sem backend

---

## 📊 Funcionalidades Implementadas

### 🔐 Login

* Validação de usuário mock
* Persistência de sessão

---

### 📊 Dashboard

* Exibição de saldo
* Listagem de transações simuladas

---

### ⚡ Transferência (PIX)

* Validação de formulário
* Verificação de saldo + limite
* Simulação de autenticação (senha + token)
* Atualização de saldo em tempo real

---

### 🚧 Funcionalidades bloqueadas (UX)

* Botões com hover vermelho indicando features não implementadas

---

## 🔮 Melhorias Futuras

* 🔗 Integração com backend real (API REST)
* 🔐 Autenticação com JWT
* 🧪 Testes automatizados completos com Vitest
* 📱 Responsividade aprimorada (mobile-first)
* 📊 Gráficos financeiros (charts)
* 💳 Histórico detalhado de transações
* 🌍 Internacionalização (i18n)
* 🔔 Sistema de notificações

---

## 🔐 Segurança e Proteção Contra Engenharia Reversa

Embora este projeto seja front-end e utilize dados mockados, em um cenário real, algumas práticas essenciais seriam:

### 🔒 1. Proteção de código

* Minificação e obfuscação no build
* Uso de ferramentas como:

  * Terser
  * Webpack/Vite obfuscators

---

### 🌐 2. Proteção de dados

* Nunca armazenar dados sensíveis no front-end
* Uso de HTTPS obrigatório
* Tokens seguros (JWT com expiração)

---

### 🔑 3. Autenticação segura

* Implementação de OAuth ou JWT
* Refresh tokens
* Proteção contra XSS e CSRF

---

### 🔍 4. Segurança de API

* Validação no backend (NUNCA confiar no front)
* Rate limiting
* Logs e monitoramento

---

### 📦 5. Variáveis de ambiente

* Uso de `.env`
* Nunca expor chaves diretamente no código

---

## 📸 Preview


---

## 🏁 Conclusão

Este projeto demonstra:

✔ Organização profissional de código
✔ Uso moderno do ecossistema React
✔ Boas práticas de UX e arquitetura
✔ Capacidade de evolução para produção

---

## 👨‍💻 Autor

**Diego Morgado**


---

> 💡 *Projeto desenvolvido com foco em aprendizado, qualidade de código e evolução contínua.*
