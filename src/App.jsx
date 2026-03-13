jsx
import React, { useState, useMemo } from "react";

// 1. DADOS DOS MÓDULOS (ESTRUTURA COMPLETA COM TODOS OS ITENS)
const MODS = [
  {
    id: 1, titulo: "Módulo 1: Admissão e Registro", peso: 1,
    desc: "Avalia a conformidade da empresa com as normas de admissão e registro de funcionários, garantindo a legalidade desde o primeiro dia de trabalho.",
    itens: [
      { txt: "Os funcionários possuem registro em CTPS (Carteira de Trabalho e Previdência Social) desde o primeiro dia de trabalho, mesmo em período de experiência?", nota: "O registro retroativo gera multas, encargos e riscos de processos trabalhistas, além de descaracterizar o contrato de experiência.", acao: "Regularizar imediatamente todos os registros pendentes e conferir retroativos. Implementar processo de admissão que garanta o registro antes do início das atividades.", critico: true },
      { txt: "O contrato de experiência é formalizado por escrito e assinado pelas partes?", nota: "Sem contrato escrito, a contratação é considerada por tempo indeterminado, perdendo a finalidade do período de experiência.", acao: "Implementar modelo padrão de contrato de experiência para todas as novas contratações e garantir a assinatura antes do início das atividades." },
      { txt: "São realizados exames médicos admissionais antes do início das atividades do funcionário?", nota: "O exame admissional é obrigatório e visa atestar a aptidão do trabalhador para a função, evitando problemas de saúde e responsabilidades futuras para a empresa.", acao: "Garantir a realização do exame admissional antes do início das atividades, agendando com antecedência e acompanhando o resultado." },
      { txt: "Os dados cadastrais dos funcionários (endereço, estado civil, dependentes) estão atualizados?", nota: "Dados desatualizados podem gerar problemas em comunicações oficiais, cálculos de benefícios e declarações fiscais.", acao: "Realizar recadastramento anual ou sempre que houver alteração de dados, solicitando comprovantes." },
      { txt: "A empresa possui o Livro ou Ficha de Registro de Empregados devidamente preenchido e atualizado?", nota: "É um documento obrigatório que contém todas as informações do vínculo empregatício. A falta ou irregularidade pode gerar multas.", acao: "Manter o Livro/Ficha de Registro atualizado com todas as informações exigidas por lei, incluindo alterações contratuais." },
      { txt: "São entregues aos funcionários os documentos de comunicação de admissão (ex: termo de responsabilidade de salário-família, vale-transporte)?", nota: "A falta de comprovação da entrega desses documentos pode gerar ônus para a empresa em caso de fiscalização ou processo.", acao: "Criar um protocolo de entrega de documentos admissionais, com assinatura do funcionário, e arquivar." },
      { txt: "A empresa cumpre a cota de aprendizes e/ou pessoas com deficiência (PCD) conforme a legislação, se aplicável?", nota: "O não cumprimento das cotas pode gerar multas elevadas e ações do Ministério Público do Trabalho.", acao: "Verificar a obrigatoriedade da cota e, se aplicável, iniciar processo de contratação de aprendizes/PCDs, buscando parcerias com instituições." }
    ]
  },
  {
    id: 2, titulo: "Módulo 2: Jornada e Ponto", peso: 2,
    desc: "Verifica a conformidade com as regras de jornada de trabalho, controle de ponto, horas extras e intervalos, minimizando riscos de passivos trabalhistas.",
    itens: [
      { txt: "Existe controle de ponto para empresas com mais de 20 funcionários?", nota: "O controle de ponto é obrigatório para estabelecimentos com mais de 20 empregados, conforme CLT e Lei da Liberdade Econômica.", acao: "Implementar sistema de controle de ponto (eletrônico, mecânico ou manual) e treinar a equipe para seu uso correto.", critico: true },
      { txt: "O controle de ponto registra fielmente os horários de entrada, saída e intervalos?", nota: "Registros incorretos ou 'britânicos' (sempre o mesmo horário) podem ser desconsiderados pela Justiça do Trabalho, presumindo-se a jornada alegada pelo empregado.", acao: "Orientar funcionários e gestores sobre a importância do registro fiel. Auditar periodicamente os registros para identificar inconsistências." },
      { txt: "As horas extras são pagas corretamente, com o adicional legal (mínimo de 50%)?", nota: "O não pagamento ou pagamento incorreto de horas extras é uma das principais causas de ações trabalhistas.", acao: "Revisar a política de horas extras, garantir o cálculo correto e o pagamento em folha, com os adicionais devidos." },
      { txt: "Os intervalos intrajornada (para refeição e descanso) são concedidos integralmente?", nota: "A supressão total ou parcial do intervalo intrajornada gera o pagamento indenizatório do período suprimido, com adicional de 50%.", acao: "Monitorar a concessão dos intervalos. Em caso de supressão, pagar o período como hora extra indenizada." },
      { txt: "Os intervalos interjornada (entre uma jornada e outra) são respeitados (mínimo de 11 horas)?", nota: "A não concessão do intervalo interjornada gera o pagamento das horas suprimidas como extras, com adicional de 50%.", acao: "Ajustar escalas de trabalho para garantir o intervalo mínimo de 11 horas entre jornadas." },
      { txt: "A empresa possui acordo de compensação de horas ou banco de horas, se utiliza?", nota: "Acordos de compensação ou banco de horas devem ser formalizados por acordo individual escrito ou convenção/acordo coletivo.", acao: "Formalizar os acordos de compensação ou banco de horas conforme a legislação, com a participação do sindicato, se necessário." },
      { txt: "São respeitados os limites de jornada diária (8h), semanal (44h) e de horas extras (2h/dia)?", nota: "O excesso de jornada pode gerar multas, ações trabalhistas e problemas de saúde ocupacional.", acao: "Monitorar a jornada de trabalho para garantir o cumprimento dos limites legais. Reduzir a necessidade de horas extras excessivas." }
    ]
  },
  {
    id: 3, titulo: "Módulo 3: Remuneração e Benefícios", peso: 2,
    desc: "Avalia a conformidade no pagamento de salários, adicionais, benefícios e descontos, evitando irregularidades financeiras e passivos.",
    itens: [
      { txt: "Os salários são pagos até o 5º dia útil do mês subsequente ao trabalhado?", nota: "O atraso no pagamento de salários pode gerar multas e rescisão indireta do contrato de trabalho.", acao: "Estabelecer calendário de pagamento e garantir o cumprimento rigoroso do prazo legal." },
      { txt: "São pagos os adicionais de insalubridade, periculosidade ou noturno, se aplicáveis?", nota: "A falta de pagamento desses adicionais, quando devidos, gera passivos trabalhistas significativos.", acao: "Realizar laudos técnicos (LTCAT, PPRA) para identificar a necessidade dos adicionais e efetuar o pagamento correto." },
      { txt: "O vale-transporte é concedido conforme a legislação, com o desconto máximo de 6% do salário básico?", nota: "A concessão irregular ou o desconto acima do limite pode gerar diferenças salariais e multas.", acao: "Revisar a política de vale-transporte, garantindo a concessão e o desconto conforme a lei, mediante declaração do funcionário." },
      { txt: "O vale-refeição/alimentação é concedido de forma não salarial (sem integração ao salário)?", nota: "A integração do vale-refeição/alimentação ao salário aumenta a base de cálculo de encargos e benefícios.", acao: "Garantir que o vale-refeição/alimentação seja concedido por meio de empresas credenciadas ao PAT (Programa de Alimentação do Trabalhador) para manter sua natureza indenizatória." },
      { txt: "São realizados os recolhimentos de FGTS e INSS corretamente e dentro do prazo?", nota: "A falta ou atraso nos recolhimentos gera multas, juros e impede a emissão de CND (Certidão Negativa de Débitos).", acao: "Monitorar e garantir o recolhimento mensal do FGTS e INSS, conferindo as guias e comprovantes." },
      { txt: "Os descontos salariais são feitos apenas com previsão legal ou autorização expressa do empregado?", nota: "Descontos indevidos podem gerar ações de restituição e multas.", acao: "Revisar todos os descontos em folha, garantindo que tenham base legal (ex: INSS, IR, VT) ou autorização escrita do empregado (ex: convênio médico)." },
      { txt: "A empresa paga o 13º salário e as férias dentro dos prazos legais?", nota: "O não cumprimento dos prazos gera multas e o pagamento em dobro das férias.", acao: "Estabelecer calendário para pagamento do 13º salário (1ª parcela até 30/11, 2ª até 20/12) e férias (até 2 dias antes do início do período)." }
    ]
  },
  {
    id: 4, titulo: "Módulo 4: Saúde e Segurança do Trabalho (SST)", peso: 3,
    desc: "Avalia a conformidade com as Normas Regulamentadoras (NRs) de SST, prevenindo acidentes, doenças ocupacionais e multas.",
    itens: [
      { txt: "A empresa possui PPRA (Programa de Prevenção de Riscos Ambientais) ou PGR (Programa de Gerenciamento de Riscos) atualizado?", nota: "O PGR é obrigatório e visa identificar, avaliar e controlar os riscos ambientais no ambiente de trabalho. A falta gera multas.", acao: "Elaborar ou atualizar o PGR com profissional habilitado, garantindo a identificação e controle dos riscos.", critico: true },
      { txt: "São realizados exames médicos periódicos e de retorno ao trabalho?", nota: "Os exames periódicos são obrigatórios e visam monitorar a saúde do trabalhador. A falta gera multas e responsabilidade da empresa em caso de doença ocupacional.", acao: "Estabelecer calendário de exames periódicos e garantir a realização. Realizar exame de retorno ao trabalho após afastamento superior a 30 dias." },
      { txt: "Os funcionários recebem e utilizam os EPIs (Equipamentos de Proteção Individual) adequados para suas funções?", nota: "A falta de fornecimento ou fiscalização do uso de EPIs pode gerar acidentes, multas e responsabilidade civil/criminal da empresa.", acao: "Identificar os EPIs necessários para cada função, fornecer gratuitamente, treinar o uso correto e fiscalizar o uso. Manter registro de entrega." },
      { txt: "A empresa possui CIPA (Comissão Interna de Prevenção de Acidentes) ou Designado de CIPA, se aplicável?", nota: "A CIPA é obrigatória para empresas com mais de 20 funcionários e visa prevenir acidentes e doenças. A falta gera multas.", acao: "Constituir a CIPA ou designar responsável, garantindo o treinamento e o funcionamento regular." },
      { txt: "São realizados treinamentos de segurança e saúde no trabalho (ex: NR-01, NR-05, NR-06)?", nota: "Treinamentos são obrigatórios e essenciais para capacitar os funcionários na prevenção de acidentes e uso correto de equipamentos.", acao: "Elaborar cronograma de treinamentos obrigatórios e garantir a participação dos funcionários, mantendo registros." },
      { txt: "A empresa possui LTCAT (Laudo Técnico das Condições Ambientais de Trabalho) atualizado?", nota: "O LTCAT é fundamental para comprovar a exposição a agentes nocivos e embasar o pagamento de adicionais de insalubridade/periculosidade e aposentadoria especial.", acao: "Elaborar ou atualizar o LTCAT com profissional habilitado, garantindo a correta avaliação dos riscos." },
      { txt: "Existe um plano de emergência e combate a incêndio?", nota: "A falta de um plano de emergência coloca em risco a vida dos funcionários e pode gerar multas e interdição do estabelecimento.", acao: "Elaborar e implementar plano de emergência, com treinamento da brigada de incêndio e simulados periódicos." }
    ]
  },
  {
    id: 5, titulo: "Módulo 5: Rescisão Contratual", peso: 2,
    desc: "Avalia a conformidade nos procedimentos de desligamento de funcionários, evitando erros que geram passivos trabalhistas.",
    itens: [
      { txt: "As verbas rescisórias são pagas dentro do prazo legal (10 dias corridos após o término do contrato)?", nota: "O atraso no pagamento das verbas rescisórias gera multa equivalente a um salário do empregado.", acao: "Estabelecer um cronograma rigoroso para o cálculo e pagamento das rescisões, garantindo o cumprimento do prazo legal.", critico: true },
      { txt: "O Termo de Rescisão de Contrato de Trabalho (TRCT) é preenchido corretamente, com todas as verbas devidas?", nota: "Erros no TRCT podem gerar questionamentos e ações trabalhistas, além de dificultar o saque do FGTS e seguro-desemprego.", acao: "Revisar o preenchimento do TRCT, garantindo a inclusão de todas as verbas e a correta base de cálculo." },
      { txt: "São realizados exames médicos demissionais?", nota: "O exame demissional é obrigatório e visa atestar a saúde do trabalhador no momento do desligamento, evitando alegações de doença ocupacional futura.", acao: "Garantir a realização do exame demissional. Em caso de recusa do empregado, documentar a tentativa." },
      { txt: "A empresa fornece a chave de conectividade para saque do FGTS e as guias para seguro-desemprego?", nota: "A falta desses documentos impede o empregado de acessar seus direitos e pode gerar indenização por danos morais.", acao: "Garantir a emissão e entrega da chave de conectividade e das guias do seguro-desemprego no ato da rescisão." },
      { txt: "Em caso de demissão por justa causa, a falta grave é devidamente comprovada e documentada?", nota: "A justa causa é a penalidade máxima e exige prova robusta da falta grave. A reversão na Justiça do Trabalho gera indenizações elevadas.", acao: "Em caso de justa causa, documentar detalhadamente a falta grave, com provas e testemunhas, e aplicar a penalidade com cautela." },
      { txt: "A empresa cumpre o aviso prévio (trabalhado ou indenizado) conforme a legislação?", nota: "O não cumprimento ou o cálculo incorreto do aviso prévio gera indenizações e multas.", acao: "Calcular e conceder o aviso prévio conforme a modalidade (trabalhado ou indenizado) e o tempo de serviço do empregado." }
    ]
  },
  {
    id: 6, titulo: "Módulo 6: Terceirização e Contratos", peso: 1,
    desc: "Avalia a conformidade na contratação de serviços terceirizados e autônomos, prevenindo riscos de vínculo empregatício e responsabilidade subsidiária.",
    itens: [
      { txt: "Os contratos de prestação de serviços terceirizados são claros e específicos, sem caracterizar subordinação dos terceirizados à empresa?", nota: "A caracterização de subordinação pode gerar o reconhecimento de vínculo empregatício direto com a empresa tomadora de serviços.", acao: "Revisar contratos de terceirização, garantindo que não haja cláusulas que impliquem subordinação. Orientar gestores sobre a não ingerência direta nos funcionários terceirizados." },
      { txt: "A empresa terceirizada está em dia com suas obrigações trabalhistas e previdenciárias (FGTS, INSS, salários)?", nota: "A empresa tomadora de serviços é subsidiariamente responsável pelos débitos trabalhistas da terceirizada. A falta de fiscalização gera passivos.", acao: "Exigir mensalmente da empresa terceirizada os comprovantes de pagamento de salários, FGTS e INSS de seus funcionários." },
      { txt: "Os trabalhadores autônomos contratados possuem autonomia real, sem subordinação ou habitualidade?", nota: "A caracterização de subordinação e habitualidade pode gerar o reconhecimento de vínculo empregatício com o autônomo.", acao: "Revisar contratos com autônomos, garantindo a autonomia na prestação de serviços. Evitar a habitualidade e a subordinação." },
      { txt: "A empresa possui contratos de estágio em conformidade com a Lei do Estágio (Lei nº 11.788/2008)?", nota: "A descaracterização do estágio pode gerar o reconhecimento de vínculo empregatício e o pagamento de todas as verbas trabalhistas.", acao: "Garantir que os contratos de estágio sejam formalizados com instituições de ensino, com termo de compromisso, plano de atividades e acompanhamento." },
      { txt: "Os contratos de trabalho intermitente (se utilizados) estão em conformidade com a legislação?", nota: "A modalidade de contrato intermitente exige formalização específica e cumprimento de regras para convocação e pagamento.", acao: "Revisar os contratos intermitentes, garantindo a formalização e o cumprimento das regras de convocação e pagamento." }
    ]
  },
  {
    id: 7, titulo: "Módulo 7: Diversidade e Assédio", peso: 1,
    desc: "Avalia a conformidade com as normas de combate ao assédio, discriminação e promoção da diversidade, garantindo um ambiente de trabalho saudável e ético.",
    itens: [
      { txt: "A empresa possui política clara de combate ao assédio moral e sexual, com canais de denúncia e investigação?", nota: "A falta de uma política e canais de denúncia pode gerar responsabilidade da empresa em casos de assédio e danos morais.", acao: "Implementar política de combate ao assédio, divulgar amplamente, criar canal de denúncia seguro e garantir a investigação imparcial." },
      { txt: "São realizados treinamentos periódicos sobre assédio, discriminação e ética no ambiente de trabalho?", nota: "Treinamentos são essenciais para conscientizar os funcionários e prevenir condutas inadequadas.", acao: "Elaborar cronograma de treinamentos sobre assédio, discriminação e ética, com participação de todos os funcionários." },
      { txt: "A empresa promove um ambiente de trabalho inclusivo e respeitoso à diversidade (gênero, raça, orientação sexual, etc.)?", nota: "A discriminação pode gerar ações trabalhistas, danos à imagem da empresa e perda de talentos.", acao: "Implementar ações de promoção da diversidade e inclusão, como programas de mentoria, grupos de afinidade e comunicação interna." },
      { txt: "Existe um código de conduta ou manual de ética que abranja as relações interpessoais no trabalho?", nota: "O código de conduta estabelece as expectativas de comportamento e serve como guia para os funcionários.", acao: "Elaborar ou revisar o código de conduta, divulgá-lo e garantir que todos os funcionários tenham acesso e compreendam suas diretrizes." },
      { txt: "A empresa cumpre a Lei Geral de Proteção de Dados (LGPD) no tratamento de dados pessoais dos funcionários?", nota: "O não cumprimento da LGPD pode gerar multas elevadas e danos à reputação da empresa.", acao: "Revisar os processos de coleta, armazenamento e tratamento de dados pessoais dos funcionários, garantindo a conformidade com a LGPD." }
    ]
  }
];

const STATUS = [
  { key: 1, label: "Conforme", emoji: "✅", cor: "#dcfce7", texto: "#166534", border: "#86efac" },
  { key: 0.5, label: "Parcial", emoji: "⚠️", cor: "#fef3c7", texto: "#92400e", border: "#fcd34d" },
  { key: 0, label: "Não Conforme", emoji: "❌", cor: "#fee2e2", texto: "#991b1b", border: "#fecaca" },
  { key: null, label: "N/A", emoji: "⚪", cor: "#f1f5f9", texto: "#475569", border: "#e2e8f0" }
];

export default function App() {
  const [tela, setTela] = useState("form");
  const [empresa, setEmpresa] = useState({ nome: "", cnpj: "" });
  const [abertos, setAbertos] = useState({ 1: true }); // Módulo 1 aberto por padrão
  const [respostas, setRespostas] = useState(() =>
    Object.fromEntries(MODS.map(m => [m.id, m.itens.map(() => null)]))
  );

  const respondidos = useMemo(() => Object.values(respostas).flat().filter(v => v !== null).length, [respostas]);
  const totalItens = useMemo(() => MODS.reduce((acc, m) => acc + m.itens.length, 0), []);

  const calcularResultados = useMemo(() => {
    let pontosGerais = 0;
    let pesoTotal = 0;
    const scoresModulos = {};
    const planoAcao = [];

    MODS.forEach(m => {
      const respMod = respostas[m.id];
      const validos = respMod.filter(v => v !== null);
      if (validos.length > 0) {
        const soma = validos.reduce((a, b) => a + b, 0);
        const pct = (soma / validos.length) * 100;
        scoresModulos[m.id] = Math.round(pct);
        pontosGerais += pct * m.peso;
        pesoTotal += m.peso;

        respMod.forEach((v, idx) => {
          if (v === 0 || v === 0.5) { // Se for Não Conforme (0) ou Parcial (0.5)
            planoAcao.push({
              modulo: m.titulo,
              pergunta: m.itens[idx].txt,
              acao: m.itens[idx].acao,
              prioridade: v === 0 ? "Crítica" : "Atenção"
            });
          }
        });
      } else {
        scoresModulos[m.id] = null; // Módulo sem respostas
      }
    });

    const final = pesoTotal > 0 ? Math.round(pontosGerais / pesoTotal) : 0;
    return { final, scoresModulos, planoAcao };
  }, [respostas]);

  // Renderização da tela de Relatório
  if (tela === "relatorio") {
    const { final, scoresModulos, planoAcao } = calcularResultados;
    return (
      
        
          Resultado Geral
          {final}%
          {empresa.nome || "Empresa Avaliada"}
        

        
          Desempenho por Módulo
          {MODS.map(m => (
            
              
                {m.titulo}
                {scoresModulos[m.id] ?? "N/A"}%
              
              
                
              
            
          ))}
        

        
          🎯 Plano de Ação Priorizado
          {planoAcao.length > 0 ? planoAcao.map((p, i) => (
            
              
                {p.prioridade} • {p.modulo}
              
              {p.pergunta}
              {p.acao}
            
          )) : Nenhuma inconformidade detectada. Parabéns!}
        

         setTela("form")} style={{ width: "100%", marginTop: 20, padding: 15, borderRadius: 12, border: "2px solid #0f2744", background: "none", fontWeight: 700, cursor: "pointer" }}>
          Voltar e Editar Respostas
        
      
    );
  }

  // Renderização da tela de Formulário
  return (
    
      
        CheckUp Trabalhista
        Diagnóstico Preventivo de Riscos
      

      
        
          value={empresa.nome} onChange={e => setEmpresa({...empresa, nome: e.target.value})}
        />
      

      {MODS.map(m => (
        
           setAbertos(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
            style={{ padding: 15, background: "#f8fafc", cursor: "pointer", display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#0f2744" }}
          >
            {m.titulo}
            {abertos[m.id] ? "▲" : "▼"}
          

          {abertos[m.id] && (
            
              {m.itens.map((it, idx) => (
                
                  {idx + 1}. {it.txt}
                  
                    {STATUS.map(s => {
                      const sel = respostas[m.id][idx] === s.key;
                      return (
                         setRespostas(prev => ({
                            ...prev, [m.id]: prev[m.id].map((v, i) => i === idx ? s.key : v)
                          }))}
                          style={{
                            padding: "10px 5px", fontSize: 10, borderRadius: 8, cursor: "pointer", border: "1px solid",
                            background: sel ? s.cor : "#fff",
                            color: sel ? s.texto : "#64748b",
                            borderColor: sel ? s.border : "#e2e8f0",
                            fontWeight: sel ? 700 : 400
                          }}
                        >
                          {s.emoji}
                          {s.label}
                        
                      );
                    })}
                  
                
              ))}
            
          )}
        
      ))}

       setTela("relatorio")}
        disabled={respondidos < totalItens}
        style={{ width: "100%", padding: 18, borderRadius: 12, background: respondidos < totalItens ? "#94a3b8" : "#0f2744", color: "#fff", fontWeight: 700, border: "none", cursor: respondidos < totalItens ? "not-allowed" : "pointer", fontSize: 16 }}
      >
        {respondidos < totalItens ? `Responda todos os itens (${respondidos}/${totalItens})` : "🚀 Gerar Relatório e Plano de Ação"}
      
    
  );
}
