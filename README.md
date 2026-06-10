# SoundSearch

Aplicação web universitária para pesquisa de músicas e curadoria de playlists para rádios acadêmicas. Desenvolvida como projeto de aula com integração às APIs do iTunes e Firebase.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase&logoColor=white)
![iTunes API](https://img.shields.io/badge/API-iTunes%20Search-black?logo=apple&logoColor=white)

---

## Sobre o Projeto

A **SoundSearch** é uma vitrine universitária para descoberta musical voltada à curadoria da rádio do campus. Estudantes pesquisam músicas no catálogo do iTunes, montam playlists e enviam sugestões diretamente para a coordenação da rádio, que visualiza todas as submissões em tempo real via Firebase Firestore.

---

## Funcionalidades

- **Busca de músicas, álbuns e artistas** via iTunes Search API
- **Filtros** por tipo de conteúdo e classificação (explícito / não explícito)
- **Preview de áudio** integrado diretamente na listagem
- **Modal de detalhes** com informações completas (gênero, duração, preço, etc.)
- **Playlist pessoal** — adicione e remova itens durante a sessão
- **Marcação de faixas** para sugestão à rádio
- **Formulário de sugestão** com validação de campos (nome, matrícula, e-mail acadêmico, justificativa)
- **Envio para Firebase Firestore** — dados salvos em tempo real na nuvem
- **Histórico de sugestões** — visualização de todas as submissões ordenadas por data
- **Layout responsivo** com abas mobile para alternar entre resultados e playlist

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES Modules) |
| Ícones | Font Awesome 6 |
| API de músicas | [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) |
| Banco de dados | Firebase Firestore (NoSQL em nuvem) |

---

## Como Executar

Este é um projeto front-end puro — sem dependências para instalar.

1. Clone o repositório:
   ```bash
   git clone https://github.com/Erlandsonjr/SoundSearch
   cd SoundSearch
   ```

2. Abra o `index.html` no navegador, **ou** use a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code para servir localmente.

> **Nota sobre Firebase:** A configuração do cliente Firebase em `app.js` é pública por design — ela é incorporada em todo app web Firebase e enviada ao navegador de cada visitante. A segurança real é gerenciada pelas **Firebase Security Rules** no console do projeto.

---

## Estrutura de Arquivos

```
SoundSearch/
├── index.html      # Estrutura HTML, modais e formulário
├── style.css       # Estilos e layout responsivo
├── api.js          # Chamada à iTunes Search API
├── playlist.js     # Estado e persistência da playlist (localStorage)
└── app.js          # Lógica principal, integração Firebase e DOM
```

---

## Contexto Acadêmico

Projeto desenvolvido como atividade da disciplina de **Desenvolvimento Web**, com foco em integração de APIs externas, armazenamento em nuvem e responsividade.
