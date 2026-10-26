/* ===========================================================
   exemplo.js — dados de demonstração da AXIS Labs.

   gerar() devolve, por área, as listas já preenchidas, com cada item
   marcado { exemplo: true }. As referências usam ids fixos (cli-1,
   lead-2…) para baterem entre áreas. As datas são relativas a hoje,
   para os alertas "há mais de 12h", "vence em…", etc. fazerem sentido.
   Tudo some de uma vez no botão "Apagar exemplos" da Direção.
   =========================================================== */

function gerar() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  const iso = dt => `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  const isoH = dt => `${iso(dt)}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  const dias = n => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const horas = n => { const x = new Date(d); x.setHours(x.getHours() + n); return x; };
  const min = (dt, m) => { const x = new Date(dt); x.setMinutes(x.getMinutes() + m); return x; };
  const mes = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  const E = x => Object.assign({ exemplo: true }, x);

  return {
    diretoria: {
      clientes: [
        E({ id: 'cli-1', nome: 'Academia Alfa JJ', modalidade: 'jiu-jítsu', plano: 'essencial', mensalidade: 1500, inicio: iso(dias(-70)), ativo: true, responsavel: 'Prof. André' }),
        E({ id: 'cli-2', nome: 'Box Centro', modalidade: 'crossfit', plano: 'crescimento', mensalidade: 2200, inicio: iso(dias(-40)), ativo: true, responsavel: 'Carla' }),
        E({ id: 'cli-3', nome: 'JJ Team Zona Sul', modalidade: 'jiu-jítsu', plano: 'piloto', mensalidade: 790, inicio: iso(dias(-25)), ativo: true, responsavel: 'Marcos' })
      ],
      melhorias: [
        E({ id: 'mel-1', titulo: 'Definir faixa de preço do piloto de 90 dias', area: 'Direção', impacto: 'alto', responsavel: 'Vitor', prazo: iso(dias(-2)), status: 'fazendo', origem: 'Decisão pendente do plano de negócio' }),
        E({ id: 'mel-2', titulo: 'Roteiro de confirmação de aula experimental', area: 'Comercial', impacto: 'médio', responsavel: 'Caio', prazo: iso(dias(5)), status: 'ideia', origem: 'Comparecimento abaixo da meta' })
      ]
    },

    atendimento: {
      leads: [
        E({ id: 'lead-1', nome: 'Marcos R.', telefone: '(11) 90000-0001', canal: 'Instagram', cliente: 'cli-3', chegou: isoH(horas(-20)), respondido: null, status: 'novo', obs: 'Perguntou sobre turma iniciante de jiu-jítsu' }),
        E({ id: 'lead-2', nome: 'Juliana P.', telefone: '(11) 90000-0002', canal: 'WhatsApp', cliente: 'cli-1', chegou: isoH(dias(-1)), respondido: isoH(min(dias(-1), 25)), status: 'aula agendada' }),
        E({ id: 'lead-3', nome: 'Diego A.', telefone: '(11) 90000-0003', canal: 'Indicação', cliente: 'cli-1', chegou: isoH(dias(-6)), respondido: isoH(min(dias(-6), 5)), status: 'em atendimento' }),
        E({ id: 'lead-4', nome: 'Rafaela S.', telefone: '(11) 90000-0004', canal: 'Anúncio', cliente: 'cli-2', chegou: isoH(dias(-4)), respondido: isoH(min(dias(-4), 40)), status: 'descartado', obs: 'Queria musculação, fora do escopo' }),
        E({ id: 'lead-5', nome: 'Pedro L.', telefone: '(11) 90000-0005', canal: 'Instagram', cliente: 'cli-3', chegou: isoH(dias(-5)), respondido: isoH(min(dias(-5), 8)), status: 'aula agendada' }),
        E({ id: 'lead-6', nome: 'Bruna M.', telefone: '(11) 90000-0006', canal: 'Google', cliente: 'cli-2', chegou: isoH(horas(-30)), respondido: null, status: 'novo' })
      ]
    },

    marketing: {
      campanhas: [
        E({ id: 'cmp-1', nome: 'Aula grátis JJ', cliente: 'cli-3', formato: 'reels', canal: 'Instagram', leads: 54, investimento: 300, mes, status: 'pausada' }),
        E({ id: 'cmp-2', nome: 'Turma iniciante', cliente: 'cli-1', formato: 'carrossel', canal: 'Instagram', leads: 29, investimento: 200, mes, status: 'ativa' }),
        E({ id: 'cmp-3', nome: 'Retorno de alunos', cliente: 'cli-2', formato: 'story', canal: 'WhatsApp', leads: 14, investimento: 90, mes, status: 'ativa' })
      ]
    },

    comercial: {
      experimentais: [
        E({ id: 'exp-1', lead: 'lead-2', cliente: 'cli-1', data: isoH(dias(1)), compareceu: false, matriculou: false, valorPlano: null, status: 'agendada' }),
        E({ id: 'exp-2', lead: 'lead-5', cliente: 'cli-3', data: isoH(dias(-3)), compareceu: true, matriculou: false, valorPlano: null, status: 'compareceu', obs: 'Gostou, vai pensar no plano' }),
        E({ id: 'exp-3', lead: 'lead-3', cliente: 'cli-1', data: isoH(dias(-6)), compareceu: true, matriculou: true, valorPlano: 220, status: 'matriculou' }),
        E({ id: 'exp-4', lead: 'lead-1', cliente: 'cli-3', data: isoH(dias(-2)), compareceu: false, matriculou: false, valorPlano: null, status: 'faltou', obs: 'Não apareceu, sem aviso' })
      ],
      metas: [
        E({ id: 'met-1', mes, experimentais: 12, matriculas: 4 })
      ]
    },

    juridico: {
      contratos: [
        E({ id: 'con-1', cliente: 'cli-1', tipo: 'mensal', assinadoEm: iso(dias(-60)), responsavelDados: true, optout: true, status: 'assinado', prazo: iso(dias(120)), obs: '' }),
        E({ id: 'con-2', cliente: 'cli-2', tipo: 'mensal', assinadoEm: iso(dias(-38)), responsavelDados: false, optout: true, status: 'assinado', prazo: iso(dias(90)), obs: 'Falta definir responsável por dados' }),
        E({ id: 'con-3', cliente: 'cli-3', tipo: 'piloto 90 dias', assinadoEm: iso(dias(-25)), responsavelDados: true, optout: false, status: 'assinado', prazo: iso(dias(-5)), obs: 'Piloto encerrando, revisar' }),
        E({ id: 'con-4', cliente: 'cli-3', tipo: 'mensal', assinadoEm: null, responsavelDados: false, optout: false, status: 'rascunho', prazo: null, obs: 'Renovação após o piloto' })
      ]
    },

    financeiro: {
      faturas: [
        E({ id: 'fat-1', cliente: 'cli-1', tipo: 'mensalidade', valor: 1500, vencimento: iso(dias(5)), pago: false, pagoEm: null }),
        E({ id: 'fat-2', cliente: 'cli-2', tipo: 'mensalidade', valor: 2200, vencimento: iso(dias(10)), pago: false, pagoEm: null }),
        E({ id: 'fat-3', cliente: 'cli-3', tipo: 'mensalidade', valor: 790, vencimento: iso(dias(-12)), pago: false, pagoEm: null }),
        E({ id: 'fat-4', cliente: 'cli-1', tipo: 'setup', valor: 500, vencimento: iso(dias(-40)), pago: true, pagoEm: iso(dias(-38)) }),
        E({ id: 'fat-5', cliente: 'cli-1', tipo: 'mensalidade', valor: 1500, vencimento: iso(dias(-2)), pago: true, pagoEm: iso(dias(-2)) })
      ],
      custos: [
        E({ id: 'cus-1', mes, categoria: 'ferramentas', descricao: 'Canva + Make', valor: 120 }),
        E({ id: 'cus-2', mes, categoria: 'IA', descricao: 'Modelos de IA (atendimento e conteúdo)', valor: 210 })
      ]
    },

    planejador: {
      planos: [
        E({ id: 'pla-1', titulo: 'Onboarding Academia Alfa', area: 'Comercial', passos: 6, dono: 'Átila', status: 'em execução', leadTimeDias: 3 }),
        E({ id: 'pla-2', titulo: 'Automação de follow-up', area: 'Atendimento', passos: 4, dono: 'Dino', status: 'planejando', leadTimeDias: 2 }),
        E({ id: 'pla-3', titulo: 'Pacote de conteúdo JJ', area: 'Marketing', passos: 5, dono: '', status: 'backlog', leadTimeDias: null })
      ]
    },

    pesquisador: {
      pesquisas: [
        E({ id: 'pes-1', tema: 'Ticket médio do jiu-jítsu', fonte: 'Entrevistas com donos', coletadoEm: null, confianca: 'média', uso: 'Preço da oferta', status: 'em andamento' }),
        E({ id: 'pes-2', tema: 'Concorrentes locais', fonte: 'Instagram / Google Maps', coletadoEm: iso(dias(-4)), confianca: 'alta', uso: 'Posicionamento', status: 'concluída' }),
        E({ id: 'pes-3', tema: '1ª resposta do setor', fonte: '', coletadoEm: null, confianca: 'média', uso: 'Meta de atendimento', status: 'a fazer' })
      ]
    },

    implementador: {
      automacoes: [
        E({ id: 'aut-1', nome: 'Resposta de FAQ ao novo lead', gatilho: 'Novo lead no formulário', ultimaExecucao: isoH(horas(-1)), status: 'ok', dono: 'Dino' }),
        E({ id: 'aut-2', nome: 'Follow-up da aula experimental', gatilho: 'Aula sem confirmação', ultimaExecucao: isoH(horas(-2)), status: 'falhou', dono: 'Dino' }),
        E({ id: 'aut-3', nome: 'Relatório mensal do cliente', gatilho: 'Dia 1 do mês', ultimaExecucao: isoH(dias(-6)), status: 'ok', dono: 'Dino' })
      ]
    },

    revisor: {
      revisoes: [
        E({ id: 'rev-1', item: 'Relatório mensal · Academia Alfa', area: 'Financeiro', resultado: 'revisar', erros: null, status: 'pendente', data: iso(dias(-1)) }),
        E({ id: 'rev-2', item: 'Reels "Aula grátis"', area: 'Marketing', resultado: 'aprovado', erros: 0, status: 'ok', data: iso(dias(-2)) }),
        E({ id: 'rev-3', item: 'Resposta do agente de FAQ', area: 'Atendimento', resultado: 'ajustar', erros: 2, status: 'voltou', data: iso(dias(-3)) })
      ]
    },

    seguranca: {
      riscos: [
        E({ id: 'ris-1', risco: 'Planilha de leads com link público', severidade: 'alta', area: 'Atendimento', status: 'aberto', acao: 'Restringir e trocar para convite por e-mail' }),
        E({ id: 'ris-2', risco: 'Permissões de ferramentas sem revisão há 60 dias', severidade: 'média', area: 'Segurança', status: 'aberto', acao: 'Revisar acessos e remover os sem uso' }),
        E({ id: 'ris-3', risco: 'Credenciais no arquivo .env local', severidade: 'baixa', area: 'Implementação', status: 'resolvido', acao: 'Movidas para gerenciador de segredos' })
      ]
    }
  };
}

module.exports = { gerar };
