/* ===========================================================
   roster.js — quem trabalha aqui.
   BOSSES  : o dono (sempre em serviço, na Direção; opera o sistema da Direção)
   CATALOG : os agentes da AXIS Labs (times + A Legião) e vagas sugeridas
   =========================================================== */
const ROSTER = (() => {

  const KEY = 'escritorio-axis-v1';

  /* ===========================================================
     O DONO — o nome vem de data/config.json ("dono")
     =========================================================== */
  const BOSSES = [
    {
      id: 'boss-1', name: (window.ESCRITORIO && ESCRITORIO.dono) || 'Vitor', role: 'Dono · Direção',
      emoji: '⭐', boss: true, dept: 'diretoria', slotId: 'DIR-1',
      status: 'trabalhando', locked: true,
      source: 'Direção', sistema: 'diretoria',
      brief: 'Dono da AXIS Labs. Sempre em serviço. O computador dele abre o sistema da Direção.',
      look: {
        skin: '#d9a17a', hair: '#241709', style: 'curto',
        shirt: '#1f8f50', pants: '#1b1f1a', shoes: '#101210',
        glasses: null, beard: 'cavanhaque', tattoo: false, cap: false,
        uniforme: false
      }
    }
  ];

  /* ===========================================================
     BANCO DE TALENTOS
     'detectado' = tem sistema no registro (data/sistemas.json)
     'sugerido'  = vaga de ideia; contrate e depois ligue um sistema a ela
     =========================================================== */
  const CATALOG = [
    /* ---- os times de negócio ---- */
    {
      key: 'atendimento', name: 'Bia', role: 'Atendimento', emoji: '🎧', cat: 'detectado',
      system: 'Atendimento · Bia', sistema: 'atendimento',
      desc: 'Responde todo lead que chega e leva o interessado até a aula experimental.',
      why: 'Quem procura academia fala com várias. A primeira que responde sai na frente.',
      look: { skin: '#e2b48b', hair: '#4a3320', style: 'coque', shirt: '#2fbf12', pants: '#1b201b', glasses: null, beard: null }
    },
    {
      key: 'marketing', name: 'Mel', role: 'Marketing', emoji: '📣', cat: 'detectado',
      system: 'Marketing · Mel', sistema: 'marketing',
      desc: 'Conteúdo e tráfego que geram aula experimental, não só curtidas.',
      why: 'Verba no canal certo e CTA de aula em todo post trazem aluno de verdade.',
      look: { skin: '#e0a878', hair: '#7a3a12', style: 'longo', shirt: '#ff7a1a', pants: '#26221b', glasses: null, beard: null }
    },
    {
      key: 'comercial', name: 'Caio', role: 'Comercial', emoji: '🤝', cat: 'detectado',
      system: 'Comercial · Caio', sistema: 'comercial',
      desc: 'Transforma interesse em aula experimental, comparecimento e matrícula.',
      why: 'É onde a matrícula acontece: nenhuma aula marcada pode esfriar sem alguém ver.',
      look: { skin: '#c9854f', hair: '#1a120d', style: 'fade', shirt: '#ffc400', pants: '#23231a', glasses: null, beard: 'cavanhaque' }
    },
    {
      key: 'juridico', name: 'Théo', role: 'Jurídico', emoji: '⚖️', cat: 'detectado',
      system: 'Jurídico · Théo', sistema: 'juridico',
      desc: 'Contratos, termos de serviço e LGPD dos clientes e dos dados.',
      why: 'Dado de aluno exige responsável e cláusula de opt-out. Contrato vencido vira risco.',
      look: { skin: '#f0c29b', hair: '#3b2a1e', style: 'curto', shirt: '#6c7bff', pants: '#1b2030', glasses: 'retangular', beard: null }
    },
    {
      key: 'financeiro', name: 'Rui', role: 'Financeiro', emoji: '🧾', cat: 'detectado',
      system: 'Financeiro · Rui', sistema: 'financeiro',
      desc: 'Faturamento, repasses, caixa e custo de IA e ferramentas por cliente.',
      why: 'Mensalidade atrasada vira inadimplência. Caixa em dia mostra o que dá para investir.',
      look: { skin: '#c6936b', hair: '#111111', style: 'curto', shirt: '#19e39a', pants: '#17231d', glasses: 'redondo', beard: 'cheia' }
    },
    /* ---- A Legião · núcleo de IA ---- */
    {
      key: 'planejador', name: 'Átila', role: 'Planejador · A Legião', emoji: '🧭', cat: 'detectado',
      system: 'Planejamento · Átila', sistema: 'planejador',
      desc: 'Transforma pedidos vagos em planos passo a passo antes de executar.',
      why: 'Sem plano com dono e critério de pronto, o resto da Legião trabalha no escuro.',
      look: { skin: '#e0b48b', hair: '#241709', style: 'curto', shirt: '#b14bff', pants: '#17131f', glasses: 'retangular', beard: null, uniforme: true }
    },
    {
      key: 'pesquisador', name: 'Íris', role: 'Pesquisadora · A Legião', emoji: '🔎', cat: 'detectado',
      system: 'Pesquisa · Íris', sistema: 'pesquisador',
      desc: 'Pesquisa de mercado, concorrência e benchmarks para embasar decisões.',
      why: 'Preço, nicho e posicionamento precisam de dado, não de achismo.',
      look: { skin: '#f0c29b', hair: '#2a1a12', style: 'longo', shirt: '#c06bff', pants: '#17131f', glasses: 'redondo', beard: null, uniforme: true }
    },
    {
      key: 'implementador', name: 'Dino', role: 'Implementador · A Legião', emoji: '🛠️', cat: 'detectado',
      system: 'Implementação · Dino', sistema: 'implementador',
      desc: 'Constrói e mantém as automações e integrações da operação.',
      why: 'Automação de follow-up e FAQ é o que escala o atendimento sem contratar.',
      look: { skin: '#c9854f', hair: '#140f0c', style: 'fade', shirt: '#9b6bff', pants: '#17131f', glasses: null, beard: 'cavanhaque', uniforme: true }
    },
    {
      key: 'revisor', name: 'Quim', role: 'Revisor-QA · A Legião', emoji: '🧪', cat: 'detectado',
      system: 'Qualidade · Quim', sistema: 'revisor',
      desc: 'Garante qualidade: roda os checks e revisa antes de ir ao cliente.',
      why: 'Relatório ou criativo errado no cliente custa confiança. Alguém tem que ser o freio.',
      look: { skin: '#f7d7bd', hair: '#8b5a2b', style: 'curto', shirt: '#7b5bff', pants: '#17131f', glasses: 'redondo', beard: null, uniforme: true }
    },
    {
      key: 'seguranca', name: 'Max', role: 'Segurança · A Legião', emoji: '🛡️', cat: 'detectado',
      system: 'Segurança · Max', sistema: 'seguranca',
      desc: 'Protege dados, segredos e permissões; cuida da LGPD técnica.',
      why: 'Planilha de aluno exposta é problema de LGPD e de confiança do cliente.',
      look: { skin: '#e0b48b', hair: '#140f0c', style: 'curto', shirt: '#8a4bff', pants: '#17131f', glasses: 'retangular', beard: 'cheia', uniforme: true }
    },
    /* ---- demonstração e vagas ---- */
    {
      key: 'exemplo', name: 'EXEMPLO', role: 'Agente de demonstração', emoji: '🤖',
      cat: 'detectado', system: 'Agente de exemplo', sistema: 'exemplo',
      desc: 'Um sistema mínimo que vem junto, na pasta exemplo-agente: sobe na porta 4401 e mostra uma página.',
      why: 'Serve de molde. Clique no computador dele para ver o escritório ligar, embutir e conversar com um sistema. Depois cadastre os seus.',
      look: { skin: '#c9854f', hair: '#140f0c', style: 'cacheado', shirt: '#39ff14', pants: '#1b201b', glasses: null, beard: null }
    },
    {
      key: 'social', name: 'Nina', role: 'Social Media', emoji: '📱', cat: 'sugerido',
      desc: 'Planeja e agenda os posts das academias clientes e acompanha o que traz contato.',
      why: 'Constância nas redes custa tempo; um agente só para isso libera o Marketing para a estratégia.',
      look: { skin: '#e0a878', hair: '#5a3a22', style: 'longo', shirt: '#f472b6', pants: '#26222b', glasses: null, beard: null }
    }
  ];

  /* ===========================================================
     ESTADO
     =========================================================== */
  let team = [];

  function defaults() {
    const base = BOSSES.map(b => Object.assign({}, b, { look: Object.assign({}, b.look) }));
    // começa com os dez agentes da AXIS (times + A Legião) já contratados
    for (const k of ['atendimento', 'marketing', 'comercial', 'juridico', 'financeiro',
                     'planejador', 'pesquisador', 'implementador', 'revisor', 'seguranca']) {
      const c = CATALOG.find(c => c.key === k);
      base.push(fromCatalog(c));
    }
    return base;
  }

  function fromCatalog(c) {
    return {
      id: 'ag-' + c.key,
      key: c.key,
      name: c.name,
      role: c.role,
      emoji: c.emoji,
      system: c.system || null,
      sistema: c.sistema || null,
      path: c.path || null,
      brief: c.desc,
      dept: 'servico',
      slotId: null,
      status: 'trabalhando',
      boss: false,
      locked: false,
      look: AVATAR.makeLook(c.key, c.look)
    };
  }

  /* ===========================================================
     PERSISTÊNCIA — o disco (data/equipe.json) manda; o localStorage
     é só um espelho para quando o servidor estiver fora do ar.
     =========================================================== */
  const doLocal = () => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || 'null');
      return d && Array.isArray(d.team) && d.team.length ? d.team : null;
    } catch (e) { return null; }
  };

  async function load() {
    let vindoDoDisco = null;
    try {
      const d = await (await fetch('/api/equipe')).json();
      if (d && Array.isArray(d.team) && d.team.length) vindoDoDisco = d.team;
    } catch (e) { /* servidor fora: vale o que o navegador tiver */ }

    team = vindoDoDisco || doLocal() || defaults();
    recompor();
    if (!vindoDoDisco) save();
  }

  /** reencaixa campos que chegaram depois de a equipe já ter sido salva */
  function recompor() {
    for (const b of BOSSES) {
      if (!team.some(a => a.id === b.id)) team.push(Object.assign({}, b, { look: Object.assign({}, b.look) }));
    }
    for (const a of team) {
      const c = CATALOG.find(c => c.key === a.key);
      if (c) {
        if (!a.sistema && c.sistema) a.sistema = c.sistema;
        if (c.path && a.path !== c.path) a.path = c.path;
      }
      const b = BOSSES.find(b => b.id === a.id);
      if (b && !a.sistema && b.sistema) a.sistema = b.sistema;
      if (!a.look || !a.look.skin) {
        const base = (c && c.look) || (b && b.look) || {};
        a.look = AVATAR.makeLook(a.key || a.id, Object.assign({}, base));
      }
    }
  }

  let gravando = null;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ team, v: 1 })); }
    catch (e) { /* storage bloqueado: o disco ainda pega */ }
    clearTimeout(gravando);
    gravando = setTimeout(() => {
      fetch('/api/equipe', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, v: 1 })
      }).catch(() => { /* offline: fica o espelho do navegador */ });
    }, 300);
  }

  function reset() { team = defaults(); save(); }

  /* ---------- operações ---------- */
  function hire(key) {
    const c = CATALOG.find(c => c.key === key);
    if (!c || team.some(a => a.key === key)) return null;
    const a = fromCatalog(c);
    team.push(a); save();
    return a;
  }

  function hireCustom(data) {
    const key = 'custom-' + Date.now().toString(36);
    const a = {
      id: 'ag-' + key, key,
      name: data.name || 'Novo agente',
      role: data.role || 'Função a definir',
      emoji: data.emoji || '🤖',
      system: data.system || null, path: data.path || null,
      sistema: data.sistema || null, reuniao: data.reuniao !== false,
      brief: data.brief || '',
      dept: 'servico', slotId: null, status: 'trabalhando',
      boss: false, locked: false, custom: true,
      look: AVATAR.makeLook(key, data.look || {})
    };
    team.push(a); save();
    return a;
  }

  function fire(id) {
    const i = team.findIndex(a => a.id === id);
    if (i < 0 || team[i].locked) return false;
    team.splice(i, 1); save();
    return true;
  }

  const get = (id) => team.find(a => a.id === id);
  const all = () => team;
  const isHired = (key) => team.some(a => a.key === key);
  const count = (st) => team.filter(a => a.status === st).length;

  return { BOSSES, CATALOG, load, save, reset, hire, hireCustom, fire,
           get, all, isHired, count, fromCatalog };
})();
