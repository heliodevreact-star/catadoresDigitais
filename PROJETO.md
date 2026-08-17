# Catadores Digitais — Estado do Projeto

## Stack

| Projeto | Tecnologias |
|---------|------------|
| Landing | Vite + React + TypeScript + Tailwind + Framer Motion |
| Platform | Next.js 16 (App Router, Turbopack) + Firebase (Auth + Firestore) + Tailwind v4 |

---

## Landing Page

### Concluído ✅
- Navbar com logo "Catadores Digitais" (Barlow Condensed, gradiente, sem ícone) + toggle de tema
- Hero section com animações
- Seção de Cursos
- Seção de Público-alvo / Inscrições
- Seção "Realização e Patrocínio" com logos reais (Instituto Ipês + Caixa Econômica Federal)
- Marquee de tecnologias ensinadas
- Footer com navegação e tagline
- Tema dark/light persistido
- Responsividade mobile com menu hambúrguer
- Formulário de inscrição ("Seja o primeiro a saber") grava direto no Firestore (`leads/{id}`, client SDK) — honeypot anti-bot, validação de email client + Firestore Rules, admin vê a lista em `/dashboard/admin/leads`
- Deploy em produção — domínio próprio `catadoresdigitais.com.br` (Vercel)

### Pendente ❌
- SEO: meta tags, Open Graph, sitemap

---

## Platform

> Deploy em produção na Vercel, hoje na URL provisória do projeto (ex: `catadores-digitais-hnt6.vercel.app`) — ainda não migrado para o domínio final `www.catadoresdigitais.com.br/plataforma` (path-based routing, a configurar). Domínio precisa estar em Firebase Console → Authentication → Authorized domains pro login com Google funcionar (ver `platform/README.md`).

### Autenticação
| Feature | Status |
|---------|--------|
| Login com Google | ✅ |
| Sessão server-side (cookies HttpOnly) | ✅ |
| Proteção de rotas por role (admin / teacher / student) | ✅ |
| Logout | ✅ |
| Matrícula automática na turma do convite (allowlist) no primeiro login (`/api/auth/enroll`) | ✅ |
| Logout automático por inatividade | ❌ |

---

### Navbar do Dashboard
| Feature | Status |
|---------|--------|
| Logo "Catadores Digitais" linkando para landing | ✅ |
| Título do painel por role com link para home | ✅ |
| Avatar, nome e e-mail do usuário | ✅ |
| Toggle de tema dark/light | ✅ |
| Botão de logout | ✅ |

---

### Painel Admin
| Feature | Status |
|---------|--------|
| Stats: total de alunos, professores, admins | ✅ |
| "Próximas aulas" com turma, professor e horário | ✅ |
| Acesso rápido às turmas | ✅ |
| Lista de usuários com gestão de roles (aluno ↔ professor) | ✅ |
| Busca / filtro na lista de usuários (filtro padrão: Professores) | ✅ |
| Paginação de 10 usuários por página | ✅ |
| Deletar usuário (com confirmação inline) | ✅ |
| Allowlist: adicionar / remover emails com role + turma obrigatória | ✅ |
| Allowlist mostra a turma vinculada a cada convite na lista | ✅ |
| UserDetailPanel (slide-over de detalhes do usuário) | ✅ |
| UserDetailPanel: adicionar / remover de turmas (aluno e professor) | ✅ |
| UserDetailPanel: editar nome do usuário (inline, salvo no Firestore) | ✅ |
| Interessados da landing (`/dashboard/admin/leads`) — lista de emails capturados pelo formulário, com remoção | ✅ |

---

### Painel do Professor
| Feature | Status |
|---------|--------|
| Stats: minhas turmas, alunos no total, aulas esta semana, próximas aulas | ✅ |
| Minhas turmas (filtradas via `/api/teacher/turmas`) | ✅ |
| Próximas aulas do professor (via `/api/teacher/upcoming-aulas`) | ✅ |
| Link para a turma a partir das próximas aulas | ✅ |
| Gestão de aulas/materiais nas turmas onde é professor | ✅ (via CalendarGrid) |

---

### Painel do Aluno
| Feature | Status |
|---------|--------|
| Stats: aulas esta semana (contagem), próximas aulas (data das até 3 mais próximas, não mais contagem), frequência (%) | ✅ |
| Aviso de frequência baixa (< 85%) | ✅ |
| Minha turma com barra de progresso temporal | ✅ |
| Próximas aulas agrupadas por data com tag da turma e professor | ✅ |
| Link direto para página da aula (`/dashboard/aula/[turmaId]/[aulaId]`) | ✅ |
| Clique em qualquer AulaCard dentro da turma (passada ou futura) navega para a página da aula | ✅ |
| Aba **Conquistas** (dentro do painel da turma) — diplomas já conquistados (link pro PDF/verificação) e marcos "em andamento" (selecionado, ainda não emitido) | ✅ |

---

### Turmas
| Feature | Status |
|---------|--------|
| Listar turmas com ícone e cor | ✅ |
| Criar turma (nome, ícone, cor, datas, alunos) | ✅ |
| Editar turma | ✅ |
| Deletar turma (na lista e na edição, com confirmação) | ✅ |
| Gerenciar alunos/professores matriculados direto na tela de edição da turma | ❌ (hoje só é possível via perfil do usuário, no painel admin) |

---

### Aulas
| Feature | Status |
|---------|--------|
| CalendarGrid — grade mensal de aulas | ✅ |
| Sincronização de mês entre calendário e painel de conteúdo | ✅ |
| Criar aula (data, horário, título, descrição, professores) | ✅ |
| Editar aula | ✅ |
| Deletar aula | ✅ |
| Bloqueio de data passada ao criar aula (calendário não deixa clicar em dia passado; campo de data com `min`; validação também na API) | ✅ |
| Calendário colapsável com FAB para reabrir | ✅ |
| Página individual de aula (`/dashboard/aula/[turmaId]/[aulaId]`) | ✅ |
| Botão "Ver aula" no `AulaModal` (modo view) navega para a página da aula | ✅ |
| Layout da turma com scroll de página unificado — sem scroll individual por coluna | ✅ |
| Mobile: conteúdo acima, calendário abaixo; desktop: calendário sticky à direita | ✅ |
| CTA "Criar primeira aula" no estado vazio da aba Conteúdo (abre `AulaModal` com data padrão = hoje, se dentro do período da turma) | ✅ |
| CTA "Agendar nova aula" (borda tracejada) abaixo da lista, quando já existem aulas | ✅ |
| Badge do mês/ano no topo da aba Conteúdo com cor saturada da turma, sincronizado com o calendário ao lado | ✅ |

> O modal de aula (`AulaModal`) não exibe mais **Arquivos**, **Código de chamada** nem **Chamada** — isso fica a cargo das abas **Conteúdo** e **Banco de Aulas**, e da página individual da aula.

---

### Banco de Aulas
| Feature | Status |
|---------|--------|
| Criar aula no banco (`turmas/{id}/banco/{bancoId}`) | ✅ |
| Editar / deletar aula do banco | ✅ |
| Agendar aula do banco para uma data (`/api/turmas/[id]/banco/[bancoId]/agendar`) | ✅ |
| Painel BancoPanel com lista e modal de criação/edição | ✅ |
| AgendarBancoModal para escolher data e horário ao agendar | ✅ |
| Botão "Agendar" (disponíveis) vs "Agendar novamente" (aplicadas) | ✅ |
| Bloqueio de data passada ao agendar (campo `min` + validação na API) | ✅ |

---

### Materiais
| Feature | Status |
|---------|--------|
| Adicionar link (Drive, YouTube, Vimeo, Docs, Slides) | ✅ |
| Adicionar bloco de texto (`type: 'text'`) com título opcional e conteúdo livre | ✅ |
| Detecção automática de tipo de link (vídeo vs documento) | ✅ |
| Bloco de texto expande/recolhe inline no card da aula (sem abrir modal) | ✅ |
| Visualizador inline com iframe para links (MaterialViewer) | ✅ |
| "Abrir em nova aba" | ✅ |
| Remover material | ✅ |
| Reordenar materiais com botões ↑ / ↓ (salva imediatamente) | ✅ |
| Botões de adição separados: "+ Link" e "+ Texto" | ✅ |
| Retrocompatibilidade: itens antigos sem `type` tratados como `'link'` | ✅ |

> O tipo `Material` (substitui `DriveLink` nas aulas) aceita `{ id?, type?, label, url?, content? }`. `BancoAula` ainda usa `DriveLink` legado.

> Na página individual da aula (`/dashboard/aula/…`), textos de conteúdo, descrição, perguntas e opções de avaliação usam `text-base` para melhor legibilidade.

---

### Avaliações
| Feature | Status |
|---------|--------|
| Tipo "Link" — resposta deve ser uma URL válida | ✅ |
| Tipo "Texto" — resposta aberta com limite de 404 caracteres | ✅ |
| Tipo "Quiz" — 5 opções, primeira é a correta, embaralhadas para o aluno | ✅ |
| Criar avaliação | ✅ |
| Deletar avaliação | ✅ |
| "Testar avaliação" — simulação da visão do aluno | ✅ |
| Submissão real pelo aluno via página da aula | ✅ |
| API `/api/turmas/[id]/aulas/[aulaId]/respostas` (GET por role, POST do aluno) | ✅ |
| Ver respostas dos alunos (visão professor / admin) — dentro do modal de chamada (`ChamadaEditModal`), por aluno, com indicador de certo/errado em quiz e link clicável | ✅ |
| Feedback / correção de respostas abertas | ❌ |

---

### Frequência (Chamada)
| Feature | Status |
|---------|--------|
| Campo `attendance` no tipo `Aula` | ✅ |
| `attendanceCode` — código de 4 dígitos gerado pelo professor | ✅ |
| Professor revela o código de chamada (botão "Código de chamada", aba Conteúdo/Presenças); desabilitado em aulas já encerradas | ✅ |
| Aluno responde chamada com código (página `/dashboard/aula/[turmaId]/[aulaId]`) | ✅ |
| API `/api/turmas/[id]/aulas/[aulaId]/chamada` (POST) | ✅ |
| API `/api/student/frequencia` — percentual de presença do aluno | ✅ |
| Edição manual de presença (Presente/Falta) pelo professor — botão "Mostrar alunos (N)" na aba Presenças abre `ChamadaEditModal`, com salvamento em tempo real por aluno (PATCH a cada clique) | ✅ |
| `ChamadaEditModal` mostra nome do aluno (buscado via `/api/turmas/[id]/students`) | ✅ |
| Status "Atrasado" (`late`) — ainda existe no schema/legado (frequência conta como presença), mas não é mais oferecido na UI manual, só Presente/Falta | ℹ️ |
| Relatório por turma (`/dashboard/admin/turmas/[id]/relatorio`): tabela aluno × aula com presença e conclusão, card de presença média, filtro por período, download CSV | ✅ |
| Relatório acessível ao professor (além do admin) | ✅ |

---

### Diplomas
Diplomas não são só de conclusão final — admin/professor cria **marcos** (`turmas/{id}/diplomas/{id}`) em qualquer ponto do curso (ex: 3 mini-diplomas dentro de uma turma grande), cada um com título, descrição opcional, data alcançada, carga horária e uma lista de alunos manualmente selecionados. Emitir (aba Diplomas, admin/professor) é uma ação separada de criar o marco — gera um doc imutável por aluno em `diplomasEmitidos/{id}` (snapshot dos dados no momento da emissão, inclusive nome/assinatura do coordenador — não muda retroativamente se a turma for editada depois).

| Feature | Status |
|---------|--------|
| Aba **Diplomas** no painel da turma (admin/professor) | ✅ |
| Coordenador geral (nome + assinatura) configurável por turma, admin-only | ✅ |
| Upload de assinatura — redimensionada no client (canvas), guardada como PNG base64 no doc da turma (sem Firebase Storage) | ✅ |
| Criar marco: título, descrição opcional, data (dentro do período da turma), carga horária em horas, seleção manual de alunos | ✅ |
| Editar marco existente (inclusive pra preencher `hours` em marcos criados antes desse campo existir) | ✅ |
| Apagar marco (admin-only) — não apaga diplomas já emitidos | ✅ |
| Emitir diplomas pros alunos selecionados — CPF ausente no perfil é pedido inline na hora de emitir (gravado só no diploma, não no perfil) | ✅ |
| Dedupe — reemitir pro mesmo aluno no mesmo marco não duplica | ✅ |
| PDF do diploma (`@react-pdf/renderer`, paisagem A4): logo Ipês + logo Caixa (`caixa_fsa_light.png`), título, nome do aluno, CPF, carga horária, data e nome da turma em negrito, assinatura do coordenador, QR code | ✅ |
| Página pública de verificação `/diploma/[id]` (Server Component, sem login) — mostra os mesmos dados + botão de baixar o PDF | ✅ |
| QR aponta pra `{origin}/diploma/{id}` — `origin` vem de `NEXT_PUBLIC_SITE_URL` se definida, senão do host da própria requisição. PDFs já baixados guardam a URL de quando foram gerados; setar essa env var quando o domínio final estiver pronto só afeta PDFs gerados dali pra frente | ✅ |
| Aba **Conquistas** (aluno, dentro do painel da turma) — diplomas conquistados (com link) e marcos em andamento | ✅ |
| Listagem "meus diplomas" cross-turma no dashboard principal do aluno | ❌ (fora de escopo por ora — o link público já cobre o acesso) |

---

## Rotas API (plataforma)

| Rota | Método | Acesso |
|------|--------|--------|
| `/api/auth/session` | POST | público |
| `/api/auth/enroll` | POST | usuário autenticado (self, matrícula automática no 1º login) |
| `/api/admin/allowlist` | GET, POST | admin |
| `/api/admin/allowlist/[email]` | DELETE | admin |
| `/api/admin/leads` | GET | admin |
| `/api/admin/leads/[id]` | DELETE | admin |
| `/api/admin/upcoming-aulas` | GET | admin/teacher |
| `/api/admin/users` | GET | admin |
| `/api/admin/users/[uid]` | PATCH, DELETE | admin |
| `/api/admin/turmas` | GET | admin |
| `/api/admin/turmas/[id]` | GET, PATCH, DELETE | admin |
| `/api/teacher/turmas` | GET | teacher |
| `/api/teacher/upcoming-aulas` | GET | teacher |
| `/api/student/turmas` | GET | student |
| `/api/student/upcoming-aulas` | GET | student |
| `/api/student/frequencia` | GET | student |
| `/api/turmas/[id]` | GET, PATCH, DELETE | editor |
| `/api/turmas/[id]/aulas` | GET, POST | editor |
| `/api/turmas/[id]/aulas/[aulaId]` | GET, PATCH, DELETE | editor |
| `/api/turmas/[id]/aulas/[aulaId]/chamada` | POST | any |
| `/api/turmas/[id]/aulas/[aulaId]/respostas` | GET, POST | any (GET: editor vê todas; aluno vê só as suas) |
| `/api/turmas/[id]/banco` | GET, POST | editor |
| `/api/turmas/[id]/banco/[bancoId]` | GET, PATCH, DELETE | editor |
| `/api/turmas/[id]/banco/[bancoId]/agendar` | POST | editor |
| `/api/turmas/[id]/students` | GET | editor (retorna `{ email, name, cpf }[]`) |
| `/api/turmas/[id]/diplomas` | GET, POST | any (GET) / editor (POST) |
| `/api/turmas/[id]/diplomas/[milestoneId]` | GET, PATCH, DELETE | any (GET) / editor (PATCH) / admin (DELETE) |
| `/api/turmas/[id]/diplomas/[milestoneId]/issue` | POST | editor |
| `/api/turmas/[id]/diplomas/[milestoneId]/issued` | GET | editor |
| `/api/turmas/[id]/diplomas/mine` | GET | any (retorna só os diplomas do próprio usuário) |
| `/api/diplomas/[id]/pdf` | GET | público (URL de capacidade — ID aleatório do Firestore) |
| `/api/users/teachers` | GET | editor |
| `/api/admin/turmas/[id]/relatorio` | GET | admin |

---

## Schema Firestore

- `users/{uid}` — `{ uid, email, name, photoURL, role, createdAt, phone?, cpf?, birthDate? }`
- `allowlist/{email}` — `{ email, role, turmaId, createdAt }`
- `leads/{id}` — `{ email, source, createdAt }` (`source: 'landing'`) — criação pública via Firestore Rules (client SDK da `/landing`, projeto separado); leitura só via Admin SDK
- `turmas/{id}` — `{ name, icon, iconColor, startDate, endDate, students: string[], professors?: TurmaTeacher[], createdBy, createdAt, coordinatorName?, coordinatorSignature? }` (`coordinatorSignature` é um data URI PNG base64, direto no doc)
- `turmas/{id}/aulas/{id}` — `{ title, description, date, startTime, endTime, status, teachers: AulaTeacher[], driveLinks: Material[], attendance: { [email]: 'present'|'absent'|'late'|null }, attendanceCode?, avaliacoes?, bancoAulaId?, createdAt }` onde `Material = { id?, type?: 'link'|'text', label, url?, content? }`
- `turmas/{id}/aulas/{id}/respostas/{email}` — `{ studentEmail, studentName, answers: Record<avaliacaoId, string>, submittedAt }`
- `turmas/{id}/banco/{id}` — `{ title, description, teachers: AulaTeacher[], driveLinks, avaliacoes?, createdBy, createdAt }`
- `turmas/{id}/diplomas/{id}` — marco/template: `{ title, description?, achievedDate, hours, recipientEmails: string[], issuedEmails: string[], createdBy, createdAt }`
- `diplomasEmitidos/{id}` (top-level, não subcoleção) — diploma emitido, imutável: `{ turmaId, turmaName, milestoneId, title, description?, achievedDate, hours, studentEmail, studentName, studentCpf, coordinatorName, coordinatorSignature, issuedBy, issuedAt }` — leitura/escrita só via Admin SDK (a página pública `/diploma/[id]` e a rota do PDF rodam server-side, então não precisam de regra pública)

---

## Prioridades sugeridas

1. **Gerenciar matrículas na tela de edição da turma** — adicionar / remover alunos e professores direto na turma (hoje só dá pra fazer pelo perfil do usuário)
2. **Path-based routing do `/platform`** — migrar de URL provisória da Vercel pra `www.catadoresdigitais.com.br/plataforma`, e depois adicionar esse domínio em Firebase Authorized domains
3. **Preencher `hours` nos marcos de diploma criados antes desse campo existir** (pelo menos 2 marcos e 1 diploma já emitido na "Turma Teste 2" ficaram sem carga horária — editável pela aba Diplomas, exceto o diploma já emitido, que é imutável)
4. **Editar CPF de outro usuário** via admin (hoje só existe autoedição do próprio perfil — a emissão de diploma contorna isso pedindo o CPF inline na hora, mas não atualiza o cadastro)
