# Escritório de Agentes · AXIS Labs

Um escritório isométrico no navegador, estilo Habbo, para acompanhar e operar
os agentes de IA da **AXIS Labs** — agência de marketing esportivo com IA
(nicho inicial: academias de jiu-jítsu). Cada agente é um boneco com mesa e
computador próprios; clicar no computador dele abre o **sistema daquele agente**
ali dentro, com botões para ligar, desligar, ver o log e conversar com ele pelo
Claude Code.

> **Performance que acelera.**

- Direção, sala de serviço, lounge, sala de reunião e recepção, no tema escuro neon da marca.
- Os bonecos trabalham na própria mesa, descansam no lounge e se juntam na reunião.
- O escritório sobe os sistemas locais, vigia quem caiu e religa sozinho.
- Nenhuma dependência: só Node.js.

## Começar

Precisa do [Node.js](https://nodejs.org) 18 ou mais novo.

**Atalho (macOS):** dê dois cliques em **`Abrir AXIS Labs.command`** — ele sobe
o escritório e abre o navegador sozinho. Se o Mac bloquear na primeira vez,
clique com o botão direito no arquivo e escolha **Abrir**. Para desligar, feche
a janela do Terminal que ele abriu.

Ou, pelo Terminal:

```bash
npm start
```

Abra **http://localhost:4321**. Os agentes já vêm contratados: clique no
computador de um deles e em **Ligar** para abrir o sistema dele.

## Os agentes

Cada agente cuida de uma área e tem um sistema próprio, na pasta
`agentes/<área>`. O sistema mostra os números da área, uma lista **O que
melhorar agora** (do mais urgente para o menos, com o fato e a ação sugerida)
e as listas para cadastrar e editar os dados.

### Times de negócio

| Agente | Área | Porta | Acompanha |
| --- | --- | --- | --- |
| Vitor | Direção | 4416 | clientes, MRR, ticket e o plano de melhorias de todas as áreas |
| Bia | Atendimento | 4411 | leads, tempo de 1ª resposta, canais |
| Mel | Marketing | 4413 | campanhas, leads por campanha e custo por lead |
| Caio | Comercial | 4412 | aulas experimentais, comparecimento, matrículas e meta do mês |
| Théo | Jurídico | 4414 | contratos, LGPD (responsável por dados) e prazos |
| Rui | Financeiro | 4415 | faturas, inadimplência e custos (inclusive IA) |

### A Legião · núcleo de IA

| Agente | Área | Porta | Acompanha |
| --- | --- | --- | --- |
| Átila | Planejamento | 4417 | planos, backlog e lead time |
| Íris | Pesquisa | 4418 | pesquisas de mercado, concorrência e benchmarks |
| Dino | Implementação | 4419 | automações e integrações (o que está no ar ou falhando) |
| Quim | Qualidade (QA) | 4420 | revisões antes de ir ao cliente |
| Max | Segurança | 4421 | riscos, permissões e LGPD técnica |

- As áreas leem os dados umas das outras. Uma academia cadastrada na Direção
  vira referência nos leads (Atendimento), nas aulas (Comercial), nos contratos
  (Jurídico) e nas faturas (Financeiro).
- Na Direção, **Colocar no plano** transforma qualquer alerta numa melhoria com
  responsável e prazo.
- Os sistemas começam com dados de **exemplo**, marcados nas listas. O botão
  **Apagar exemplos de todas as áreas**, na Direção, limpa tudo de uma vez.
- Os dados ficam em `agentes/dados/` (fora do git). Cada sistema reescreve o
  `RELATORIO.md` da sua pasta a cada mudança, e o `CLAUDE.md` diz ao agente quem
  ele é e no que focar. É isso que ele lê em **Conversar** e na reunião.
- Para rodar um sistema sem o escritório: `node agentes/comercial/server.js`.
- Os números e os alertas saem de `agentes/nucleo/indicadores.js`.

## Conversar com um agente

No monitor, **💬 Conversar** abre uma sessão do
[Claude Code](https://claude.com/claude-code) dentro da pasta do sistema:
**Investigar** só lê e explica; **Resolver** pode editar o projeto. Precisa do
Claude Code instalado e logado nesta máquina.

## Reunião dos agentes

Na sala de reunião, **▶ Reunir agora** junta os agentes com sistema local. Cada
um lê o próprio projeto e diz um número real, uma melhoria e o que precisa de
outro agente; no fim, um briefing junta tudo. Cada fala é uma chamada ao Claude
e consome a cota do seu plano, por isso o horário automático vem **desligado**.

## Configuração

Copie `data/config.exemplo.json` para `data/config.json` e ajuste `nome`,
`dono`, `empresa`, a `porta` e a reunião. As cores do escritório ficam no topo
de `css/style.css`; as da tela dos agentes, em `agentes/nucleo/tela.css`.

## Estrutura

```
server.js          servidor: tela, API, sobe/vigia os sistemas
js/                motor isométrico, salas, móveis, bonecos, painéis
css/style.css      tema do escritório
agentes/nucleo/    o código comum dos sistemas (esquemas, indicadores, tela)
agentes/<área>/    cada agente: server.js (1 linha) + CLAUDE.md + RELATORIO.md
data/              sua configuração e dados (fora do git, menos os exemplos)
```

## Licença

MIT. Veja [LICENSE](LICENSE).
