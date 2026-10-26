/* ===========================================================
   indicadores.js — os números de cada área e o que melhorar.

   calcular(d) recebe tudo (dados.tudo()) e devolve, por área:
     kpis       os números que a área acompanha, com tom bom/atencao/ruim
     melhorias  o que fazer agora, por prioridade (alta, media, baixa),
                cada uma com o fato (texto) e a ação sugerida (acao)
     tabelas    resumos pequenos (funil, canais, custos...)
   A Direção junta tudo e soma o próprio plano de melhorias.

   AXIS Labs — marketing esportivo + IA. Nicho: academias de jiu-jítsu.
   =========================================================== */
const { AREAS } = require('./esquemas');

const MS_DIA = 86400000;

const pad = n => String(n).padStart(2, '0');
const quando = s => !s ? null : new Date(s.length === 7 ? s + '-01T00:00' : s.length === 10 ? s + 'T00:00' : s);
const mesDe = s => s ? String(s).slice(0, 7) : null;
const soma = (l, f) => l.reduce((t, x) => t + (Number(f(x)) || 0), 0);
const media = l => l.length ? l.reduce((a, b) => a + b, 0) / l.length : null;
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
const brl = v => (v < 0 ? '−' : '') + 'R$ ' + Math.round(Math.abs(v)).toLocaleString('pt-BR');
const brlCurto = v => {
  const a = Math.abs(v), s = v < 0 ? '−' : '';
  if (a >= 1e6) return `${s}R$ ${(a / 1e6).toFixed(2).replace('.', ',')} mi`;
  if (a >= 1e4) return `${s}R$ ${Math.round(a / 1e3)} mil`;
  return brl(v);
};
const duracao = min => min < 60 ? `${Math.round(min)} min`
  : min < 1440 ? `${(min / 60).toFixed(1).replace('.', ',')} h` : `${Math.round(min / 1440)} dias`;
const lista = (nomes, max = 3) => nomes.slice(0, max).join(', ') + (nomes.length > max ? ` e mais ${nomes.length - max}` : '');
const ORDEM = { alta: 0, media: 1, baixa: 2 };

function calcular(d, agora = new Date()) {
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const mesAtual = `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}`;
  const diasDesde = s => s ? Math.floor((hoje - quando(s)) / MS_DIA) : null;
  const porId = col => Object.fromEntries((d[col] || []).map(x => [x.id, x]));

  const leadsById = porId('leads');
  const clientesById = porId('clientes');
  const nomeLead = id => (leadsById[id] && leadsById[id].nome) || 'interessado';
  const nomeCliente = id => (clientesById[id] && clientesById[id].nome) || 'academia';

  /* ---------------- Atendimento ---------------- */
  const atendimento = (() => {
    const ls = d.leads || [];
    const recentes = ls.filter(l => l.chegou && (agora - quando(l.chegou)) <= 30 * MS_DIA);
    const mesLeads = ls.filter(l => mesDe(l.chegou) === mesAtual);
    const tempo = l => (quando(l.respondido) - quando(l.chegou)) / 60000;
    const tempos = recentes.filter(l => l.respondido).map(tempo).filter(t => t >= 0);
    const tMedio = media(tempos);
    const em1h = pct(tempos.filter(t => t <= 60).length, tempos.length);
    const esperando = ls.filter(l => !l.respondido && l.status !== 'descartado');
    const atrasados = esperando.filter(l => l.chegou && (agora - quando(l.chegou)) > 12 * 3600000);
    const semCanal = recentes.filter(l => !l.canal);
    const descartados = recentes.filter(l => l.status === 'descartado').length;

    const melhorias = [];
    if (atrasados.length) melhorias.push({ nivel: 'alta',
      texto: `${plural(atrasados.length, 'lead esperando', 'leads esperando')} resposta há mais de 12 horas: ${lista(atrasados.map(l => l.nome))}.`,
      acao: 'Responder agora e marcar a aula experimental. Quem procura academia fala com várias; a primeira que responde sai na frente.' });
    if (tMedio !== null && tMedio > 10) melhorias.push({ nivel: tMedio > 60 ? 'alta' : 'media',
      texto: `O tempo médio de 1ª resposta está em ${duracao(tMedio)} (meta 10 min).`,
      acao: 'Deixe respostas prontas e aprovadas para as perguntas mais comuns, e um plantão para os contatos da noite.' });
    if (semCanal.length >= 3) melhorias.push({ nivel: 'baixa',
      texto: `${plural(semCanal.length, 'lead recente está', 'leads recentes estão')} sem canal de origem.`,
      acao: 'Marcar a origem de cada lead para o time de Dados medir qual campanha traz aluno.' });
    if (recentes.length >= 5 && pct(descartados, recentes.length) >= 25) melhorias.push({ nivel: 'baixa',
      texto: `${pct(descartados, recentes.length)}% dos leads dos últimos 30 dias foram descartados.`,
      acao: 'Ver com o Marketing de quais canais vêm os descartes e ajustar o público dos anúncios.' });

    const canais = [...new Set(recentes.map(l => l.canal).filter(Boolean))];
    return {
      kpis: [
        { rotulo: 'Leads no mês', valor: mesLeads.length, detalhe: `${recentes.length} nos últimos 30 dias` },
        { rotulo: '1ª resposta (média)', valor: tMedio === null ? '—' : duracao(tMedio), detalhe: 'meta 10 min',
          tom: tMedio === null ? null : tMedio <= 10 ? 'bom' : tMedio <= 60 ? 'atencao' : 'ruim' },
        { rotulo: 'Respondidos em até 1 h', valor: tempos.length ? em1h + '%' : '—', detalhe: 'últimos 30 dias',
          tom: !tempos.length ? null : em1h >= 80 ? 'bom' : em1h >= 50 ? 'atencao' : 'ruim' },
        { rotulo: 'Esperando resposta', valor: esperando.length, detalhe: atrasados.length ? `${atrasados.length} há mais de 12 h` : 'nenhum atrasado',
          tom: atrasados.length ? 'ruim' : esperando.length ? 'atencao' : 'bom' }
      ],
      melhorias,
      tabelas: [{
        titulo: 'Leads por canal · últimos 30 dias', colunas: ['Canal', 'Leads', 'Resposta média'],
        linhas: canais.map(k => {
          const dc = recentes.filter(l => l.canal === k);
          const t = media(dc.filter(l => l.respondido).map(tempo));
          return [k, dc.length, t === null ? '—' : duracao(t)];
        }).sort((a, b) => b[1] - a[1])
      }]
    };
  })();

  /* ---------------- Comercial ---------------- */
  const comercial = (() => {
    const ex = d.experimentais || [];
    const noMes = ex.filter(e => mesDe(e.data) === mesAtual);
    const passadas = ex.filter(e => e.data && quando(e.data) <= agora);
    const compareceram = passadas.filter(e => e.compareceu);
    const matriculasMes = ex.filter(e => e.matriculou && mesDe(e.data) === mesAtual);
    const taxaComp = pct(compareceram.length, passadas.length);
    const taxaMat = pct(compareceram.filter(e => e.matriculou).length, compareceram.length);
    const meta = (d.metas || []).find(m => m.mes === mesAtual);
    const proximas = ex.filter(e => e.status === 'agendada' && e.data && quando(e.data) > agora && (quando(e.data) - agora) <= 2 * MS_DIA);
    const faltaram = ex.filter(e => e.status === 'faltou');

    const melhorias = [];
    if (proximas.length) melhorias.push({ nivel: 'alta',
      texto: `${plural(proximas.length, 'aula experimental marcada', 'aulas experimentais marcadas')} para os próximos 2 dias: ${lista(proximas.map(e => nomeLead(e.lead)))}.`,
      acao: 'Enviar lembrete hoje e pedir confirmação. Lembrete 2h antes, com endereço e o que levar, reduz a falta.' });
    if (faltaram.length) melhorias.push({ nivel: 'media',
      texto: `${plural(faltaram.length, 'pessoa faltou', 'pessoas faltaram')} à aula e ainda não foi remarcada: ${lista(faltaram.map(e => nomeLead(e.lead)))}.`,
      acao: 'Mandar mensagem de remarcação. Quem faltou uma vez costuma voltar se for convidado de novo.' });
    if (passadas.length >= 4 && taxaComp < 75) melhorias.push({ nivel: 'media',
      texto: `O comparecimento às aulas está em ${taxaComp}% (meta 75%).`,
      acao: 'Automatizar o lembrete 2h antes com localização e o que levar.' });
    if (!meta) melhorias.push({ nivel: 'media', texto: 'Não há meta cadastrada para este mês.',
      acao: 'Cadastrar em Metas do mês quantas aulas experimentais e matrículas você quer.' });
    else if (meta.experimentais && noMes.length < meta.experimentais * 0.6) melhorias.push({ nivel: 'media',
      texto: `${noMes.length} de ${meta.experimentais} aulas experimentais no mês.`,
      acao: 'Pedir ao Marketing mais leads e ao Atendimento agendar mais rápido.' });

    return {
      kpis: [
        { rotulo: 'Aulas experimentais', valor: meta && meta.experimentais ? `${noMes.length} de ${meta.experimentais}` : noMes.length, detalhe: 'no mês',
          tom: meta && meta.experimentais ? (noMes.length >= meta.experimentais ? 'bom' : noMes.length >= meta.experimentais * 0.6 ? 'atencao' : 'ruim') : null },
        { rotulo: 'Comparecimento', valor: passadas.length ? taxaComp + '%' : '—', detalhe: 'meta 75%',
          tom: !passadas.length ? null : taxaComp >= 75 ? 'bom' : taxaComp >= 60 ? 'atencao' : 'ruim' },
        { rotulo: 'Matrículas', valor: meta && meta.matriculas ? `${matriculasMes.length} de ${meta.matriculas}` : matriculasMes.length, detalhe: 'no mês',
          tom: meta && meta.matriculas ? (matriculasMes.length >= meta.matriculas ? 'bom' : 'atencao') : null },
        { rotulo: 'Conversão em matrícula', valor: compareceram.length ? taxaMat + '%' : '—', detalhe: 'matrículas ÷ comparecimentos' }
      ],
      melhorias,
      tabelas: [{ titulo: 'Funil do mês', colunas: ['Etapa', 'Qtd'],
        linhas: [['Aulas marcadas', noMes.length], ['Compareceram', noMes.filter(e => e.compareceu).length], ['Matricularam', matriculasMes.length]] }]
    };
  })();

  /* ---------------- Marketing ---------------- */
  const marketing = (() => {
    const cs = d.campanhas || [];
    const mesCamp = cs.filter(c => c.mes === mesAtual);
    const leadsMes = soma(mesCamp, c => c.leads);
    const investMes = soma(mesCamp, c => c.investimento);
    const cpl = leadsMes ? investMes / leadsMes : null;
    const ativas = cs.filter(c => c.status === 'ativa');
    const pausadasComLead = cs.filter(c => c.status === 'pausada' && (c.leads || 0) > 0);
    const ativosClientes = (d.clientes || []).filter(c => c.ativo);
    const semCampanhaMes = ativosClientes.filter(cl => !mesCamp.some(c => c.cliente === cl.id));
    const semCanal = cs.filter(c => !c.canal);

    const melhorias = [];
    if (pausadasComLead.length) melhorias.push({ nivel: 'alta',
      texto: `${plural(pausadasComLead.length, 'campanha que trazia lead está pausada', 'campanhas que traziam leads estão pausadas')}: ${lista(pausadasComLead.map(c => c.nome))}.`,
      acao: 'Reativar ou subir novos criativos. Campanha que convertia parada é lead deixado na mesa.' });
    if (semCampanhaMes.length) melhorias.push({ nivel: 'media',
      texto: `${plural(semCampanhaMes.length, 'academia cliente está', 'academias clientes estão')} sem campanha neste mês: ${lista(semCampanhaMes.map(c => c.nome))}.`,
      acao: 'Produzir ao menos um conteúdo de captação por cliente no mês.' });
    if (cpl !== null && cpl > 12) melhorias.push({ nivel: 'media',
      texto: `O custo por lead do mês está em ${brl(cpl)}.`,
      acao: 'Pausar os criativos mais caros e concentrar verba nos que trazem aula experimental.' });
    if (semCanal.length >= 3) melhorias.push({ nivel: 'baixa',
      texto: `${semCanal.length} campanhas sem canal informado.`,
      acao: 'Preencher o canal para comparar o custo por lead entre Instagram, anúncio e Google.' });

    return {
      kpis: [
        { rotulo: 'Leads no mês', valor: leadsMes, detalhe: `${mesCamp.length} campanhas` },
        { rotulo: 'Investimento no mês', valor: brlCurto(investMes), detalhe: 'em mídia' },
        { rotulo: 'Custo por lead', valor: cpl === null ? '—' : brl(cpl), detalhe: 'investimento ÷ leads',
          tom: cpl === null ? null : cpl <= 8 ? 'bom' : cpl <= 12 ? 'atencao' : 'ruim' },
        { rotulo: 'Campanhas ativas', valor: ativas.length, detalhe: pausadasComLead.length ? `${pausadasComLead.length} pausadas que convertiam` : 'todas no ar',
          tom: pausadasComLead.length ? 'atencao' : 'bom' }
      ],
      melhorias,
      tabelas: [{ titulo: 'Campanhas do mês', colunas: ['Campanha', 'Leads', 'Investimento', 'CPL'],
        linhas: mesCamp.map(c => [c.nome, c.leads || 0, brlCurto(c.investimento || 0), c.leads ? brl((c.investimento || 0) / c.leads) : '—']).sort((a, b) => b[1] - a[1]) }]
    };
  })();

  /* ---------------- Jurídico ---------------- */
  const juridico = (() => {
    const ct = d.contratos || [];
    const assinados = ct.filter(c => c.status === 'assinado');
    const vencidos = ct.filter(c => c.status === 'vencido' || (c.prazo && diasDesde(c.prazo) > 0 && c.status !== 'rascunho'));
    const semResp = assinados.filter(c => !c.responsavelDados);
    const semOptout = assinados.filter(c => !c.optout);
    const rascunhos = ct.filter(c => c.status === 'rascunho');

    const melhorias = [];
    if (semResp.length) melhorias.push({ nivel: 'alta',
      texto: `${plural(semResp.length, 'contrato assinado está', 'contratos assinados estão')} sem responsável por dados definido (LGPD): ${lista(semResp.map(c => nomeCliente(c.cliente)))}.`,
      acao: 'Definir controlador e operador por contrato e registrar quem responde pelos dados do aluno.' });
    if (vencidos.length) melhorias.push({ nivel: 'alta',
      texto: `${plural(vencidos.length, 'contrato está vencido ou sem revisão', 'contratos estão vencidos ou sem revisão')}: ${lista(vencidos.map(c => nomeCliente(c.cliente)))}.`,
      acao: 'Renovar ou revisar antes de seguir prestando o serviço.' });
    if (semOptout.length) melhorias.push({ nivel: 'media',
      texto: `${plural(semOptout.length, 'contrato assinado não tem', 'contratos assinados não têm')} cláusula de opt-out de mensagens.`,
      acao: 'Incluir a cláusula e o aviso de descadastro, exigidos para as sequências de follow-up.' });
    if (rascunhos.length) melhorias.push({ nivel: 'baixa',
      texto: `${plural(rascunhos.length, 'contrato em rascunho', 'contratos em rascunho')} aguardando assinatura.`,
      acao: 'Fechar com assinatura eletrônica para destravar o início do serviço.' });

    return {
      kpis: [
        { rotulo: 'Contratos assinados', valor: assinados.length, detalhe: `${ct.length} no total` },
        { rotulo: 'Pendências LGPD', valor: semResp.length, detalhe: 'sem responsável por dados', tom: semResp.length ? 'ruim' : 'bom' },
        { rotulo: 'Vencidos / a revisar', valor: vencidos.length, detalhe: vencidos.length ? 'tratar já' : 'em dia', tom: vencidos.length ? 'ruim' : 'bom' },
        { rotulo: 'Rascunhos', valor: rascunhos.length, detalhe: 'aguardando assinatura', tom: rascunhos.length ? 'atencao' : 'bom' }
      ],
      melhorias, tabelas: []
    };
  })();

  /* ---------------- Financeiro ---------------- */
  const financeiro = (() => {
    const fat = d.faturas || [];
    const mensalMes = fat.filter(f => f.tipo === 'mensalidade' && mesDe(f.vencimento) === mesAtual);
    const faturadoMes = soma(mensalMes, f => f.valor);
    const aReceber = fat.filter(f => !f.pago);
    const atrasadas = aReceber.filter(f => f.vencimento && diasDesde(f.vencimento) > 0);
    const valAtraso = soma(atrasadas, f => f.valor);
    const custos = d.custos || [];
    const custoMes = soma(custos.filter(c => c.mes === mesAtual), c => c.valor);

    const melhorias = [];
    if (atrasadas.length) melhorias.push({ nivel: 'alta',
      texto: `${plural(atrasadas.length, 'fatura atrasada', 'faturas atrasadas')} (${brl(valAtraso)}): ${lista(atrasadas.map(f => nomeCliente(f.cliente)))}.`,
      acao: 'Enviar cobrança amigável e combinar nova data. Mensalidade atrasada vira inadimplência rápido.' });
    const semVenc = aReceber.filter(f => !f.vencimento);
    if (semVenc.length) melhorias.push({ nivel: 'media',
      texto: `${plural(semVenc.length, 'fatura em aberto está', 'faturas em aberto estão')} sem data de vencimento.`,
      acao: 'Definir o vencimento para acompanhar o caixa.' });
    if (mensalMes.length && !custos.some(c => c.categoria === 'anúncios')) melhorias.push({ nivel: 'baixa',
      texto: 'A verba de anúncios não aparece separada nos custos.',
      acao: 'Separar a verba de mídia do honorário da AXIS, como combinado no contrato.' });
    if (!custos.some(c => c.categoria === 'IA')) melhorias.push({ nivel: 'baixa',
      texto: 'O custo de IA por cliente não está sendo registrado.',
      acao: 'Lançar o consumo mensal de IA para saber a margem real por conta.' });

    const porCat = custos.filter(c => c.mes === mesAtual).reduce((o, c) => { const k = c.categoria || 'outros'; o[k] = (o[k] || 0) + (c.valor || 0); return o; }, {});
    return {
      kpis: [
        { rotulo: 'Faturamento do mês', valor: brlCurto(faturadoMes), detalhe: `${mensalMes.length} mensalidades` },
        { rotulo: 'A receber', valor: brlCurto(soma(aReceber, f => f.valor)), detalhe: `${aReceber.length} faturas em aberto` },
        { rotulo: 'Inadimplência', valor: brlCurto(valAtraso), detalhe: atrasadas.length ? `${atrasadas.length} atrasadas` : 'nenhuma', tom: valAtraso > 0 ? 'ruim' : 'bom' },
        { rotulo: 'Custos do mês', valor: brlCurto(custoMes), detalhe: 'ferramentas, mídia, IA' }
      ],
      melhorias,
      tabelas: [{ titulo: 'Custos do mês por categoria', colunas: ['Categoria', 'Valor'], linhas: Object.entries(porCat).map(([k, v]) => [k, brl(v)]) }]
    };
  })();

  /* ---------------- Planejamento (A Legião) ---------------- */
  const planejador = (() => {
    const ps = d.planos || [];
    const abertos = ps.filter(p => p.status !== 'concluído');
    const emExec = ps.filter(p => p.status === 'em execução');
    const backlog = ps.filter(p => p.status === 'backlog');
    const semDono = abertos.filter(p => !p.dono);
    const lt = media(ps.filter(p => p.leadTimeDias).map(p => p.leadTimeDias));

    const melhorias = [];
    if (backlog.length >= 5) melhorias.push({ nivel: 'media',
      texto: `${backlog.length} planos no backlog sem priorização.`,
      acao: 'Classificar por impacto × esforço e puxar só os 2 ou 3 de maior retorno.' });
    if (semDono.length) melhorias.push({ nivel: 'media',
      texto: `${plural(semDono.length, 'plano aberto está', 'planos abertos estão')} sem dono.`,
      acao: 'Definir um responsável por plano; sem dono, nada anda.' });
    if (!ps.some(p => /onboarding/i.test(p.titulo))) melhorias.push({ nivel: 'baixa',
      texto: 'Não há um plano de onboarding padrão de cliente.',
      acao: 'Desenhar o fluxo de onboarding em 6 passos para repetir em cada academia nova.' });

    return {
      kpis: [
        { rotulo: 'Planos abertos', valor: abertos.length, detalhe: `${ps.length} no total` },
        { rotulo: 'Em execução', valor: emExec.length, detalhe: 'andando agora' },
        { rotulo: 'No backlog', valor: backlog.length, detalhe: 'esperando', tom: backlog.length >= 5 ? 'atencao' : null },
        { rotulo: 'Lead time médio', valor: lt === null ? '—' : `${lt.toFixed(1).replace('.', ',')} dias`, detalhe: 'do pedido ao pronto' }
      ],
      melhorias, tabelas: []
    };
  })();

  /* ---------------- Pesquisa (A Legião) ---------------- */
  const pesquisador = (() => {
    const qs = d.pesquisas || [];
    const andamento = qs.filter(q => q.status === 'em andamento');
    const concluidas = qs.filter(q => q.status === 'concluída');
    const aFazer = qs.filter(q => q.status === 'a fazer');
    const altaConf = pct(qs.filter(q => q.confianca === 'alta').length, qs.length);
    const baixaConf = qs.filter(q => q.confianca === 'baixa' && q.status === 'concluída');
    const semFonte = qs.filter(q => !q.fonte);

    const melhorias = [];
    const preco = qs.find(q => /pre[çc]o|ticket/i.test(`${q.tema} ${q.uso || ''}`) && q.status !== 'concluída');
    if (preco) melhorias.push({ nivel: 'alta',
      texto: `A pesquisa "${preco.tema}" ainda não foi concluída.`,
      acao: 'Validar a faixa de preço do nicho antes de fechar a tabela da oferta — é uma decisão pendente do plano.' });
    else if (aFazer.length) melhorias.push({ nivel: 'media',
      texto: `${plural(aFazer.length, 'pesquisa na fila', 'pesquisas na fila')} ainda não começou.`,
      acao: 'Começar pela que destrava uma decisão de negócio (preço, nicho, concorrência).' });
    if (baixaConf.length) melhorias.push({ nivel: 'media',
      texto: `${plural(baixaConf.length, 'pesquisa concluída tem', 'pesquisas concluídas têm')} confiança baixa.`,
      acao: 'Revalidar com uma segunda fonte antes de usar numa decisão.' });
    if (semFonte.length >= 2) melhorias.push({ nivel: 'baixa',
      texto: `${semFonte.length} pesquisas sem fonte registrada.`,
      acao: 'Registrar a fonte e a data de coleta de cada dado para revisão futura.' });

    return {
      kpis: [
        { rotulo: 'Pesquisas', valor: qs.length, detalhe: `${concluidas.length} concluídas` },
        { rotulo: 'Em andamento', valor: andamento.length, detalhe: 'sendo feitas' },
        { rotulo: 'Na fila', valor: aFazer.length, detalhe: 'a fazer', tom: aFazer.length ? 'atencao' : null },
        { rotulo: 'Confiança alta', valor: qs.length ? altaConf + '%' : '—', detalhe: 'das pesquisas' }
      ],
      melhorias, tabelas: []
    };
  })();

  /* ---------------- Implementação (A Legião) ---------------- */
  const implementador = (() => {
    const au = d.automacoes || [];
    const ativas = au.filter(a => a.status === 'ok');
    const falhas = au.filter(a => a.status === 'falhou');
    const emDev = au.filter(a => a.status === 'em desenvolvimento');
    const semDono = au.filter(a => !a.dono);

    const melhorias = [];
    if (falhas.length) melhorias.push({ nivel: 'alta',
      texto: `${plural(falhas.length, 'automação está falhando', 'automações estão falhando')}: ${lista(falhas.map(a => a.nome))}.`,
      acao: 'Investigar o log, adicionar nova tentativa automática e avisar quem depende dela.' });
    if (emDev.length >= 3) melhorias.push({ nivel: 'media',
      texto: `${emDev.length} automações em desenvolvimento ao mesmo tempo.`,
      acao: 'Entregar uma antes de começar a próxima; obra parada não gera valor.' });
    if (semDono.length) melhorias.push({ nivel: 'baixa',
      texto: `${plural(semDono.length, 'automação está', 'automações estão')} sem dono.`,
      acao: 'Definir quem cuida de cada automação quando ela quebrar.' });

    return {
      kpis: [
        { rotulo: 'Automações ativas', valor: ativas.length, detalhe: `${au.length} no total` },
        { rotulo: 'Falhando', valor: falhas.length, detalhe: falhas.length ? 'investigar' : 'nenhuma', tom: falhas.length ? 'ruim' : 'bom' },
        { rotulo: 'Em desenvolvimento', valor: emDev.length, detalhe: 'sendo construídas' },
        { rotulo: 'Com dono', valor: au.length ? pct(au.filter(a => a.dono).length, au.length) + '%' : '—', detalhe: 'têm responsável' }
      ],
      melhorias, tabelas: []
    };
  })();

  /* ---------------- Qualidade / QA (A Legião) ---------------- */
  const revisor = (() => {
    const rv = d.revisoes || [];
    const mesRev = rv.filter(r => mesDe(r.data) === mesAtual);
    const pendentes = rv.filter(r => r.status === 'pendente');
    const ajustar = rv.filter(r => r.resultado === 'ajustar' && r.status !== 'ok');
    const aprov1 = pct(rv.filter(r => r.resultado === 'aprovado').length, rv.length);
    const erros = soma(rv, r => r.erros);

    const melhorias = [];
    if (pendentes.length) melhorias.push({ nivel: 'alta',
      texto: `${plural(pendentes.length, 'item está pendente', 'itens estão pendentes')} de revisão: ${lista(pendentes.map(r => r.item))}.`,
      acao: 'Revisar números e fontes antes de qualquer envio ao cliente.' });
    if (ajustar.length) melhorias.push({ nivel: 'media',
      texto: `${plural(ajustar.length, 'item voltou para ajuste', 'itens voltaram para ajuste')}.`,
      acao: 'Corrigir e reenviar para revisão antes de publicar.' });
    if (rv.length >= 4 && aprov1 < 60) melhorias.push({ nivel: 'baixa',
      texto: `Só ${aprov1}% é aprovado na 1ª revisão.`,
      acao: 'Criar um checklist de marca e CTA para a equipe seguir antes de enviar.' });

    return {
      kpis: [
        { rotulo: 'Revisões no mês', valor: mesRev.length, detalhe: `${rv.length} no total` },
        { rotulo: 'Pendentes', valor: pendentes.length, detalhe: pendentes.length ? 'revisar já' : 'em dia', tom: pendentes.length ? 'ruim' : 'bom' },
        { rotulo: 'Aprovadas na 1ª', valor: rv.length ? aprov1 + '%' : '—', detalhe: 'sem precisar ajustar',
          tom: rv.length ? (aprov1 >= 70 ? 'bom' : aprov1 >= 50 ? 'atencao' : 'ruim') : null },
        { rotulo: 'Erros encontrados', valor: erros, detalhe: 'no total' }
      ],
      melhorias, tabelas: []
    };
  })();

  /* ---------------- Segurança (A Legião) ---------------- */
  const seguranca = (() => {
    const rs = d.riscos || [];
    const abertos = rs.filter(r => r.status !== 'resolvido');
    const altos = abertos.filter(r => r.severidade === 'alta');
    const medios = abertos.filter(r => r.severidade === 'média');
    const resolvidos = rs.filter(r => r.status === 'resolvido');
    const segredos = rs.filter(r => /segredo|credencial|senha|token/i.test(r.risco) && r.status !== 'resolvido');

    const melhorias = [];
    if (altos.length) melhorias.push({ nivel: 'alta',
      texto: `${plural(altos.length, 'risco de severidade alta está aberto', 'riscos de severidade alta estão abertos')}: ${lista(altos.map(r => r.risco))}.`,
      acao: 'Tratar primeiro. Dado de aluno exposto é problema de LGPD e de confiança do cliente.' });
    if (medios.length) melhorias.push({ nivel: 'media',
      texto: `${plural(medios.length, 'risco de severidade média aguarda', 'riscos de severidade média aguardam')} tratamento.`,
      acao: 'Agendar a correção e registrar a ação de cada um.' });
    if (!rs.some(r => /acesso|permiss/i.test(`${r.risco} ${r.acao || ''}`))) melhorias.push({ nivel: 'baixa',
      texto: 'As permissões de ferramentas não aparecem numa revisão recente.',
      acao: 'Revisar quem tem acesso a quê e remover acessos sem uso.' });

    return {
      kpis: [
        { rotulo: 'Riscos abertos', valor: abertos.length, detalhe: `${rs.length} no total` },
        { rotulo: 'Severidade alta', valor: altos.length, detalhe: altos.length ? 'tratar já' : 'nenhum', tom: altos.length ? 'ruim' : 'bom' },
        { rotulo: 'Resolvidos', valor: resolvidos.length, detalhe: 'fechados' },
        { rotulo: 'Segredos expostos', valor: segredos.length, detalhe: 'em aberto', tom: segredos.length ? 'ruim' : 'bom' }
      ],
      melhorias, tabelas: []
    };
  })();

  const areas = { atendimento, marketing, comercial, juridico, financeiro, planejador, pesquisador, implementador, revisor, seguranca };

  /* ---------------- Direção ---------------- */
  const diretoria = (() => {
    const clientes = d.clientes || [];
    const ativos = clientes.filter(c => c.ativo);
    const mrr = soma(ativos, c => c.mensalidade);
    const ticket = ativos.length ? mrr / ativos.length : 0;
    const plano = d.melhorias || [];
    const fazendo = plano.filter(m => m.status === 'fazendo');
    const ideias = plano.filter(m => m.status === 'ideia');
    const vencidasPlano = plano.filter(m => m.status !== 'feito' && m.prazo && diasDesde(m.prazo) > 0);

    const entradas = Object.entries(areas);
    const resumo = entradas.map(([k, r]) => ({
      nome: AREAS[k].nome, agente: AREAS[k].agente, cor: AREAS[k].cor, porta: AREAS[k].porta,
      kpis: r.kpis.slice(0, 2).map(x => ({ rotulo: x.rotulo, valor: x.valor })),
      altas: r.melhorias.filter(m => m.nivel === 'alta').length,
      total: r.melhorias.length
    }));

    const consolidadas = [];
    for (const [k, r] of entradas)
      for (const m of r.melhorias) consolidadas.push(Object.assign({}, m, { area: AREAS[k].nome }));
    consolidadas.sort((a, b) => ORDEM[a.nivel] - ORDEM[b.nivel]);

    const melhorias = [];
    if (vencidasPlano.length) melhorias.push({ nivel: 'alta', area: 'Direção',
      texto: `${plural(vencidasPlano.length, 'item do plano passou do prazo', 'itens do plano passaram do prazo')}: ${lista(vencidasPlano.map(m => m.titulo))}.`,
      acao: 'Repactuar o prazo ou concluir. Plano que não anda desmotiva a equipe.' });
    if (!ativos.length) melhorias.push({ nivel: 'alta', area: 'Direção',
      texto: 'Nenhum cliente ativo cadastrado.',
      acao: 'Cadastrar a carteira de academias em Clientes para os números das áreas fazerem sentido.' });
    for (const m of consolidadas.filter(m => m.nivel === 'alta').slice(0, 6)) melhorias.push(m);
    for (const m of consolidadas.filter(m => m.nivel === 'media').slice(0, 3)) melhorias.push(m);

    return {
      kpis: [
        { rotulo: 'Clientes ativos', valor: ativos.length, detalhe: `${clientes.length} na carteira` },
        { rotulo: 'Receita recorrente', valor: brlCurto(mrr), detalhe: 'MRR estimado' },
        { rotulo: 'Ticket médio', valor: ativos.length ? brlCurto(ticket) : '—', detalhe: 'por cliente' },
        { rotulo: 'No plano', valor: fazendo.length, detalhe: `${fazendo.length} fazendo · ${ideias.length} ideias` }
      ],
      melhorias, resumo, tabelas: []
    };
  })();

  return { diretoria, atendimento, marketing, comercial, juridico, financeiro, planejador, pesquisador, implementador, revisor, seguranca };
}

/** texto em Markdown para o agente ler (RELATORIO.md) e para o terminal */
function relatorio(area, ind, agora = new Date()) {
  const a = AREAS[area], r = ind[area];
  const linhas = [
    `# Relatório de ${a.nome} · AXIS Labs`,
    '',
    `Gerado em ${agora.toLocaleString('pt-BR')}. Este arquivo é refeito pelo sistema a cada mudança; não edite.`,
    '',
    '## Números',
    ...r.kpis.map(k => `- **${k.rotulo}:** ${k.valor}${k.detalhe ? ` (${k.detalhe})` : ''}`),
    '',
    '## O que melhorar agora',
    ...(r.melhorias.length ? r.melhorias.map(m => `- [${m.nivel}]${m.area && area === 'diretoria' ? ` ${m.area}:` : ''} ${m.texto} → ${m.acao}`) : ['- Nada urgente.'])
  ];
  for (const t of r.tabelas || []) {
    if (!t.linhas.length) continue;
    linhas.push('', `## ${t.titulo}`, '', `| ${t.colunas.join(' | ')} |`, `| ${t.colunas.map(() => '---').join(' | ')} |`,
      ...t.linhas.map(l => `| ${l.join(' | ')} |`));
  }
  if (r.resumo) {
    linhas.push('', '## Áreas', ...r.resumo.map(s => `- **${s.nome}** (${s.agente}): ${s.kpis.map(k => `${k.rotulo} ${k.valor}`).join(' · ')} · ${s.altas} urgentes`));
  }
  return linhas.join('\n') + '\n';
}

module.exports = { calcular, relatorio };
