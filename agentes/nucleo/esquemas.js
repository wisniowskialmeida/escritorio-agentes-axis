/* ===========================================================
   esquemas.js — o que cada agente da AXIS Labs guarda.

   Cada área é dona de um arquivo em agentes/dados/<area>.json e só ela
   escreve nele; as outras apenas leem. Assim vários processos rodam ao
   mesmo tempo sem um sobrescrever o trabalho do outro.

   Tipos de campo: texto, textolongo, numero, dinheiro, data (AAAA-MM-DD),
   datahora (AAAA-MM-DDTHH:MM), mes (AAAA-MM), sim (verdadeiro/falso),
   opcao (uma da lista) e ref (aponta para um item de outra coleção).
   `lista: true` faz o campo aparecer na tabela; os demais só no formulário.

   AXIS Labs: agência de marketing esportivo com IA. Nicho inicial:
   academias de jiu-jítsu. A base de tudo é o cliente (a academia).
   =========================================================== */

const CANAIS = ['Instagram', 'WhatsApp', 'Anúncio', 'Google', 'Indicação', 'Site'];

const AREAS = {
  diretoria: {
    nome: 'Direção', agente: 'Vitor', porta: 4416, cor: '#ffd23f', sala: 'Sala do Dono',
    missao: 'Juntar o que cada área vê e transformar em um plano de melhorias para a AXIS.'
  },
  atendimento: {
    nome: 'Atendimento', agente: 'Bia', porta: 4411, cor: '#39ff14', sala: 'Recepção',
    missao: 'Responder rápido todo interessado e levá-lo até a aula experimental.'
  },
  marketing: {
    nome: 'Marketing', agente: 'Mel', porta: 4413, cor: '#ff7a1a', sala: 'Marketing',
    missao: 'Conteúdo e tráfego que geram aula experimental, não só curtidas.'
  },
  conteudo: {
    nome: 'Conteúdo', agente: 'Nina', porta: 4422, cor: '#f472b6', sala: 'Marketing',
    missao: 'Manter as redes das academias clientes ativas toda semana, no formato que traz contato.'
  },
  comercial: {
    nome: 'Comercial', agente: 'Caio', porta: 4412, cor: '#ffc400', sala: 'Comercial',
    missao: 'Transformar interesse em aula experimental, comparecimento e matrícula.'
  },
  juridico: {
    nome: 'Jurídico', agente: 'Théo', porta: 4414, cor: '#6c7bff', sala: 'Jurídico',
    missao: 'Contratos, termos de serviço e LGPD dos clientes e dos dados.'
  },
  financeiro: {
    nome: 'Financeiro', agente: 'Rui', porta: 4415, cor: '#19e39a', sala: 'Financeiro',
    missao: 'Faturamento, repasses, caixa e custo de IA e ferramentas por cliente.'
  },
  planejador: {
    nome: 'Planejamento', agente: 'Átila', porta: 4417, cor: '#b14bff', sala: 'Núcleo de IA',
    missao: 'Transformar pedidos vagos em planos passo a passo antes de executar.'
  },
  pesquisador: {
    nome: 'Pesquisa', agente: 'Íris', porta: 4418, cor: '#c06bff', sala: 'Núcleo de IA',
    missao: 'Pesquisa de mercado, concorrência e benchmarks para embasar decisões.'
  },
  implementador: {
    nome: 'Implementação', agente: 'Dino', porta: 4419, cor: '#9b6bff', sala: 'Núcleo de IA',
    missao: 'Construir e manter as automações e integrações da operação.'
  },
  revisor: {
    nome: 'Qualidade', agente: 'Quim', porta: 4420, cor: '#7b5bff', sala: 'Núcleo de IA',
    missao: 'Garantir qualidade: rodar os checks e revisar antes de ir ao cliente.'
  },
  seguranca: {
    nome: 'Segurança', agente: 'Max', porta: 4421, cor: '#8a4bff', sala: 'Núcleo de IA',
    missao: 'Proteger dados, segredos e permissões; cuidar da LGPD técnica.'
  }
};

const NOMES_AREA = Object.values(AREAS).map(a => a.nome);

const COLECOES = {
  diretoria: {
    clientes: {
      titulo: 'Clientes (academias)', singular: 'cliente', rotulo: i => i.nome,
      ordem: (a, b) => Number(!!b.ativo) - Number(!!a.ativo) || String(a.nome).localeCompare(String(b.nome)),
      campos: [
        { k: 'nome', t: 'texto', r: 'Nome da academia', lista: true, obrigatorio: true },
        { k: 'modalidade', t: 'opcao', r: 'Modalidade', op: ['jiu-jítsu', 'crossfit', 'funcional', 'outra'], lista: true, padrao: 'jiu-jítsu' },
        { k: 'plano', t: 'opcao', r: 'Plano', op: ['piloto', 'essencial', 'crescimento'], lista: true, padrao: 'piloto' },
        { k: 'mensalidade', t: 'dinheiro', r: 'Mensalidade', lista: true },
        { k: 'inicio', t: 'data', r: 'Cliente desde' },
        { k: 'ativo', t: 'sim', r: 'Ativo', lista: true, padrao: true },
        { k: 'responsavel', t: 'texto', r: 'Contato na academia' }
      ]
    },
    melhorias: {
      titulo: 'Plano de melhorias', singular: 'melhoria', f: true,
      ordem: (a, b) => ['fazendo', 'ideia', 'feito'].indexOf(a.status) - ['fazendo', 'ideia', 'feito'].indexOf(b.status) ||
                       String(a.prazo || '9999').localeCompare(String(b.prazo || '9999')),
      campos: [
        { k: 'titulo', t: 'texto', r: 'Melhoria', lista: true, obrigatorio: true },
        { k: 'area', t: 'opcao', r: 'Área', op: NOMES_AREA, lista: true },
        { k: 'impacto', t: 'opcao', r: 'Impacto', op: ['alto', 'médio', 'baixo'], lista: true },
        { k: 'responsavel', t: 'texto', r: 'Responsável', lista: true },
        { k: 'prazo', t: 'data', r: 'Prazo', lista: true },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['ideia', 'fazendo', 'feito'], lista: true, padrao: 'ideia' },
        { k: 'origem', t: 'texto', r: 'De onde veio' }
      ]
    }
  },

  atendimento: {
    leads: {
      titulo: 'Leads', singular: 'lead', rotulo: i => i.nome,
      ordem: (a, b) => String(b.chegou || '').localeCompare(String(a.chegou || '')),
      campos: [
        { k: 'nome', t: 'texto', r: 'Nome', lista: true, obrigatorio: true },
        { k: 'telefone', t: 'texto', r: 'Telefone' },
        { k: 'canal', t: 'opcao', r: 'Canal', op: CANAIS, lista: true },
        { k: 'cliente', t: 'ref', r: 'Academia', ref: 'clientes', lista: true },
        { k: 'chegou', t: 'datahora', r: 'Chegou em', lista: true },
        { k: 'respondido', t: 'datahora', r: 'Respondido em', lista: true },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['novo', 'em atendimento', 'aula agendada', 'descartado'], lista: true, padrao: 'novo' },
        { k: 'obs', t: 'texto', r: 'Observações' }
      ]
    }
  },

  marketing: {
    campanhas: {
      titulo: 'Campanhas', singular: 'campanha', f: true,
      ordem: (a, b) => String(b.mes || '').localeCompare(String(a.mes || '')),
      campos: [
        { k: 'nome', t: 'texto', r: 'Campanha', lista: true, obrigatorio: true },
        { k: 'cliente', t: 'ref', r: 'Academia', ref: 'clientes', lista: true },
        { k: 'formato', t: 'opcao', r: 'Formato', op: ['reels', 'carrossel', 'story', 'tráfego', 'vídeo'], lista: true, padrao: 'reels' },
        { k: 'canal', t: 'opcao', r: 'Canal', op: CANAIS, lista: true },
        { k: 'leads', t: 'numero', r: 'Leads gerados', lista: true },
        { k: 'investimento', t: 'dinheiro', r: 'Investimento', lista: true },
        { k: 'mes', t: 'mes', r: 'Mês', lista: true },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['ativa', 'pausada', 'encerrada'], lista: true, padrao: 'ativa' }
      ]
    }
  },

  conteudo: {
    posts: {
      titulo: 'Calendário de posts', singular: 'post',
      ordem: (a, b) => String(b.data || '').localeCompare(String(a.data || '')),
      campos: [
        { k: 'data', t: 'data', r: 'Data', lista: true, obrigatorio: true },
        { k: 'cliente', t: 'ref', r: 'Academia', ref: 'clientes', lista: true },
        { k: 'rede', t: 'opcao', r: 'Rede', op: ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'WhatsApp'], lista: true, padrao: 'Instagram' },
        { k: 'formato', t: 'opcao', r: 'Formato', op: ['reels', 'carrossel', 'story', 'foto', 'vídeo longo'], lista: true, padrao: 'reels' },
        { k: 'tema', t: 'texto', r: 'Tema ou legenda curta', lista: true },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['ideia', 'produzindo', 'agendado', 'publicado'], lista: true, padrao: 'ideia' },
        { k: 'alcance', t: 'numero', r: 'Alcance' },
        { k: 'contatos', t: 'numero', r: 'Contatos gerados', lista: true }
      ]
    }
  },

  comercial: {
    experimentais: {
      titulo: 'Aulas experimentais', singular: 'aula', f: true,
      ordem: (a, b) => String(b.data || '').localeCompare(String(a.data || '')),
      campos: [
        { k: 'lead', t: 'ref', r: 'Interessado', ref: 'leads', lista: true, obrigatorio: true },
        { k: 'cliente', t: 'ref', r: 'Academia', ref: 'clientes', lista: true },
        { k: 'data', t: 'datahora', r: 'Data da aula', lista: true },
        { k: 'compareceu', t: 'sim', r: 'Compareceu', lista: true },
        { k: 'matriculou', t: 'sim', r: 'Matriculou', lista: true },
        { k: 'valorPlano', t: 'dinheiro', r: 'Plano fechado (mensal)' },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['agendada', 'compareceu', 'faltou', 'matriculou', 'perdido'], lista: true, padrao: 'agendada' },
        { k: 'obs', t: 'texto', r: 'Observações' }
      ]
    },
    metas: {
      titulo: 'Metas do mês', singular: 'meta', f: true,
      ordem: (a, b) => String(b.mes || '').localeCompare(String(a.mes || '')),
      campos: [
        { k: 'mes', t: 'mes', r: 'Mês', lista: true, obrigatorio: true },
        { k: 'experimentais', t: 'numero', r: 'Aulas experimentais', lista: true },
        { k: 'matriculas', t: 'numero', r: 'Matrículas', lista: true }
      ]
    }
  },

  juridico: {
    contratos: {
      titulo: 'Contratos', singular: 'contrato',
      ordem: (a, b) => String(a.prazo || '9999').localeCompare(String(b.prazo || '9999')),
      campos: [
        { k: 'cliente', t: 'ref', r: 'Academia', ref: 'clientes', lista: true, obrigatorio: true },
        { k: 'tipo', t: 'opcao', r: 'Tipo', op: ['piloto 90 dias', 'mensal'], lista: true, padrao: 'piloto 90 dias' },
        { k: 'assinadoEm', t: 'data', r: 'Assinado em', lista: true },
        { k: 'responsavelDados', t: 'sim', r: 'Responsável por dados definido (LGPD)', lista: true },
        { k: 'optout', t: 'sim', r: 'Cláusula de opt-out de mensagens' },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['rascunho', 'assinado', 'vencido'], lista: true, padrao: 'rascunho' },
        { k: 'prazo', t: 'data', r: 'Próxima revisão', lista: true },
        { k: 'obs', t: 'texto', r: 'Observações' }
      ]
    }
  },

  financeiro: {
    faturas: {
      titulo: 'Faturas', singular: 'fatura', f: true,
      ordem: (a, b) => String(a.vencimento || '9999').localeCompare(String(b.vencimento || '9999')),
      campos: [
        { k: 'cliente', t: 'ref', r: 'Academia', ref: 'clientes', lista: true, obrigatorio: true },
        { k: 'tipo', t: 'opcao', r: 'Tipo', op: ['setup', 'mensalidade'], lista: true, padrao: 'mensalidade' },
        { k: 'valor', t: 'dinheiro', r: 'Valor', lista: true },
        { k: 'vencimento', t: 'data', r: 'Vencimento', lista: true },
        { k: 'pago', t: 'sim', r: 'Pago', lista: true },
        { k: 'pagoEm', t: 'data', r: 'Pago em' }
      ]
    },
    custos: {
      titulo: 'Custos', singular: 'custo',
      ordem: (a, b) => String(b.mes || '').localeCompare(String(a.mes || '')),
      campos: [
        { k: 'mes', t: 'mes', r: 'Mês', lista: true, obrigatorio: true },
        { k: 'categoria', t: 'opcao', r: 'Categoria', op: ['ferramentas', 'anúncios', 'IA', 'contador', 'outros'], lista: true },
        { k: 'descricao', t: 'texto', r: 'Descrição', lista: true },
        { k: 'valor', t: 'dinheiro', r: 'Valor', lista: true }
      ]
    }
  },

  planejador: {
    planos: {
      titulo: 'Planos', singular: 'plano',
      ordem: (a, b) => ['em execução', 'planejando', 'backlog', 'concluído'].indexOf(a.status) - ['em execução', 'planejando', 'backlog', 'concluído'].indexOf(b.status),
      campos: [
        { k: 'titulo', t: 'texto', r: 'Plano', lista: true, obrigatorio: true },
        { k: 'area', t: 'opcao', r: 'Área', op: NOMES_AREA, lista: true },
        { k: 'passos', t: 'numero', r: 'Passos', lista: true },
        { k: 'dono', t: 'texto', r: 'Dono', lista: true },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['backlog', 'planejando', 'em execução', 'concluído'], lista: true, padrao: 'backlog' },
        { k: 'leadTimeDias', t: 'numero', r: 'Lead time (dias)' }
      ]
    }
  },

  pesquisador: {
    pesquisas: {
      titulo: 'Pesquisas', singular: 'pesquisa', f: true,
      ordem: (a, b) => String(b.coletadoEm || '').localeCompare(String(a.coletadoEm || '')),
      campos: [
        { k: 'tema', t: 'texto', r: 'Tema', lista: true, obrigatorio: true },
        { k: 'fonte', t: 'texto', r: 'Fonte', lista: true },
        { k: 'coletadoEm', t: 'data', r: 'Coletado em', lista: true },
        { k: 'confianca', t: 'opcao', r: 'Confiança', op: ['alta', 'média', 'baixa'], lista: true, padrao: 'média' },
        { k: 'uso', t: 'texto', r: 'Para que serve', lista: true },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['a fazer', 'em andamento', 'concluída'], lista: true, padrao: 'a fazer' }
      ]
    }
  },

  implementador: {
    automacoes: {
      titulo: 'Automações', singular: 'automação', f: true,
      ordem: (a, b) => ['falhou', 'em desenvolvimento', 'ok'].indexOf(a.status) - ['falhou', 'em desenvolvimento', 'ok'].indexOf(b.status),
      campos: [
        { k: 'nome', t: 'texto', r: 'Automação', lista: true, obrigatorio: true },
        { k: 'gatilho', t: 'texto', r: 'Gatilho', lista: true },
        { k: 'ultimaExecucao', t: 'datahora', r: 'Última execução', lista: true },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['ok', 'falhou', 'em desenvolvimento'], lista: true, padrao: 'ok' },
        { k: 'dono', t: 'texto', r: 'Dono' }
      ]
    }
  },

  revisor: {
    revisoes: {
      titulo: 'Revisões', singular: 'revisão', f: true,
      ordem: (a, b) => String(b.data || '').localeCompare(String(a.data || '')),
      campos: [
        { k: 'item', t: 'texto', r: 'Item revisado', lista: true, obrigatorio: true },
        { k: 'area', t: 'opcao', r: 'Área', op: NOMES_AREA, lista: true },
        { k: 'resultado', t: 'opcao', r: 'Resultado', op: ['aprovado', 'ajustar', 'revisar'], lista: true, padrao: 'revisar' },
        { k: 'erros', t: 'numero', r: 'Erros encontrados', lista: true },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['pendente', 'ok', 'voltou'], lista: true, padrao: 'pendente' },
        { k: 'data', t: 'data', r: 'Data', lista: true }
      ]
    }
  },

  seguranca: {
    riscos: {
      titulo: 'Riscos', singular: 'risco',
      ordem: (a, b) => ['alta', 'média', 'baixa'].indexOf(a.severidade) - ['alta', 'média', 'baixa'].indexOf(b.severidade),
      campos: [
        { k: 'risco', t: 'texto', r: 'Risco', lista: true, obrigatorio: true },
        { k: 'severidade', t: 'opcao', r: 'Severidade', op: ['alta', 'média', 'baixa'], lista: true, padrao: 'média' },
        { k: 'area', t: 'opcao', r: 'Área', op: NOMES_AREA, lista: true },
        { k: 'status', t: 'opcao', r: 'Situação', op: ['aberto', 'em tratamento', 'resolvido'], lista: true, padrao: 'aberto' },
        { k: 'acao', t: 'texto', r: 'Ação', lista: true }
      ]
    }
  }
};

/** em que área mora cada coleção (para resolver as referências) */
const DONO = {};
for (const [area, cols] of Object.entries(COLECOES)) for (const c of Object.keys(cols)) DONO[c] = area;

const vazio = area => Object.fromEntries(Object.keys(COLECOES[area]).map(c => [c, []]));

module.exports = { AREAS, COLECOES, CANAIS, DONO, vazio };
