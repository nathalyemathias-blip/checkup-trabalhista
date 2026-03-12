import React, { useState, useMemo, useEffect } from "react";

const PESOS = [1.5, 2.0, 2.0, 3.0, 1.5, 2.5, 2.5];

const MODS = [

  { id:1, titulo:"Contratação e Onboarding", peso:1.5,

    desc:"A fase de contratação é onde os riscos trabalhistas têm origem. Erros na formalização do vínculo, documentação incompleta e ambiguidade sobre cargo e remuneração criam fragilidades exploráveis em reclamações futuras.",

    alerta:{tipo:"warn",txt:"💡 Atenção especial",msg:"Promessas verbais de promoção, aumento ou benefícios feitas no processo seletivo sem documentação são uma das causas mais comuns de reclamações por diferenças salariais e dano moral."},

    itens:[

      {txt:"Registro em CTPS realizado até o 1º dia de trabalho efetivo",nota:"A CLT (Art. 29) exige o registro na CTPS no prazo de 5 dias úteis da admissão, mas o colaborador não pode iniciar sem vínculo formalizado. O não cumprimento gera multa e, em caso de acidente antes do registro, a empresa fica sem cobertura previdenciária. Responsável: DP ou contabilidade.",acoes:{r:"Registre a CTPS imediatamente. Para futuras admissões, inclua o registro como etapa obrigatória antes do início. Prazo: imediato. Resp: DP/Contabilidade. Doc: CTPS anotada ou eSocial atualizado.",a:"Crie checklist admissional com registro em CTPS como primeira etapa obrigatória. Prazo: 15 dias. Resp: RH/DP. Doc: Checklist de admissão."}},

      {txt:"Evento de admissão no eSocial (S-2200) enviado até D-1",nota:"O S-2200 deve ser enviado até o dia anterior ao início das atividades (D-1). Existe o S-2190 (simplificado) para envio no mesmo dia, mas precisa ser complementado em 7 dias. Normalmente executado pelo contador/contabilidade. Envio fora do prazo gera multa automática. Responsável: contabilidade.",acoes:{r:"Oriente a contabilidade a receber o aviso de admissão com mínimo 48h de antecedência. Prazo: imediato. Resp: Contabilidade/DP. Doc: Comprovante de transmissão eSocial.",a:"Implante formulário padrão de aviso de admissão enviado ao contador com 48h de antecedência. Prazo: 15 dias. Resp: RH. Doc: Formulário de aviso de admissão."}},

      {txt:"Contrato de trabalho assinado antes do início, especificando: cargo, função, salário, jornada e local",nota:"O contrato deve conter 5 elementos obrigatórios: CARGO (posição formal, ex: Analista de RH); FUNÇÃO (atividades do dia a dia); SALÁRIO (valor e composição); JORNADA (horas diárias/semanais); LOCAL (endereço ou modalidade remota). A ausência de qualquer item gera disputas judiciais. Responsável: contador ou advogado trabalhista elabora; ambas as partes assinam.",acoes:{r:"Revise todos os contratos com advogado trabalhista garantindo os 5 elementos. Prazo: 30 dias. Resp: Advogado/Contador. Doc: Contrato de trabalho atualizado e assinado.",a:"Identifique contratos incompletos e complemente via Termo Aditivo. Prazo: 30 dias. Resp: Advogado. Doc: Termo Aditivo assinado."}},

      {txt:"Ficha de admissão preenchida e assinada pelo colaborador",nota:"Reúne dados pessoais e documentais para o registro formal. Deve ser preenchida e assinada antes do início. Protege a empresa em divergências sobre dados cadastrais, comprovando que as informações foram fornecidas pelo próprio colaborador. Responsável: RH/DP.",acoes:{r:"Implante ficha padronizada e colete de todos os colaboradores ativos que não a assinaram. Prazo: 30 dias. Resp: RH/DP. Doc: Ficha de admissão assinada.",a:"Revise fichas existentes e complete informações faltantes. Prazo: 20 dias. Resp: RH. Doc: Ficha atualizada e assinada."}},

      {txt:"Exame admissional (ASO) realizado antes do início das atividades",nota:"Obrigatório por lei (NR-7), deve ser feito ANTES do início. Registra o estado de saúde na entrada — fundamental para afastar alegações futuras de doença ocupacional. Sem ASO admissional, a empresa não pode provar que o colaborador estava saudável quando contratado. Responsável: RH agenda; médico do trabalho emite.",acoes:{r:"Não permita início sem ASO. Para colaboradores sem ASO admissional, realize e archive imediatamente. Prazo: imediato. Resp: RH. Doc: ASO emitido e arquivado no prontuário.",a:"Inclua agendamento do ASO como etapa obrigatória do onboarding. Prazo: 15 dias. Resp: RH. Doc: ASO admissional arquivado."}},

      {txt:"Entrega do Regulamento Interno com protocolo de recebimento assinado",nota:"Comprova que o colaborador conhece as regras da empresa — essencial em casos de advertências e justa causa por descumprimento de normas internas. Sem o protocolo de assinatura, o colaborador pode alegar desconhecimento das regras. Responsável: RH elabora e entrega.",acoes:{r:"Elabore o Regulamento Interno e colete assinatura de todos os colaboradores. Prazo: 60 dias. Resp: RH/Jurídico. Doc: Regulamento + protocolo de recebimento assinado.",a:"Implante protocolo para novas admissões e regularize os atuais. Prazo: 30 dias. Resp: RH. Doc: Protocolo de entrega assinado."}},

      {txt:"Termo de confidencialidade assinado quando o colaborador acessa informações estratégicas",nota:"Protege dados de clientes, processos internos, tecnologia e planos de negócio. Recomendado para qualquer colaborador com acesso a informações sensíveis. O termo deve ser específico sobre quais informações são confidenciais — termos genéricos têm valor probatório reduzido. Responsável: advogado trabalhista elabora; RH aplica na admissão.",acoes:{r:"Elabore termo específico por cargo e colete assinatura de todos com acesso a informações sensíveis. Prazo: 30 dias. Resp: Advogado. Doc: Termo de confidencialidade assinado.",a:"Identifique colaboradores sem assinatura e regularize. Prazo: 20 dias. Resp: RH. Doc: Termo de confidencialidade assinado."}},

      {txt:"Cláusula de não concorrência com prazo, abrangência e contraprestação definidos",nota:"Para ser válida, precisa de 4 requisitos cumulativos: (1) prazo limitado de 6 meses a 2 anos; (2) área geográfica definida; (3) atividade específica; (4) compensação financeira durante o período. Sem contraprestação, a cláusula é frequentemente anulada. Aplicar apenas para cargos estratégicos. Responsável: advogado trabalhista.",acoes:{r:"Revise com advogado se as cláusulas existentes atendem aos 4 requisitos. Prazo: 45 dias. Resp: Advogado. Doc: Cláusula ou aditivo com todos os elementos.",a:"Valide cláusulas existentes com advogado. Prazo: 30 dias. Resp: Advogado. Doc: Aditivo revisado."}},

      {txt:"Colaborador informado sobre benefícios de forma escrita e documentada",nota:"Benefícios comunicados apenas verbalmente podem se tornar passivo trabalhista se o colaborador alegar que faziam parte da remuneração acordada. Uma vez concedido, o benefício dificilmente pode ser retirado sem gerar reclamação (Art. 468 CLT). Responsável: RH.",acoes:{r:"Elabore carta de benefícios formal com todas as condições e colete assinatura. Prazo: 30 dias. Resp: RH. Doc: Carta de benefícios assinada.",a:"Formalize benefícios comunicados apenas verbalmente ou informalmente. Prazo: 20 dias. Resp: RH. Doc: Carta de benefícios ou cláusula contratual."}},

      {txt:"Tipo de contrato claramente definido: CLT, PJ, temporário, estagiário ou aprendiz",nota:"Cada modalidade tem regras diferentes. CLT: vínculo com todos os direitos. PJ: prestação autônoma (veja Módulo 4). Temporário: Lei 6.019/74, prazo máximo 180 dias. Estagiário: Lei 11.788/08, exige convênio com instituição de ensino. Aprendiz: Lei 10.097/00, jovens de 14 a 24 anos. A ambiguidade sobre o vínculo é porta de entrada para reclamações. Responsável: direção/RH define; contador/advogado formaliza.",acoes:{r:"Revise todos os vínculos e garanta que o tipo está correto e formalizado. Prazo: 30 dias. Resp: Advogado. Doc: Contrato específico para cada modalidade.",a:"Identifique contratos com ambiguidade e regularize. Prazo: 30 dias. Resp: Advogado. Doc: Contrato revisado ou aditivo."}},

      {txt:"Cópia dos documentos admissionais arquivada (físico ou digital com backup)",nota:"O colaborador pode pleitear direitos dos últimos 5 anos do contrato (até 2 anos após desligamento). A empresa pode precisar apresentar documentos de até 7 anos atrás. Arquivo organizado com backup digital é a diferença entre ter e não ter defesa em processo trabalhista. Responsável: RH/DP.",acoes:{r:"Digitalize e organize os documentos de todos os colaboradores ativos. Prazo: 60 dias. Resp: RH/DP. Doc: Prontuário digital ou físico completo.",a:"Implante processo sistemático de arquivamento para novas admissões. Prazo: 30 dias. Resp: RH. Doc: Checklist de documentos admissionais."}},

      {txt:"Ausência de promessas verbais não documentadas (cargo, salário, benefícios futuros)",nota:"'Em 6 meses você vira gerente', 'o plano inclui dependentes', 'tem participação nos lucros' — promessas verbais podem ser alegadas como condições acordadas e não cumpridas. Nenhum compromisso deve ser feito sem formalização por escrito. Responsável: todos os gestores e recrutadores.",acoes:{r:"Oriente gestores: nenhum compromisso sem documento. Formalize retroativamente qualquer promessa já feita. Prazo: imediato. Resp: RH/Diretoria. Doc: Política de ofertas; aditivos para promessas existentes.",a:"Implante política que exige aprovação antes de qualquer oferta de benefício ou promoção. Prazo: 20 dias. Resp: RH. Doc: Política de comunicação de ofertas assinada pelos gestores."}},

      {txt:"O contrato é elaborado pelo contador/contabilidade ou por advogado trabalhista?",nota:"A elaboração deve ser feita por profissional habilitado. Contratos sem conhecimento técnico frequentemente têm lacunas que só aparecem numa reclamação. Responsável: contabilidade ou advogado trabalhista elabora; RH revisa e aprova.",acoes:{r:"Defina responsável habilitado e revise os contratos existentes com advogado. Prazo: 30 dias. Resp: Advogado/Contador. Doc: Contratos revisados e validados.",a:"Valide periodicamente os modelos de contrato da contabilidade com advogado trabalhista. Prazo: 30 dias. Resp: Advogado. Doc: Contrato padrão validado."}},

      {txt:"O cargo está registrado com o código CBO correto, conforme o Ministério do Trabalho?",nota:"A CBO (Classificação Brasileira de Ocupações) é o código oficial do Ministério do Trabalho que identifica cada ocupação. Deve ser informado corretamente no eSocial na admissão. Código errado gera inconsistências no eSocial e pode afetar direitos como aposentadoria especial. Consulte o código correto em cbo.mte.gov.br. Responsável: contabilidade, no cadastro do eSocial.",acoes:{r:"Consulte e corrija o CBO de todos os colaboradores no eSocial. Prazo: 30 dias. Resp: Contabilidade/DP. Doc: Comprovante de atualização no eSocial.",a:"Revise os CBOs a cada mudança de cargo ou função. Prazo: 15 dias. Resp: RH/Contabilidade. Doc: Registro atualizado no eSocial."}},

      {txt:"Quando há alteração de cargo, função, salário, jornada ou local, é elaborado Termo Aditivo?",nota:"O Termo Aditivo formaliza qualquer alteração nas condições originais do contrato. Sem ele, a empresa não pode provar que a mudança foi acordada — e o colaborador pode alegar alteração unilateral prejudicial (Art. 468 CLT proíbe alterações prejudiciais não acordadas). Responsável: contador ou advogado elabora; ambas as partes assinam.",acoes:{r:"Elabore aditivos para todas as alterações já ocorridas sem formalização. Implante fluxo que exige aditivo antes de qualquer mudança. Prazo: 60 dias. Resp: Advogado/Contador. Doc: Termo Aditivo assinado e arquivado.",a:"Implante fluxo de aprovação com aditivo obrigatório antes de qualquer alteração contratual. Prazo: 20 dias. Resp: RH. Doc: Termo Aditivo contratual."}},

      {txt:"A empresa conhece e aplica as regras da Convenção Coletiva de Trabalho (CCT) da sua categoria?",nota:"A CCT é o acordo entre o sindicato dos trabalhadores e o patronal da sua atividade. Define piso salarial, benefícios obrigatórios, jornadas e adicionais específicos da categoria — e se sobrepõe ao contrato individual quando mais favorável ao trabalhador. É renovada anualmente. Para identificar sua CCT: consulte o CNAE da empresa no portal do Ministério do Trabalho ou no sindicato patronal. Responsável: contabilidade ou RH acompanha; advogado interpreta.",acoes:{r:"Identifique e archive a CCT vigente. Faça revisão completa dos contratos com advogado. Prazo: 60 dias. Resp: Advogado/Contador. Doc: CCT vigente arquivada e checklist de conformidade.",a:"Revise a CCT anualmente a cada renovação para identificar novas obrigações. Prazo: 30 dias. Resp: RH/Contador. Doc: CCT atualizada e registro de revisão."}}

    ]},

  { id:2, titulo:"Jornada e Controle de Ponto", peso:2.0,

    desc:"O controle de jornada concentra o maior volume de reclamações trabalhistas no Brasil. Horas extras não pagas, banco de horas irregular e ausência de registros são os principais vetores de risco.",

    alerta:{tipo:"warn",txt:"💡 Home Office e Disponibilidade Digital",msg:"Mensagens de WhatsApp, e-mails e ligações fora do horário sem política clara podem configurar horas extras não remuneradas. Formalize as regras de disponibilidade em aditivo contratual ou política interna assinada por todos."},

    itens:[

      {txt:"Sistema de controle de ponto ativo (eletrônico, mecânico ou manual)",nota:"A CLT exige controle de jornada para empresas com mais de 20 empregados (Art. 74). Pode ser eletrônico, mecânico ou manual. Registros devem ser fiéis — adulterações configuram fraude e geram condenação por horas extras de todo o período. Responsável: RH/gestão implementa; colaborador registra.",acoes:{r:"Implante imediatamente sistema de controle de ponto adequado ao porte da empresa. Prazo: 15 dias. Resp: RH/Gestão. Doc: Sistema ativo com registros a partir da implantação.",a:"Avalie se o sistema atual é confiável e usado corretamente por todos. Prazo: 15 dias. Resp: RH. Doc: Política de uso do ponto."}},

      {txt:"Registros de ponto consistentes, sem alterações unilaterais sem justificativa documentada",nota:"Qualquer correção no ponto exige justificativa escrita e preferencialmente assinatura do colaborador concordando. Alterações unilaterais sem documentação são consideradas fraude — o juiz pode desconsiderar todos os registros e presumir como verdadeira a jornada alegada pelo colaborador. Responsável: RH/DP corrige; gestor autoriza.",acoes:{r:"Implante política de correção de ponto com justificativa e assinatura obrigatórias. Prazo: imediato. Resp: RH/Gestores. Doc: Formulário de ajuste de ponto assinado pelo colaborador.",a:"Revise registros dos últimos 12 meses e corrija inconsistências documentando os motivos. Prazo: 30 dias. Resp: RH/DP. Doc: Termos de ajuste assinados."}},

      {txt:"Intervalo intrajornada de no mínimo 1h respeitado e registrado para jornadas acima de 6h",nota:"O intervalo intrajornada é o descanso para refeição DENTRO da jornada (almoço/jantar). CLT Art. 71: acima de 6h = mínimo 1h e máximo 2h; entre 4h e 6h = mínimo 15 min; até 4h = sem intervalo. Atenção: o intervalo INTERjornada (entre um dia e outro) deve ser de no mínimo 11 horas consecutivas (Art. 66 CLT) — são conceitos diferentes. Não cumprimento do intrajornada gera hora extra com adicional de 50%. Responsável: gestores controlam.",acoes:{r:"Garanta que o ponto registra entrada e saída do intervalo. Oriente gestores. Prazo: imediato. Resp: RH/Gestores. Doc: Registros de ponto com intervalo discriminado.",a:"Oriente colaboradores e gestores sobre regras e consequências. Prazo: 15 dias. Resp: RH. Doc: Comunicado interno e registros de ponto."}},

      {txt:"Horas extras formalizadas: autorizadas por escrito ou na folha de pagamento",nota:"CLT (Art. 59) permite máximo 2h extras/dia com adicional mínimo de 50%. A ausência de formalização é a principal causa de condenação — se o colaborador provar que fazia extras sem receber, a empresa paga tudo retroativamente com juros. Responsável: gestor autoriza; RH/DP controla e processa.",acoes:{r:"Implante autorização prévia escrita ou garanta que extras aparecem discriminadas na folha. Prazo: imediato. Resp: RH/DP. Doc: Formulário de autorização ou holerite com horas extras.",a:"Revise registros de ponto vs. horas extras pagas nos últimos meses. Prazo: 30 dias. Resp: RH/DP. Doc: Relatório de horas extras vs. pagamentos."}},

      {txt:"Banco de horas com Acordo Individual ou Coletivo vigente e arquivado",nota:"Para ser válido, o banco de horas precisa de: acordo individual escrito (válido por até 6 meses) ou acordo coletivo/CCT (pode ser até 1 ano ou mais). Sem esse documento, o banco é inválido e todas as horas devem ser pagas como extras. Responsável: RH/advogado elabora o acordo.",acoes:{r:"Regularize com acordo individual escrito ou verifique se a CCT já o autoriza. Prazo: 30 dias. Resp: Advogado. Doc: Acordo de banco de horas assinado ou CCT arquivada.",a:"Revise o acordo e confirme validade e abrangência para todos os colaboradores. Prazo: 15 dias. Resp: RH/Advogado. Doc: Acordo atualizado e vigente."}},

      {txt:"Banco de horas compensado ou pago dentro do prazo",nota:"Acordo individual: compensação em até 6 meses. Acordo coletivo: até 1 ano. Saldo não compensado no prazo deve ser pago como hora extra. Colaborador desligado com saldo positivo recebe as horas na rescisão com adicional. Responsável: RH controla saldos; gestores escalonam compensações.",acoes:{r:"Levante saldo atual de todos e estabeleça plano de compensação ou pagamento. Prazo: 30 dias. Resp: RH/DP. Doc: Relatório de saldo por colaborador e plano de compensação.",a:"Implante controle mensal com alerta quando se aproximar do prazo limite. Prazo: 20 dias. Resp: RH. Doc: Relatório periódico de banco de horas."}},

      {txt:"Trabalho em finais de semana e feriados com compensação ou adicional documentados",nota:"Trabalho em domingo exige folga compensatória na mesma semana ou pagamento com adicional de 100%. Feriado exige folga ou pagamento em dobro. As regras variam pela CCT da categoria. Ausência de documentação (escala, autorização, comprovante) é porta de entrada para reclamações. Responsável: gestor escalona; RH/DP processa.",acoes:{r:"Regularize pagamento ou compensação de todos os fins de semana e feriados sem registro. Prazo: 60 dias. Resp: RH/DP com apoio jurídico. Doc: Escalas de trabalho e comprovantes de compensação.",a:"Implante registro formal de trabalho em feriados e fins de semana. Prazo: 20 dias. Resp: RH. Doc: Escala documentada e comprovantes de compensação."}},

      {txt:"Política de home office formalizada em aditivo contratual",nota:"A CLT (Arts. 75-A a 75-E, atualizados pela Lei 14.442/2022) exige aditivo que especifique: atividades remotas, responsabilidade por equipamentos, reembolso de despesas (energia, internet) e controle ou não de jornada. Sem aditivo, o colaborador pode alegar horas extras pelo trabalho fora da jornada. Responsável: advogado trabalhista elabora.",acoes:{r:"Elabore aditivo de teletrabalho para todos em home office com todos os elementos legais. Prazo: 30 dias. Resp: Advogado. Doc: Aditivo contratual de teletrabalho assinado.",a:"Revise aditivos existentes e atualize conforme legislação vigente. Prazo: 20 dias. Resp: Advogado. Doc: Aditivo atualizado."}},

      {txt:"Colaboradores em home office com controle de jornada definido e registrado",nota:"No teletrabalho, se não houver cláusula expressa de isenção de jornada, o colaborador pode alegar horas extras. A empresa precisa definir claramente: há controle de jornada (como é feito?) ou não há (deve estar no aditivo). Responsável: RH/TI define; gestor supervisiona.",acoes:{r:"Defina método de registro de jornada remota ou inclua cláusula de isenção no aditivo. Prazo: 30 dias. Resp: RH/TI/Advogado. Doc: Política de jornada remota ou cláusula de isenção no aditivo.",a:"Avalie se o método atual é confiável e seguido por todos. Prazo: 20 dias. Resp: RH/Gestores. Doc: Relatórios de jornada dos colaboradores remotos."}},

      {txt:"Cargos com função de confiança isentos de ponto caracterizados por escrito",nota:"A CLT (Art. 62, II) permite isenção de controle de jornada para cargos de confiança com poderes reais de gestão (contratar, demitir, representar). O título não basta — a Justiça analisa a realidade da função. Sem formalização adequada, a isenção é inválida e a empresa paga horas extras de todo o período. Responsável: advogado define critérios; RH formaliza.",acoes:{r:"Formalize com advogado quais cargos têm isenção e por quê. Prazo: 30 dias. Resp: Advogado. Doc: Cláusula ou aditivo de cargo de confiança com descrição das atribuições.",a:"Revise se os cargos isentos ainda atendem aos requisitos legais. Prazo: 20 dias. Resp: RH/Advogado. Doc: Revisão contratual dos cargos isentos."}},

      {txt:"Ausência de acionamentos fora do horário sem política clara de compensação",nota:"Mensagens fora do horário — WhatsApp, e-mail, ligações — sem política clara podem configurar horas extras. A empresa precisa definir: há disponibilidade fora do horário? Como é compensada? Isso deve estar em aditivo ou política interna assinada. Responsável: RH elabora; gestores cumprem.",acoes:{r:"Elabore política de disponibilidade digital com regras claras. Prazo: 30 dias. Resp: RH/Advogado. Doc: Política de disponibilidade digital assinada pelo colaborador.",a:"Revise política existente e garanta ciência formal de todos. Prazo: 15 dias. Resp: RH. Doc: Protocolo de recebimento assinado."}},

      {txt:"Registros de ponto arquivados por prazo mínimo de 5 anos",nota:"O colaborador pode pleitear direitos dos últimos 5 anos do contrato. O descarte antecipado deixa a empresa sem defesa — o juiz pode presumir verdadeira a jornada alegada pelo colaborador. Responsável: RH/DP organiza; TI mantém backup.",acoes:{r:"Verifique se registros anteriores foram descartados indevidamente e implante arquivo com mínimo 5 anos. Prazo: 30 dias. Resp: RH/DP. Doc: Arquivo físico ou digital com 5 anos de histórico.",a:"Revise processo de arquivamento e garanta continuidade. Prazo: 15 dias. Resp: RH. Doc: Política de retenção de documentos trabalhistas."}},

      {txt:"Os colaboradores têm acesso ao saldo do banco de horas em tempo real?",nota:"O colaborador tem direito de conhecer e acompanhar seu saldo de banco de horas. A transparência evita questionamentos futuros sobre o saldo real e demonstra boa-fé da empresa. O acesso pode ser via sistema, planilha compartilhada ou relatório mensal por e-mail. Responsável: RH/TI disponibiliza.",acoes:{r:"Implante sistema ou relatório que permita ao colaborador acompanhar seu saldo. Prazo: 30 dias. Resp: RH/TI. Doc: Sistema de acesso ou relatório mensal por colaborador.",a:"Garanta que o acesso existente é compreensível e usado por todos. Prazo: 15 dias. Resp: RH. Doc: Comunicado de acesso com instruções."}}

    ]},

  { id:3, titulo:"Remuneração e Benefícios", peso:2.0,

    desc:"Divergências sobre salário, comissões, equiparação salarial e benefícios figuram entre as reclamações mais frequentes. A documentação precisa e sistemática é a principal defesa da empresa.",

    alerta:{tipo:"warn",txt:"💡 Desvio de Função",msg:"Desvio de função ocorre quando o colaborador exerce atividades superiores às do contrato sem ajuste salarial. É das causas mais frequentes de diferenças salariais retroativas. Revise descrições de cargo a cada mudança real de atividades."},

    itens:[

      {txt:"Holerite emitido mensalmente com protocolo de entrega",nota:"Esta pergunta refere-se ao holerite da folha mensal. Existem dois momentos de pagamento: salário integral (até o 5º dia útil do mês seguinte) e adiantamento (data definida pela CCT ou política interna) — cada um gera um holerite distinto. O protocolo de entrega — assinatura ou acesso digital confirmado — comprova que o colaborador teve ciência dos valores. Responsável: DP/contabilidade emite; RH garante a entrega.",acoes:{r:"Implante emissão mensal e protocolo de entrega com assinatura ou acesso digital confirmado. Prazo: imediato. Resp: DP/Contabilidade. Doc: Holerite mensal com comprovante de entrega.",a:"Garanta que todos recebem e têm acesso ao holerite com registro. Prazo: 15 dias. Resp: DP. Doc: Protocolo de entrega ou acesso digital registrado."}},

      {txt:"Todos os componentes da remuneração descritos no contrato ou documento específico",nota:"Salário base, comissões, bonificações, adicionais — todos precisam estar em documento assinado. Componentes pagos habitualmente mas não documentados podem ser incorporados ao salário por jurisprudência, gerando impacto em férias, 13º e FGTS. Responsável: RH/advogado define e documenta.",acoes:{r:"Revise contratos e formalize todos os componentes em documento assinado. Prazo: 30 dias. Resp: Advogado/Contador. Doc: Contrato atualizado ou carta salarial assinada.",a:"Formalize componentes não documentados. Prazo: 20 dias. Resp: RH/Advogado. Doc: Aditivo ou carta salarial assinada."}},

      {txt:"Comissões e variáveis com critérios documentados e comunicados por escrito",nota:"A CLT exige que comissões sejam pagas até o dia 10 do mês seguinte ao vencimento. Os critérios — base de cálculo, percentual, quando paga, o que ocorre em cancelamentos — devem estar claros em documento assinado. A ausência gera condenações por diferenças retroativas. Responsável: RH/gestão define; advogado valida; colaborador assina.",acoes:{r:"Elabore política de comissionamento com critérios claros e colete assinatura de todos os beneficiários. Prazo: 30 dias. Resp: RH/Advogado. Doc: Política de comissões assinada.",a:"Revise e atualize a política, garantindo que está assinada por todos. Prazo: 20 dias. Resp: RH. Doc: Política atualizada e assinada."}},

      {txt:"Política de metas com metodologia de cálculo documentada e acessível",nota:"Metas que afetam remuneração devem ter metodologia clara — como é calculada, o que conta, o que não conta. O colaborador precisa entender como sua remuneração variável é apurada. Sem documentação, qualquer divergência de cálculo pode virar reclamação. Responsável: gestão define; RH formaliza; colaborador assina.",acoes:{r:"Elabore política de metas com metodologia em linguagem clara e colete assinatura. Prazo: 30 dias. Resp: RH/Gestores. Doc: Política de metas assinada pelo colaborador.",a:"Revise e atualize a política com acesso garantido a todos. Prazo: 20 dias. Resp: RH. Doc: Política atualizada com protocolo de recebimento."}},

      {txt:"Ausência de desvio de função sem ajuste salarial",nota:"Exemplos de desvio: (1) Auxiliar Administrativo que passa a gerir equipe; (2) Vendedor que assume supervisão; (3) Assistente que fecha contratos e gerencia fornecedores. A Súmula 159 do TST e o Art. 461 da CLT embasam condenações por diferenças salariais retroativas entre o cargo exercido e o registrado. Responsável: gestores comunicam ao RH qualquer mudança nas atividades reais.",acoes:{r:"Revise atividades reais vs. contrato. Onde houver desvio, regularize com aditivo e ajuste salarial. Prazo: 60 dias. Resp: RH/Advogado. Doc: Descrição de cargo atualizada e Termo Aditivo.",a:"Estabeleça revisão periódica das descrições de cargo com os gestores. Prazo: 30 dias. Resp: RH/Gestores. Doc: Descrição de cargo revisada semestralmente."}},

      {txt:"Verificação periódica de equiparação salarial entre cargos iguais",nota:"O colaborador tem direito ao mesmo salário de colega que exerce a mesma função na mesma empresa/localidade, com diferença de tempo na função menor que 4 anos e no emprego menor que 2 anos (Art. 461 CLT). Exemplos: duas recepcionistas com mesmas atividades com salários muito diferentes sem justificativa; dois analistas de RH com atribuições iguais e remunerações distintas. Diferença só é justificada por maior produtividade comprovada, tempo de empresa superior a 2 anos, ou Plano de Cargos e Salários (PCS) homologado. Consequências: diferenças retroativas + reflexos em férias, 13º, FGTS + eventual dano moral. Responsável: RH monitora.",acoes:{r:"Faça mapeamento salarial por cargo e corrija distorções ou documente justificativa objetiva. Prazo: 60 dias. Resp: RH/Advogado. Doc: Mapeamento salarial e PCS com critérios documentados.",a:"Implante revisão salarial anual com critérios objetivos. Prazo: 30 dias. Resp: RH. Doc: PCS ou política de revisão salarial."}},

      {txt:"Vale alimentação/refeição fornecido conforme contrato e CCT",nota:"Pode ser obrigatório pela CCT ou por concessão voluntária. Uma vez concedido, dificilmente pode ser retirado sem reclamação (Art. 468 CLT). O valor mínimo é definido pela CCT da categoria. Responsável: RH/DP verifica a CCT.",acoes:{r:"Verifique o que a CCT exige e regularize imediatamente. Prazo: 30 dias. Resp: RH/Contador. Doc: CCT arquivada e comprovantes de fornecimento.",a:"Revise anualmente o alinhamento com a CCT vigente. Prazo: 20 dias. Resp: RH/Contador. Doc: CCT atualizada e política de benefícios."}},

      {txt:"Plano de saúde com documentação de cobertura entregue ao colaborador",nota:"O colaborador precisa receber documentação clara: o que inclui, carências, rede credenciada, coparticipação, dependentes. Falta de clareza gera reclamações quando a cobertura é diferente da prometida. Responsável: RH entrega e coleta protocolo.",acoes:{r:"Entregue documento formal de cobertura a cada colaborador. Prazo: 30 dias. Resp: RH. Doc: Carta de benefícios ou guia do plano assinada.",a:"Atualize a documentação sempre que houver mudança de plano e notifique formalmente. Prazo: 15 dias. Resp: RH. Doc: Comunicado formal de alteração assinado."}},

      {txt:"Vale transporte com comprovante de solicitação e autorização do colaborador",nota:"O VT é um direito (Lei 7.418/85), mas depende de solicitação formal do colaborador com informação do itinerário. O colaborador pode dispensar — mas essa opção precisa ser registrada por escrito. O desconto em folha é limitado a 6% do salário. Responsável: RH coleta formulário; DP processa.",acoes:{r:"Colete de todos os colaboradores o formulário de solicitação ou declaração de dispensa. Prazo: 15 dias. Resp: RH/DP. Doc: Formulário de opção de vale transporte assinado.",a:"Revise periodicamente se houve mudança de endereço ou trajeto. Prazo: 20 dias. Resp: RH. Doc: Formulário de atualização de vale transporte."}},

      {txt:"13º salário pago nas datas legais com documentação de cálculo",nota:"Obrigatório para todos os CLT (Lei 4.090/62). 1ª parcela: entre fevereiro e novembro; 2ª parcela: até 20 de dezembro. Atraso gera multa administrativa e pode ser cobrado com juros em reclamação. Responsável: DP/contabilidade calcula e processa.",acoes:{r:"Regularize atrasos imediatamente. Programe datas no início do ano. Prazo: imediato. Resp: DP/Contabilidade. Doc: Comprovantes de pagamento dentro do prazo.",a:"Programe datas no início do ano com acompanhamento prévio. Prazo: 15 dias. Resp: DP/Contabilidade. Doc: Cronograma anual de pagamentos."}},

      {txt:"Férias gozadas e pagas dentro do período concessivo, com aviso de 30 dias",nota:"Férias devem ser concedidas nos 12 meses após o período aquisitivo (CLT Art. 134). Aviso com mínimo 30 dias de antecedência. Pagamento até 2 dias antes do início. Férias fora do prazo geram pagamento em dobro (Art. 137). A gestão do calendário é responsabilidade da empresa. Responsável: RH controla; gestores escalonam; DP processa.",acoes:{r:"Levante colaboradores com férias vencidas e programe imediatamente. Prazo: 30 dias. Resp: RH/DP. Doc: Aviso de férias com 30 dias de antecedência e comprovante de pagamento.",a:"Implante controle com alerta de vencimento 60 dias antes. Prazo: 20 dias. Resp: RH. Doc: Calendário de férias com alertas."}},

      {txt:"Adicionais legais (noturno, insalubridade, periculosidade) aplicados corretamente",nota:"Adicionais obrigatórios: Noturno (20% sobre hora normal entre 22h-5h — Art. 73 CLT); Insalubridade (10%, 20% ou 40% sobre salário mínimo conforme grau — NR-15); Periculosidade (30% sobre salário base — NR-16). Insalubridade e periculosidade exigem laudo técnico de engenheiro ou técnico de segurança. Não pagamento gera condenação retroativa com todos os reflexos. Responsável: técnico de segurança realiza laudo; DP processa.",acoes:{r:"Verifique com técnico de segurança e advogado se todos os adicionais devidos estão sendo pagos. Prazo: 60 dias. Resp: Técnico de Segurança/Advogado. Doc: Laudo técnico e holerites com adicionais discriminados.",a:"Revise periodicamente se mudança de função/ambiente criou novos adicionais devidos. Prazo: 30 dias. Resp: RH/Técnico de segurança. Doc: Laudo técnico atualizado."}},

      {txt:"Política de PLR/PPR com critérios documentados e homologados",nota:"O PLR é regulamentado pela Lei 10.101/2000 e precisa de acordo formal negociado com sindicato ou comissão de empregados. Tem benefício tributário (não incide contribuição previdenciária) apenas quando obedece a todos os requisitos. Sem o acordo homologado, o pagamento pode ser incorporado ao salário com todos os encargos. Responsável: advogado elabora; RH/diretoria negocia.",acoes:{r:"Elabore acordo de PLR com critérios claros e registre junto ao sindicato. Prazo: 60 dias. Resp: Advogado. Doc: Acordo de PLR homologado pelo sindicato.",a:"Revise anualmente o acordo e garanta que está vigente e registrado. Prazo: 30 dias. Resp: RH/Advogado. Doc: Acordo atualizado e homologado."}},

      {txt:"A empresa respeita as datas de pagamento do salário e do adiantamento, considerando que sábado é dia útil?",nota:"A CLT (Art. 459) determina pagamento até o 5º dia útil do mês seguinte. ATENÇÃO: sábado é dia útil para fins de pagamento de salário, mesmo que não seja dia de trabalho. Se o 5º dia útil cair em sábado, o pagamento deve ocorrer nesse dia ou ser antecipado — nunca postergado. A data do adiantamento é definida pela CCT ou política interna (não há regra universal). Atraso pode ser considerado rescisão indireta pelo colaborador (Art. 483 CLT). Na dúvida, sempre antecipe. Responsável: financeiro/DP.",acoes:{r:"Regularize imediatamente qualquer atraso. Implante calendário considerando sábados como dias úteis. Prazo: imediato. Resp: Financeiro/DP. Doc: Comprovantes dentro do prazo e calendário mensal.",a:"Programe os pagamentos com antecedência considerando finais de semana e feriados. Prazo: 15 dias. Resp: Financeiro/DP. Doc: Cronograma mensal de pagamentos."}}

    ]},

  { id:4, titulo:"Relação CLT × PJ — Risco de Vínculo", peso:3.0,

    desc:"Este é o módulo de maior risco estratégico. Nada adianta ter um contrato PJ perfeito se a prática do dia a dia for a de um empregado CLT. Em casos de reconhecimento de vínculo, a Justiça do Trabalho pesa muito mais a realidade vivida do que o documento assinado. O contrato protege — mas é a prática que condena. Se não há contratações PJ, marque todos como N/A.",

    alerta:{tipo:"danger",txt:"🚨 ALERTA — Pejotização irregular",msg:"Se qualquer item for Vermelho, acione imediatamente o jurídico. A pejotização ilícita representa o maior risco de passivo trabalhista — a condenação pode incluir todas as verbas trabalhistas retroativas desde o início da relação. Não regularize sem orientação especializada."},

    itens:[

      {txt:"Contrato PJ com cláusulas claras de autonomia e independência",nota:"O contrato PJ deve deixar claro que são duas pessoas jurídicas autônomas. Deve conter: descrição do serviço por resultado, ausência de subordinação, liberdade de horário e local, possibilidade de substituição e ausência de exclusividade. Contratos genéricos ou que copiam estrutura CLT são um risco. Responsável: advogado trabalhista elabora.",acoes:{r:"Revise ou elabore o contrato com advogado especializado em relações PJ. Prazo: 30 dias. Resp: Advogado. Doc: Contrato revisado com cláusulas de autonomia.",a:"Valide as cláusulas existentes e atualize onde necessário. Prazo: 20 dias. Resp: Advogado. Doc: Contrato revisado."}},

      {txt:"O prestador pode ser substituído sem autorização da empresa (não pessoalidade)",nota:"A pessoalidade é um dos 4 elementos do vínculo empregatício (Art. 3º CLT). Se o serviço só pode ser feito por aquela pessoa específica, isso aponta para vínculo. Em relação PJ legítima, o que importa é o resultado — o prestador poderia subcontratar ou substituir. Responsável: gestores evitam criar dependência pessoal.",acoes:{r:"Avalie se a pessoalidade existe na prática. Se sim, acione jurídico imediatamente. Prazo: imediato. Resp: Advogado. Doc: Cláusula de não pessoalidade e evidências de possibilidade de substituição.",a:"Inclua cláusula expressa de não pessoalidade no contrato. Prazo: 15 dias. Resp: Advogado. Doc: Aditivo com cláusula de não pessoalidade."}},

      {txt:"O prestador define seus próprios horários e local (ausência de controle de jornada)",nota:"Controle de horário é forte indicador de vínculo. Se a empresa define chegada, saída e local do prestador como faz com CLT, há subordinação de horário. O prestador PJ tem total liberdade para definir quando e onde trabalha, desde que entregue o resultado. Responsável: gestores eliminam qualquer controle informal de horário.",acoes:{r:"Elimine qualquer controle de horário sobre prestadores PJ. Redefina por resultado. Prazo: imediato. Resp: Gestores/RH. Doc: Comunicações que demonstrem autonomia de horário.",a:"Revise a prática diária para garantir ausência de controle informal. Prazo: 15 dias. Resp: Gestores. Doc: Política de gestão de prestadores por resultado."}},

      {txt:"Ausência de subordinação direta: PJ recebe ordens sobre RESULTADO, não sobre COMO executar",nota:"Distinção fundamental: a empresa PODE definir O QUÊ precisa ser entregue (resultado, prazo, qualidade). A empresa NÃO PODE definir COMO o prestador trabalha — metodologia, processos, ferramentas. Reuniões diárias obrigatórias, supervisão de atividades, ordens sobre o modo de trabalhar — isso é subordinação, o principal elemento do vínculo. Responsável: gestores precisam conhecer essa distinção.",acoes:{r:"Reavalie toda a relação. Se há subordinação clara, risco de vínculo é alto — acione jurídico imediatamente. Prazo: imediato. Resp: Advogado. Doc: Comunicações que comprovem gestão por resultado.",a:"Oriente gestores sobre a diferença entre resultado (permitido) e subordinação (indicador de vínculo). Prazo: 15 dias. Resp: RH/Jurídico. Doc: Política de gestão de prestadores PJ."}},

      {txt:"O prestador presta serviços para outros clientes (ausência de exclusividade)",nota:"Exclusividade é forte indicador de vínculo — dependência econômica de uma única empresa se aproxima da relação de emprego. Isso não significa que exclusividade nunca pode existir, mas combinada com outros elementos (subordinação, controle de horário, pessoalidade) reforça o reconhecimento de vínculo. Responsável: gestores e RH monitoram.",acoes:{r:"Avalie se exclusividade + outros elementos configuram risco de vínculo. Acione jurídico. Prazo: imediato. Resp: Advogado. Doc: Evidências de que o prestador atende outros clientes.",a:"Inclua cláusula de não exclusividade no contrato. Prazo: 15 dias. Resp: Advogado. Doc: Aditivo com cláusula de não exclusividade."}},

      {txt:"Emissão regular de Nota Fiscal pelo prestador",nota:"A NF é uma das evidências mais importantes da relação PJ legítima — comprova transação comercial entre duas pessoas jurídicas. Pagamento a pessoa física sem NF fragiliza a caracterização PJ. O prestador deve emitir NF para cada pagamento. Responsável: prestador emite; financeiro exige antes de pagar.",acoes:{r:"Regularize a exigência de NF para todos os pagamentos. Não pague sem NF. Prazo: imediato. Resp: Financeiro. Doc: Notas fiscais de todos os pagamentos arquivadas.",a:"Estabeleça NF como requisito para pagamento. Prazo: 15 dias. Resp: Financeiro. Doc: Política de pagamento a prestadores com exigência de NF."}},

      {txt:"O prestador não participa de reuniões obrigatórias internas como empregado",nota:"Reuniões sobre o escopo do projeto são aceitáveis. Reuniões gerais da empresa, alinhamentos de equipe, reuniões de setor obrigatórias — típicas de empregado CLT — apontam para integração do prestador à estrutura, que é um elemento de subordinação. Responsável: gestores avaliam pertinência.",acoes:{r:"Avalie se participação em reuniões caracteriza subordinação — acione jurídico se necessário. Prazo: imediato. Resp: Advogado. Doc: Política de participação limitada ao escopo contratado.",a:"Limite reuniões do prestador ao escopo do contrato. Prazo: 15 dias. Resp: Gestores. Doc: Registros de reunião com escopo relacionado ao contrato."}},

      {txt:"O prestador não usa uniforme, crachá ou e-mail institucional sem ressalvas contratuais",nota:"Uniformes, crachás e e-mail institucional integram o prestador à estrutura — visualmente indistinguível de um CLT. Isso indica que a empresa o trata como empregado na prática. Se há necessidade operacional, deve estar expressamente justificado no contrato. Responsável: RH/gestores monitoram.",acoes:{r:"Elimine uso de elementos institucionais por prestadores não previstos em contrato. Prazo: imediato. Resp: RH/Gestores. Doc: Política de identificação de prestadores distinta dos CLTs.",a:"Revise se há elementos de integração que possam ser interpretados como vínculo. Prazo: 15 dias. Resp: RH. Doc: Política de gestão de prestadores atualizada."}},

      {txt:"O prestador tem CNPJ ativo com objeto social compatível com os serviços prestados",nota:"CNPJ ativo e objeto social compatível são sinais de relação PJ legítima. Um CNPJ de serviços de limpeza contratado para TI é irregularidade. CNPJs abertos apenas para formalizar relação que seria CLT, sem estrutura empresarial real, indicam pejotização. Responsável: financeiro/RH verifica na contratação.",acoes:{r:"Verifique CNPJ e objeto social de todos os prestadores. Regularize incompatibilidades. Prazo: 15 dias. Resp: Financeiro/RH. Doc: Cartão CNPJ atualizado arquivado por prestador.",a:"Implante verificação periódica de situação cadastral e objeto social. Prazo: 15 dias. Resp: Financeiro. Doc: Relatório de situação cadastral dos prestadores."}},

      {txt:"Remuneração paga por entrega ou projeto, não por presença ou hora fixa",nota:"Remuneração por hora trabalhada ou presença fixa mensal é característico da relação de emprego. Remuneração por projeto, entrega ou resultado é característico da relação PJ. Valor fixo mensal independente do que foi entregue se assemelha a salário. Responsável: gestores/financeiro definem o modelo.",acoes:{r:"Revise o modelo de remuneração. Pagamento por presença/hora fixa = risco alto — acione jurídico. Prazo: imediato. Resp: Advogado. Doc: Contrato com remuneração por entrega/projeto.",a:"Ajuste o contrato para deixar explícito o critério de remuneração por resultado. Prazo: 15 dias. Resp: Advogado. Doc: Aditivo com modelo de remuneração revisado."}},

      {txt:"Contrato PJ revisado periodicamente por advogado trabalhista",nota:"Legislação e jurisprudência trabalhista evoluem constantemente. Um contrato de 3 anos atrás pode não contemplar decisões recentes do TST. Revisão periódica — anual ou a cada 2 anos — garante proteção atualizada. Responsável: RH agenda; advogado revisa.",acoes:{r:"Submeta todos os contratos PJ à revisão de advogado imediatamente. Prazo: 30 dias. Resp: Advogado. Doc: Contratos revisados com data de revisão.",a:"Estabeleça revisão anual obrigatória dos contratos PJ. Prazo: 30 dias. Resp: RH/Jurídico. Doc: Contratos com data de próxima revisão."}},

      {txt:"Empresa documenta a autonomia real do prestador (e-mails, registros de entrega)",nota:"Em processo trabalhista, a empresa precisará provar que a relação era autônoma. E-mails sobre resultados, relatórios de entrega, registros de projetos — formam o dossiê de evidências. Conversas com ordens sobre como trabalhar ou controle de presença devem ser evitadas. Responsável: gestores monitoram a comunicação.",acoes:{r:"Archive imediatamente e-mails, relatórios e registros que demonstrem autonomia do prestador. Prazo: imediato. Resp: Gestores/RH. Doc: Arquivo de comunicações por resultado e relatórios de entrega.",a:"Estabeleça rotina de documentação das entregas e comunicações com prestadores. Prazo: 15 dias. Resp: Gestores. Doc: Relatórios de entrega assinados e arquivados."}},

      {txt:"Ausência de promessas de conversão CLT feitas informalmente ao PJ",nota:"'Em breve você vira CLT' — promessas verbais são extremamente perigosas. Além de criar expectativa legítima, podem ser usadas em processo como evidência de que a própria empresa reconhecia que a relação deveria ser CLT desde o início. Responsável: todos os gestores.",acoes:{r:"Oriente gestores: nenhuma promessa de conversão sem aprovação formal e documento escrito. Prazo: imediato. Resp: RH/Diretoria. Doc: Política de comunicação com prestadores; orientação formal aos gestores.",a:"Formalize qualquer intenção de conversão apenas por escrito com aprovação da diretoria. Prazo: 15 dias. Resp: RH/Jurídico. Doc: Comunicado formal assinado sobre eventuais conversões."}}

    ]},

  { id:5, titulo:"Gestão de Desempenho e Advertências", peso:1.5,

    desc:"A ausência de registros sobre gestão de desempenho é o principal problema em demissões por justa causa revertidas. Advertências sem protocolo, metas não documentadas e feedbacks apenas verbais tornam a empresa vulnerável.",

    alerta:{tipo:"info",txt:"💡 Advertências sem assinatura",msg:"Quando o colaborador se recusa a assinar, não há problema. Registre a recusa com 2 testemunhas que assinem: 'O colaborador [nome] recusou-se a assinar, na presença de [testemunha 1] e [testemunha 2].' Isso confere validade jurídica ao documento."},

    itens:[

      {txt:"Advertências formalizadas por escrito com descrição clara do fato",nota:"A advertência deve conter: data, descrição objetiva do fato (sem adjetivos, apenas o ocorrido), norma interna ou CLT violada, e que se trata de advertência formal. Advertências vagas não têm valor. A Súmula 403 do TST reconhece a gradação como requisito para justa causa. Responsável: gestor identifica; RH formaliza.",acoes:{r:"Implante modelo padronizado de advertência e treine gestores sobre documentação de ocorrências. Prazo: imediato. Resp: RH/Gestores. Doc: Modelo padronizado de advertência escrita.",a:"Revise advertências já aplicadas e verifique se estão adequadamente fundamentadas. Prazo: 20 dias. Resp: RH. Doc: Advertências revisadas e arquivadas."}},

      {txt:"Advertências entregues com protocolo (assinatura ou testemunhas em caso de recusa)",nota:"A advertência só tem valor se houver registro de entrega. Se o colaborador se recusar a assinar, registre a recusa com 2 testemunhas no próprio documento. Esse protocolo confere validade jurídica mesmo sem assinatura do advertido. Responsável: RH entrega com testemunha presente.",acoes:{r:"Implante protocolo de entrega com assinatura ou registro de recusa para todas as advertências. Prazo: imediato. Resp: RH. Doc: Advertência assinada ou Termo de Recusa com 2 testemunhas.",a:"Padronize o processo e treine gestores para o protocolo de recusa. Prazo: 15 dias. Resp: RH. Doc: Protocolo interno de entrega de advertências."}},

      {txt:"Suspensões registradas no livro de empregados e na folha de pagamento",nota:"A suspensão disciplinar (máximo 30 dias — CLT Art. 474) deve ser registrada no livro de empregados e refletida na folha com o desconto correspondente. Suspensão sem desconto pode ser interpretada como formalidade vazia, enfraquecendo seu valor como prova de gradação. Responsável: RH registra; DP processa.",acoes:{r:"Regularize registros de suspensões e garanta desconto em folha. Prazo: imediato. Resp: RH/DP. Doc: Registro no livro de empregados e desconto em folha documentado.",a:"Revise registros existentes e complete lacunas. Prazo: 15 dias. Resp: RH/DP. Doc: Fichas de registro atualizadas."}},

      {txt:"Processo de demissão por justa causa com parecer jurídico prévio",nota:"A justa causa é a penalidade máxima. Os motivos estão taxativamente no Art. 482 da CLT. Aplicada incorretamente — sem prova suficiente, sem gradação ou fora do prazo de imediatidade — é facilmente revertida, gerando condenação ao pagamento de todas as verbas rescisórias + indenizações. Nunca aplique justa causa sem consulta prévia ao advogado. Responsável: advogado emite parecer; diretoria decide; RH executa.",acoes:{r:"Nenhuma demissão por justa causa sem parecer jurídico prévio por escrito. Prazo: imediato. Resp: Advogado. Doc: Parecer jurídico escrito antes de qualquer justa causa.",a:"Estabeleça política de aprovação jurídica obrigatória antes de qualquer justa causa. Prazo: 15 dias. Resp: RH/Diretoria. Doc: Política de aprovação de demissão por justa causa."}},

      {txt:"Metas de desempenho estabelecidas por escrito e comunicadas formalmente",nota:"Metas comunicadas apenas verbalmente não servem como base para ações disciplinares. Para que o não cumprimento justifique medidas, as metas precisam ser documentadas, razoáveis e formalmente aceitas pelo colaborador. Responsável: gestor define; RH formaliza; colaborador assina.",acoes:{r:"Formalize metas de todos os colaboradores por escrito imediatamente. Prazo: 30 dias. Resp: Gestores/RH. Doc: Carta de metas ou Acordo de Desempenho assinado.",a:"Revise e atualize metas periodicamente com registro formal. Prazo: 20 dias. Resp: Gestores. Doc: Carta de metas atualizada e assinada."}},

      {txt:"Avaliações de desempenho periódicas documentadas e assinadas pelo colaborador",nota:"Avaliações periódicas criam histórico documentado de desempenho — fundamental em demissões por baixo desempenho. Comprovam que os problemas eram recorrentes, que o colaborador tinha ciência e que a empresa tomou medidas. A assinatura do colaborador é essencial — sem ela, o documento não prova que ele teve ciência do resultado. Responsável: gestor avalia; RH formaliza.",acoes:{r:"Implante processo formal de avaliação com periodicidade, formulário e assinatura. Prazo: 60 dias. Resp: RH/Gestores. Doc: Formulário de avaliação assinado por gestor e colaborador.",a:"Garanta que avaliações existentes estão sendo arquivadas e assinadas. Prazo: 20 dias. Resp: RH. Doc: Formulários de avaliação arquivados no prontuário."}},

      {txt:"Feedbacks críticos registrados por escrito e não apenas verbais",nota:"Feedbacks apenas verbais não existem juridicamente. Quando a empresa demite por problemas de conduta abordados só em conversas informais, não há como provar que o colaborador foi alertado. O registro pode ser simples: um e-mail após a conversa — 'Conforme conversamos hoje, registro que...' — já cria evidência documental. Responsável: gestores registram por escrito.",acoes:{r:"Oriente gestores a registrar todo feedback crítico por escrito, mesmo os informais. Prazo: imediato. Resp: Gestores/RH. Doc: E-mails ou formulários de feedback arquivados no prontuário.",a:"Implante cultura de registro de feedbacks e treine gestores. Prazo: 20 dias. Resp: RH. Doc: Política de feedback com orientações de registro."}},

      {txt:"PIP (Plano de Melhoria de Desempenho) com prazos, critérios e suporte documentados",nota:"O PIP deve conter: descrição objetiva do problema, expectativas de melhoria mensuráveis, prazo determinado (30 a 90 dias), suporte oferecido (treinamento, acompanhamento) e consequências claras. Deve ser assinado pelo colaborador — se recusar, use o protocolo de testemunhas. Um PIP bem documentado é uma das melhores defesas em demissão por baixo desempenho. Responsável: gestor e RH elaboram; colaborador assina.",acoes:{r:"Elabore modelo de PIP e aplique para colaboradores com desempenho abaixo do esperado. Prazo: 30 dias. Resp: RH/Gestores. Doc: PIP assinado com prazos, critérios, suporte e consequências.",a:"Revise PIPs existentes e garanta que estão completos e assinados. Prazo: 20 dias. Resp: RH. Doc: PIP revisado e assinado."}},

      {txt:"Gradação de penalidades aplicada: advertência verbal → escrita → suspensão → justa causa",nota:"A gradação é o princípio que exige progressão das sanções antes da justa causa. A CLT não exige expressamente para todos os casos — faltas gravíssimas podem ensejar justa causa direta — mas para faltas menores, a Justiça do Trabalho exige gradação. A falta de gradação é o principal motivo de reversão de justa causa. Responsável: RH e gestores seguem a política disciplinar.",acoes:{r:"Implante política disciplinar com gradação formal e treine gestores. Prazo: 30 dias. Resp: RH. Doc: Política disciplinar con gradação distribuída aos gestores.",a:"Revise casos anteriores e confirme que a gradação foi respeitada. Prazo: 20 dias. Resp: RH. Doc: Histórico disciplinar revisado."}},

      {txt:"Dossiê do colaborador organizado com histórico de ocorrências documentadas",nota:"O dossiê reúne toda a trajetória do colaborador — advertências, avaliações, feedbacks, PIPs. É o principal instrumento de defesa da empresa em processo trabalhista. Um dossiê bem organizado pode ser a diferença entre ganhar e perder uma reclamação. Responsável: RH mantém e atualiza continuamente.",acoes:{r:"Monte dossiê completo de cada colaborador com todo o histórico disponível. Prazo: 60 dias. Resp: RH. Doc: Pasta individual com advertências, avaliações, feedbacks e PIPs.",a:"Garanta que novos documentos são incluídos imediatamente após cada ocorrência. Prazo: 15 dias. Resp: RH. Doc: Dossiê atualizado por colaborador."}},

      {txt:"Quando a empresa demite por motivo específico, existe histórico documental que comprova esse motivo?",nota:"Esta pergunta se aplica a qualquer demissão motivada — não apenas justa causa. Demitir com causa real mas sem documentação é tão arriscado quanto demitir sem motivo. Se não há nada registrado, na Justiça a demissão parecerá arbitrária. O colaborador pode alegar: discriminação por doença, gravidez, sindicalização ou retaliação por denúncia. Sem papéis, só existe a versão do colaborador. Toda demissão motivada precisa de histórico que conte a mesma história que a empresa contará no processo. Responsável: RH verifica o dossiê antes de qualquer demissão.",acoes:{r:"Não realize demissão motivada sem histórico documental. Se já ocorreu sem documentação, consulte o jurídico. Prazo: imediato. Resp: Advogado. Doc: Dossiê com advertências, avaliações e PIPs que sustente a decisão.",a:"Antes de qualquer demissão motivada, verifique se o dossiê sustenta a decisão. Prazo: imediato para próximas demissões. Resp: RH/Jurídico. Doc: Dossiê completo revisado antes da demissão."}}

    ]},

  { id:6, titulo:"Saúde, Segurança e Assédio", peso:2.5,

    desc:"Processos por dano moral, assédio e acidente de trabalho estão entre as condenações de maior valor. O que parece custo extra é na verdade segurança: PGR e PCMSO corretos indicam quais EPIs são necessários e quais exames devem ser feitos — quando bem executados, blindam a empresa em discussões de doença ocupacional.",

    alerta:{tipo:"info",txt:"💡 Canal de denúncia — por que é fundamental",msg:"A existência de canal formal de denúncia prova que a empresa adotou medidas preventivas. Sua ausência pode ser interpretada como omissão intencional em casos de assédio, aumentando o valor das condenações. Pode ser um e-mail específico, plataforma ou ouvidoria — o importante é que seja documentado e acessível."},

    itens:[

      {txt:"PCMSO (Programa de Controle Médico de Saúde Ocupacional) elaborado e vigente",nota:"Obrigatório para todas as empresas com empregados CLT (NR-7). Define quais exames os colaboradores devem realizar e com que periodicidade, baseado nos riscos identificados no PGR. Documenta o estado de saúde desde a admissão — essencial para afastar alegações de doenças ocupacionais. Sem PCMSO: autuações do MTE e sem defesa em ações de doença. Responsável: médico do trabalho elabora.",acoes:{r:"Contrate médico do trabalho e elabore o PCMSO. Prazo: 30 dias. Resp: RH/Médico do Trabalho. Doc: PCMSO assinado pelo médico responsável e datado.",a:"Revise anualmente ou quando houver mudança nas atividades. Prazo: 20 dias. Resp: Médico do Trabalho. Doc: PCMSO atualizado."}},

      {txt:"PGR (Programa de Gerenciamento de Riscos) em vigor",nota:"Substituiu o PPRA desde janeiro de 2022, obrigatório para todas as empresas com CLT (NR-1). Mapeia todos os riscos: físicos (ruído, calor), químicos (poeiras, gases), biológicos, ergonômicos e de acidentes. Indica quais EPIs são necessários e alimenta o PCMSO sobre quais exames realizar. PGR e PCMSO precisam estar alinhados. Empresas com ambos têm defesa muito mais sólida em ações de acidente e doença ocupacional. Responsável: técnico ou engenheiro de segurança.",acoes:{r:"Contrate profissional de segurança e elabore o PGR. Prazo: 30 dias. Resp: Técnico/Engenheiro de Segurança. Doc: PGR elaborado e assinado com inventário de riscos.",a:"Revise quando houver mudança nas atividades, processos ou instalações. Prazo: 20 dias. Resp: Técnico de Segurança. Doc: PGR atualizado."}},

      {txt:"ASO realizado nas 4 modalidades: admissional, periódico, retorno e demissional",nota:"NR-7 exige ASO em 4 momentos: (1) Admissional — antes do início; (2) Periódico — frequência definida pelo PCMSO; (3) Retorno — após afastamento por doença por mais de 30 dias; (4) Demissional — na rescisão. O ASO demissional é especialmente importante — registra o estado de saúde na saída, fundamental para afastar alegações de doenças desenvolvidas no trabalho. Responsável: RH agenda; médico do trabalho emite.",acoes:{r:"Regularize todos os ASOs pendentes. Prazo: 15 dias. Resp: RH. Doc: ASO de cada modalidade emitido por médico do trabalho.",a:"Implante calendário de ASOs periódicos com alertas de vencimento. Prazo: 20 dias. Resp: RH. Doc: Calendário de ASOs e prontuários atualizados."}},

      {txt:"CIPA constituída quando exigida pelo número de colaboradores e atividade",nota:"A CIPA é obrigatória conforme o Quadro I da NR-5, que cruza número de empregados com grau de risco da atividade (CNAE). A legislação foi atualizada em 2023 para incluir também prevenção ao assédio no escopo da CIPA. Para saber se sua empresa é obrigada, consulte o técnico de segurança pelo CNAE. Empresas obrigadas sem CIPA ficam expostas a autuações e vulneráveis em processos de acidente. Responsável: RH/Direção constituem.",acoes:{r:"Verifique obrigatoriedade e constitua a CIPA imediatamente se necessário. Prazo: 30 dias. Resp: RH/Técnico de Segurança. Doc: Ata de constituição e eleição da CIPA e registro no MTE.",a:"Revise anualmente a obrigatoriedade, especialmente após mudanças no quadro de pessoal. Prazo: 20 dias. Resp: RH. Doc: Ata de eleição atualizada."}},

      {txt:"EPIs fornecidos com comprovante de recebimento assinado",nota:"EPIs são obrigatórios quando os riscos do PGR não puderem ser eliminados por medidas coletivas. A empresa deve: fornecer gratuitamente, orientar sobre uso correto e manter ficha de EPI assinada. Sem a ficha: em acidente ou doença, a empresa não prova que forneceu proteção. Responsável: técnico de segurança define EPIs necessários; RH mantém controle.",acoes:{r:"Entregue os EPIs indicados no PGR e colete assinatura de recebimento de cada colaborador. Prazo: imediato. Resp: RH/Gestores. Doc: Ficha de EPI assinada com descrição do equipamento e data.",a:"Revise periodicamente uso e necessidade de reposição, atualizando a ficha. Prazo: 20 dias. Resp: Gestores. Doc: Ficha de EPI atualizada com reposições registradas."}},

      {txt:"Treinamentos de saúde e segurança realizados com lista de presença arquivada",nota:"Treinamentos obrigatórios (NRs específicas de cada atividade) devem ser realizados com lista de presença assinada e, quando aplicável, certificado emitido. A lista é a prova de que o colaborador foi treinado — essencial em casos de acidentes onde o colaborador alega que não foi orientado. Responsável: RH com apoio de técnico de segurança.",acoes:{r:"Realize os treinamentos obrigatórios e archive listas de presença. Prazo: 60 dias. Resp: RH/Técnico de Segurança. Doc: Lista de presença assinada e certificados de treinamento.",a:"Implante calendário anual de treinamentos com controle de participação. Prazo: 20 dias. Resp: RH. Doc: Calendário de treinamentos e listas arquivadas."}},

      {txt:"Política de prevenção ao assédio moral e sexual publicada e de conhecimento de todos",nota:"A empresa tem obrigação de adotar medidas preventivas ao assédio. A política deve definir: o que é assédio, como denunciar, como a empresa investigará e as consequências para o agressor. Deve ser assinada por todos os colaboradores. Responsável: RH com apoio jurídico elabora; todos assinam.",acoes:{r:"Elabore e publique a política de prevenção ao assédio e colete assinatura de todos. Prazo: 30 dias. Resp: RH/Advogado. Doc: Política assinada por todos os colaboradores.",a:"Revise anualmente e garanta que novos colaboradores assinam no onboarding. Prazo: 20 dias. Resp: RH. Doc: Política atualizada com protocolos de recebimento."}},

      {txt:"Canal de denúncia de assédio ativo, acessível e com garantia de anonimato",nota:"O canal formal de denúncia é a prova de que a empresa adotou medidas preventivas. Sua ausência pode ser interpretada como omissão intencional em casos de assédio, aumentando o valor das condenações. Pode ser um e-mail específico, plataforma digital ou ouvidoria. O importante: documentado, acessível e que cada denúncia receba tratamento formal. Responsável: RH/Diretoria.",acoes:{r:"Implante canal de denúncia imediatamente. Prazo: 15 dias. Resp: RH/Diretoria. Doc: Política do canal publicada e comunicada a todos os colaboradores.",a:"Avalie se o canal atual garante anonimato e se os colaboradores o conhecem. Prazo: 15 dias. Resp: RH. Doc: Comunicado de divulgação do canal com instruções."}},

      {txt:"Procedimento interno de investigação de denúncias documentado",nota:"Toda denúncia recebida deve ter tratamento formal: registro, investigação com prazo definido, apuração dos fatos, conclusão documentada e encaminhamento. A ausência de procedimento formal — ou de registro das investigações realizadas — deixa a empresa sem defesa quando o denunciante alega que a empresa não tomou providências. Responsável: RH com apoio jurídico.",acoes:{r:"Elabore procedimento formal de investigação com etapas e prazos definidos. Prazo: 30 dias. Resp: RH/Advogado. Doc: Política de investigação de denúncias com fluxo documentado.",a:"Revise o procedimento e garanta que está sendo seguido em todos os casos. Prazo: 20 dias. Resp: RH. Doc: Registros de investigações realizadas arquivados."}},

      {txt:"Código de Conduta publicado e assinado por todos os colaboradores",nota:"O Código de Conduta define os valores, padrões éticos e comportamentos esperados na empresa. A assinatura de cada colaborador comprova que ele conhece e se compromete com as regras. É um dos documentos fundamentais em defesas de casos de assédio e demissão por justa causa. Responsável: RH com apoio jurídico elabora.",acoes:{r:"Elabore o Código de Conduta e colete assinatura de todos. Prazo: 60 dias. Resp: RH/Advogado. Doc: Código de Conduta assinado por cada colaborador.",a:"Revise anualmente e garanta que novos colaboradores assinam no onboarding. Prazo: 20 dias. Resp: RH. Doc: Código atualizado com protocolos de recebimento."}},

      {txt:"Acidentes de trabalho registrados e CAT emitida",nota:"Em caso de acidente de trabalho, a empresa deve emitir a CAT (Comunicação de Acidente de Trabalho) no primeiro dia útil após o acidente. A não emissão é infração administrativa. A CAT também é fundamental para a cobertura previdenciária do colaborador. Responsável: RH/DP emite; gestor comunica imediatamente.",acoes:{r:"Regularize emissão de CATs pendentes — prazo legal é o primeiro dia útil após o acidente. Prazo: imediato. Resp: RH/DP. Doc: CAT emitida e protocolada no INSS.",a:"Implante procedimento claro de registro e comunicação de acidentes para gestores e RH. Prazo: 15 dias. Resp: RH. Doc: Procedimento de registro de acidente e CAT."}},

      {txt:"Ausência de queixas não investigadas ou sem resposta formal",nota:"Queixas recebidas e não investigadas formalmente são um dos maiores riscos em processos de assédio. Se o colaborador prova que denunciou e a empresa não tomou providências, isso configura omissão — aumentando significativamente o valor da condenação. Toda queixa deve ter registro de recebimento, investigação e conclusão documentada. Responsável: RH garante o tratamento.",acoes:{r:"Levante todas as queixas não formalmente investigadas e inicie o processo imediatamente. Prazo: imediato. Resp: RH/Advogado. Doc: Registro de investigação de cada queixa com resultado e encaminhamento.",a:"Revise o histórico e garanta que todas tiveram resposta formal documentada. Prazo: 20 dias. Resp: RH. Doc: Arquivo de queixas com status de investigação e resolução."}},

      {txt:"Gestores treinados para identificar e agir sobre situações de assédio e conflito",nota:"Gestores são a principal linha de prevenção ao assédio. Sem treinamento, muitas situações são ignoradas, minimizadas ou mal gerenciadas — o que pode agravar o dano e aumentar a responsabilidade da empresa. O treinamento deve cobrir: o que é assédio, como identificar sinais, como receber uma denúncia e como encaminhar. Responsável: RH.",acoes:{r:"Realize treinamento obrigatório sobre assédio para todos os gestores. Prazo: 60 dias. Resp: RH. Doc: Lista de presença e certificado de treinamento por gestor.",a:"Inclua o tema no programa anual de desenvolvimento de lideranças. Prazo: 30 dias. Resp: RH. Doc: Calendário de treinamentos e listas de presença."}},

      {txt:"A empresa está adequada à NR-1 atualizada, incluindo identificação de riscos psicossociais?",nota:"A atualização da NR-1 (em vigor desde maio de 2025) exige que as empresas incluam no PGR a avaliação dos riscos psicossociais — fatores como excesso de trabalho, assédio moral, pressão excessiva por metas, conflitos e falta de autonomia que causam danos à saúde mental. Na prática: mapear esses riscos, adotar medidas preventivas e documentar tudo. Não cumprimento expõe a empresa a autuações e enfraquece defesa em processos de dano moral e doença ocupacional relacionados à saúde mental. Responsável: técnico de segurança com apoio de psicólogo organizacional.",acoes:{r:"Inclua avaliação de riscos psicossociais no PGR com profissional habilitado. Prazo: 60 dias. Resp: Técnico de Segurança/Psicólogo Organizacional. Doc: PGR atualizado com mapeamento de riscos psicossociais.",a:"Revise o PGR e verifique se os riscos psicossociais estão mapeados com medidas preventivas. Prazo: 30 dias. Resp: Técnico de Segurança. Doc: PGR atualizado."}}

    ]},

  { id:7, titulo:"Rescisão e Offboarding", peso:2.5,

    desc:"A fase de rescisão concentra grande parte das reclamações trabalhistas. Prazos não cumpridos, verbas incorretas e documentação incompleta são erros evitáveis com um processo de offboarding estruturado.",

    alerta:{tipo:"warn",txt:"💡 Consistência do motivo da rescisão",msg:"A inconsistência entre o tipo de rescisão registrado e o motivo real é facilmente identificada em processo trabalhista e cria presunção de má-fé. Certifique-se of motivo interno é consistente com o tipo de rescisão formal."},

    itens:[

      {txt:"Aviso prévio comunicado por escrito com protocolo de recebimento",nota:"O aviso prévio deve ser sempre comunicado por escrito — pela empresa ou pelo colaborador. Sem protocolo de recebimento (assinatura ou testemunhas), a data de início do aviso pode ser contestada, o que impacta diretamente o cálculo das verbas rescisórias. Responsável: RH comunica por escrito.",acoes:{r:"Implante modelo padrão de aviso prévio com protocolo de recebimento. Prazo: imediato. Resp: RH/DP. Doc: Aviso prévio assinado pelo colaborador ou com testemunhas em caso de recusa.",a:"Padronize o processo e treine o RH para nunca comunicar rescisão apenas verbalmente. Prazo: 15 dias. Resp: RH. Doc: Modelo padronizado de aviso prévio."}},

      {txt:"Verbas rescisórias pagas no prazo de 10 dias corridos após o último dia do aviso",nota:"A CLT (Art. 477) determina pagamento das verbas em até 10 dias corridos após o término do contrato. Atraso gera multa de 1 salário do colaborador. O prazo é contado a partir do último dia de trabalho efetivo — inclusive em caso de aviso indenizado, o prazo começa no dia em que o aviso seria encerrado. Responsável: DP/contabilidade calcula e processa.",acoes:{r:"Regularize pagamentos em atraso imediatamente — há multa de 1 salário por atraso. Prazo: imediato. Resp: DP/Contabilidade. Doc: Comprovante de pagamento dentro do prazo.",a:"Programe o cálculo e pagamento assim que o aviso for comunicado. Prazo: próximas rescisões. Resp: DP/Contabilidade. Doc: Cronograma de rescisão por colaborador."}},

      {txt:"Prazo contado a partir do último dia de trabalho efetivo",nota:"O prazo de 10 dias para pagamento das verbas rescisórias começa no último dia de trabalho efetivo — seja no final do período de aviso trabalhado, seja na data de término calculada quando o aviso é indenizado. Erro no marco inicial do prazo é um dos erros mais comuns que geram a multa do Art. 477. Responsável: DP/contabilidade verifica a data correta.",acoes:{r:"Revise o processo de cálculo do prazo e corrija erros identificados. Prazo: imediato. Resp: DP/Contabilidade. Doc: Planilha de controle de prazos rescisórios por caso.",a:"Implante checklist de rescisão com verificação do marco inicial do prazo. Prazo: 15 dias. Resp: DP. Doc: Checklist de rescisão com datas documentadas."}},

      {txt:"Cálculo rescisório revisado antes do pagamento",nota:"O cálculo rescisório envolve múltiplas verbas: saldo de salário, aviso prévio, 13º proporcional, férias proporcionais + 1/3, FGTS + multa de 40% (quando aplicável), horas extras, banco de horas. Um erro no cálculo — para menos — gera reclamação e multa. Um erro para mais não pode ser descontado depois sem o consentimento do colaborador. Responsável: DP/contabilidade calcula; RH valida antes do pagamento.",acoes:{r:"Implante revisão obrigatória do cálculo antes de qualquer pagamento rescisório. Prazo: imediato. Resp: DP/Contador com validação do RH. Doc: Memória de cálculo rescisório revisada e arquivada.",a:"Estabeleça checklist de verificação do cálculo rescisório para o DP. Prazo: 15 dias. Resp: DP/Contador. Doc: Checklist de rescisão preenchido e assinado."}},

      {txt:"Guias de FGTS e INSS geradas e pagas corretamente na rescisão",nota:"Na rescisão, além do pagamento das verbas, a empresa deve gerar e pagar as guias de FGTS (com a multa rescisória quando cabível) e INSS sobre as verbas rescisórias tributáveis. O erro ou atraso nessas guias gera multa administrativa e pode bloquear o saque do FGTS pelo colaborador. Responsável: DP/contabilidade.",acoes:{r:"Regularize guias pendentes imediatamente. Prazo: imediato. Resp: DP/Contabilidade. Doc: Guias GRRF e GFIP/eSocial pagas e comprovadas.",a:"Inclua verificação das guias no checklist de rescisão. Prazo: 15 dias. Resp: DP/Contabilidade. Doc: Comprovantes de pagamento das guias arquivados."}},

      {txt:"TRCT (Termo de Rescisão) assinado pelo colaborador com cópia entregue",nota:"O TRCT é o documento que formaliza a rescisão e discrimina todas as verbas pagas. Deve ser assinado pelo colaborador — que tem direito a uma cópia. Sem a assinatura no TRCT, não há prova de que o colaborador recebeu e concordou com os valores pagos. Responsável: RH/DP.",acoes:{r:"Nunca finalize rescisão sem TRCT assinado e cópia entregue ao colaborador. Prazo: imediato. Resp: RH/DP. Doc: TRCT assinado por ambas as partes com protocolo de entrega da cópia.",a:"Implante checklist de documentos a entregar no desligamento. Prazo: 15 dias. Resp: RH/DP. Doc: Checklist de offboarding assinado pelo colaborador."}},

      {txt:"Baixa na CTPS realizada no prazo legal",nota:"A baixa na CTPS deve ser feita no prazo legal após a rescisão. O atraso na baixa impede o colaborador de iniciar novo emprego formal e pode gerar reclamação trabalhista. Com o eSocial, a baixa é processada digitalmente. Responsável: DP/contabilidade.",acoes:{r:"Realize a baixa imediatamente para rescisões pendentes. Prazo: imediato. Resp: DP/Contabilidade. Doc: CTPS com baixa ou comprovante de atualização no eSocial.",a:"Inclua baixa da CTPS como etapa obrigatória no checklist de rescisão. Prazo: 15 dias. Resp: DP. Doc: CTPS atualizada ou comprovante eSocial."}},

      {txt:"Documentos do INSS entregues ao colaborador",nota:"Na rescisão, o colaborador tem direito a receber documentos necessários para solicitar benefícios previdenciários se necessário. A não entrega pode gerar reclamação e danos ao colaborador que ficou sem acesso a benefícios. Responsável: DP/contabilidade prepara e entrega.",acoes:{r:"Entregue os documentos pendentes imediatamente. Prazo: imediato. Resp: DP/Contabilidade. Doc: Extrato do FGTS e demais documentos com protocolo de entrega.",a:"Inclua entrega dos documentos no checklist de offboarding. Prazo: 15 dias. Resp: DP. Doc: Checklist com protocolo de entrega assinado."}},

      {txt:"Entrevista de desligamento realizada e documentada (não aplicável em justa causa)",nota:"A entrevista de desligamento colhe a percepção do colaborador sobre sua passagem pela empresa e pode identificar problemas sistêmicos antes que virem reclamações. Quando documentada, serve também como evidência de que a empresa se preocupou com o processo de saída. Não se aplica em demissões por justa causa — o contexto não é adequato. Responsável: RH realiza.",acoes:{r:"Implante entrevista de desligamento documentada para rescisões sem justa causa. Prazo: 30 dias. Resp: RH. Doc: Formulário de entrevista de desligamento preenchido e arquivado.",a:"Revise o processo e garanta que os registros estão sendo arquivados. Prazo: 20 dias. Resp: RH. Doc: Formulário arquivado no dossiê do ex-colaborador."}},

      {txt:"Devolução de equipamentos e revogação de acessos digitais e físicos documentadas no mesmo dia",nota:"A revogação de acessos digitais (sistemas, e-mail, VPN) e físicos (crachá, chaves) deve ocorrer no mesmo dia do desligamento. O acesso de um ex-colaborador aos sistemas da empresa após o desligamento é um risco de segurança e pode gerar responsabilidade da empresa por eventual uso indevido. Responsável: RH/TI executam; gestor supervisiona.",acoes:{r:"Implante checklist de offboarding com todos os equipamentos e acessos a revogar no dia do desligamento. Prazo: imediato. Resp: RH/TI. Doc: Checklist de devolução e revogação assinado no dia do desligamento.",a:"Revise o processo e garanta que a revogação ocorre no mesmo dia. Prazo: 15 dias. Resp: RH/TI. Doc: Checklist de offboarding atualizado."}},

      {txt:"Ausência de pagamentos extras ou ajustes fora do TRCT",nota:"Pagamentos feitos fora do TRCT sem justificativa jurídica podem ser interpretados como reconhecimento de dívida trabalhista, abrindo precedente para novas cobranças. Todo pagamento a ex-colaborador deve estar documentado e juridicamente fundamentado. Responsável: financeiro com aprovação jurídica.",acoes:{r:"Nunca realize pagamentos a ex-colaboradores fora do TRCT sem orientação jurídica. Prazo: imediato. Resp: Financeiro/Advogado. Doc: Qualquer pagamento adicional documentado e juridicamente fundamentado.",a:"Implante política que exige aprovação do RH e jurídico antes de qualquer pagamento a ex-colaboradores. Prazo: 15 dias. Resp: Financeiro/RH. Doc: Política de pagamentos rescisórios."}},

      {txt:"Dossiê do ex-colaborador arquivado por mínimo de 5 anos",nota:"O prazo para ajuizar reclamação trabalhista é de 2 anos após o desligamento, podendo pleitear os últimos 5 anos do contrato. A empresa pode precisar de documentos de até 7 anos atrás. O descarte antecipado elimina a defesa. Responsável: RH/DP organiza arquivo.",acoes:{r:"Organize e archive dossiês de todos os ex-colaboradores dos últimos 5 anos. Prazo: 60 dias. Resp: RH/DP. Doc: Arquivo físico ou digital completo por ex-colaborador.",a:"Implante política de retenção de documentos trabalhistas com mínimo de 5 anos. Prazo: 20 dias. Resp: RH. Doc: Política de retenção de documentos."}},

      {txt:"Motivo da demissão documentado internamente e consistente com o tipo de rescisão registrado",nota:"A inconsistência entre o tipo de rescisão registrado e o motivo real é facilmente identificada em processo trabalhista e cria presunção de má-fé. Exemplos de inconsistência: registrar 'sem justa causa' quando o motivo real foi falta grave não documentada; registrar 'pedido de demissão' quando foi pressão para pedir. Toda demissão deve ter o motivo real documentado internamente, consistente com o que foi registrado formalmente. Responsável: RH/advogado definem o tipo correto antes de qualquer comunicação.",acoes:{r:"Nunca registre tipo de rescisão que não reflita o motivo real — consulte o jurídico antes. Prazo: imediato. Resp: Advogado. Doc: Registro interno do motivo real da demissão consistente com o tipo formal.",a:"Estabeleça aprovação obrigatória do RH e jurídico antes de qualquer rescisão. Prazo: 15 dias. Resp: RH/Advogado. Doc: Política de aprovação de rescisões."}}

    ]}

];

const STATUS = [

  {key:"v",emoji:"🟢",label:"Verde",    on:"background:#dcfce7;color:#166534;border-color:#86efac"},

  {key:"a",emoji:"🟡",label:"Amarelo",  on:"background:#fef3c7;color:#92400e;border-color:#fcd34d"},

  {key:"r",emoji:"🔴",label:"Vermelho", on:"background:#fee2e2;color:#991b1b;border-color:#fca5a5"},

  {key:"n",emoji:"⬜",label:"N/A",      on:"background:#f1f5f9;color:#475569;border-color:#cbd5e1"},

];

function calcScore(R, modId) {

  let v=0,t=0;

  Object.values(R[modId]||{}).forEach(x=>{if(!x||x==="n")return;t++;if(x==="v")v++;});

  return t===0?null:Math.round(v/t*100);

}

function nivel(s){return s>=71?"v":s>=41?"a":"r";}

const NS={

  v:{pill:"background:#dcfce7;color:#166534",bar:"background:#22c55e",txt:"color:#166534",label:"🟢 Conformidade"},

  a:{pill:"background:#fef3c7;color:#92400e",bar:"background:#f59e0b",txt:"color:#d97706",label:"🟡 Atenção"},

  r:{pill:"background:#fee2e2;color:#991b1b",bar:"background:#ef4444",txt:"color:#991b1b",label:"🔴 Crítico"},

};

export default function App(){

  const total=MODS.reduce((s,m)=>s+m.itens.length,0);

  const [R,setR]=useState(()=>{

    const r={};

    MODS.forEach(m=>{r[m.id]={};m.itens.forEach((_,i)=>r[m.id][i]=null);});

    return r;

  });

  const [abertos,setAbertos]=useState({1:true});

  const [empresa,setEmpresa]=useState({razao:"",cnpj:"",resp:"",cargo:""});

  const [tela,setTela]=useState("form");

  const [relatorio,setRelatorio]=useState(null);

  const [notaAberta,setNotaAberta]=useState({});

  const respondidos=Object.values(R).reduce((s,m)=>s+Object.values(m).filter(x=>x!==null).length,0);

  const pct=Math.round(respondidos/total*100);

  function setStatus(mId,idx,key){

    setR(p=>({...p,[mId]:{...p[mId],[idx]:p[mId][idx]===key?null:key}}));

  }

  function toggleNota(key){setNotaAberta(p=>({...p,[key]:!p[key]}));}

  function gerar(){

    let soma=0,aval=0,tv=0,ta=0,tr=0;

    const scores={};

    MODS.forEach(m=>{

      const s=calcScore(R,m.id);

      scores[m.id]=s;

      if(s!==null){soma+=s*m.peso;aval+=m.peso;}

      Object.values(R[m.id]).forEach(x=>{if(x==="v")tv++;else if(x==="a")ta++;else if(x==="r")tr++;});

    });

    const geral=aval>0?Math.round(soma/aval):0;

    const criticos=[];

    MODS.forEach(m=>m.itens.forEach((item,i)=>{

      const x=R[m.id][i];

      if(x==="r")criticos.push({mod:m.titulo,txt:item.txt,acao:item.acoes.r,p:1});

      else if(x==="a")criticos.push({mod:m.titulo,txt:item.txt,acao:item.acoes.a,p:2});

    }));

    setRelatorio({scores,geral,soma,aval,tv,ta,tr,criticos});

    setTela("relatorio");

  }

  const S={

    page:{fontFamily:"system-ui,sans-serif",background:"#f1f5f9",minHeight:"100vh"},

    card:{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:12},

    cardHead:{padding:"14px 16px",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:10},

    label:{fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:.5,marginBottom:4,display:"block"},

    input:{border:"1px solid #e2e8f0",borderRadius:8,padding:"9px 11px",fontSize:13,fontFamily:"inherit",color:"#1e293b",outline:"none",width:"100%"},

    nota:{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#0c4a6e",lineHeight:1.6,marginTop:8},

    notaBtn:{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"3px 8px",fontSize:11,color:"#64748b",cursor:"pointer",marginTop:6,fontFamily:"inherit"},

  };

  if(tela==="relatorio"&&relatorio){

    const {scores,geral,tv,ta,tr,criticos}=relatorio;

    const ng=nivel(geral);const ns=NS[ng];

    const hoje=new Date().toLocaleDateString("pt-BR");

    const interps={

      r:"A empresa está em situação de alta exposição ao passivo trabalhista. Recomenda-se acionar imediatamente o departamento jurídico e iniciar o plano de ação com foco nos itens VERMELHO. Cada item crítico sem resolução representa risco financeiro e jurídico imediato.",

      a:"Existem lacunas significativas que aumentam o risco de reclamações trabalhistas. O plano de ação deve ser iniciado em 30 dias, priorizando os módulos com menor score. Avalie a necessidade de acionar o jurídico para os itens críticos.",

      v:"A empresa possui nível satisfatório de conformidade administrativa. O foco deve ser na eliminação dos itens amarelos remanescentes e na criação de rotinas de revisão periódica a cada 6 meses.",

    };

    return(

      <div style={S.page}>

        <div style={{background:"linear-gradient(135deg,#0f2744,#1a4a8a)",borderRadius:14,margin:12,padding:"28px 20px",textAlign:"center"}}>

          <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:4}}>Relatório de CheckUp Trabalhista</div>

          <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginBottom:8}}>{empresa.razao||"Empresa"} · {empresa.resp||"Responsável"} · {hoje}</div>

          <div style={{fontSize:60,fontWeight:700,color:"#fff",lineHeight:1,margin:"12px 0 10px"}}>{geral}%</div>

          <span style={{display:"inline-block",padding:"6px 18px",borderRadius:30,fontSize:13,fontWeight:700,...Object.fromEntries(ns.pill.split(";").filter(Boolean).map(s=>{const[k,v]=s.split(":");return[k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v.trim()];}))}}>{ns.label}</span>

        </div>

        <div style={{padding:"0 12px",maxWidth:860,margin:"0 auto"}}>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>

            {[{n:tv,l:"🟢 Conformes",c:"#166534"},{n:ta,l:"🟡 Atenção",c:"#d97706"},{n:tr,l:"🔴 Críticos",c:"#991b1b"}].map((s,i)=>(

              <div key={i} style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"14px 8px",textAlign:"center"}}>

                <div style={{fontSize:28,fontWeight:700,color:s.c,lineHeight:1,marginBottom:4}}>{s.n}</div>

                <div style={{fontSize:11,color:"#64748b"}}>{s.l}</div>

              </div>

            ))}

          </div>

          <div style={S.card}>

            <div style={{...S.cardHead,fontSize:12,fontWeight:600,color:"#64748b",textTransform:"uppercase"}}>Score Ponderado por Módulo</div>

            <div style={{padding:"4px 16px"}}>

              {MODS.map(m=>{

                const s=scores[m.id];

                if(s===null)return(<div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0",borderBottom:"1px solid #f8fafc",flexWrap:"wrap"}}>

                  <div style={{flex:1,minWidth:120,fontSize:13}}>{m.titulo}</div>

                  <span style={{fontSize:11,color:"#94a3b8"}}>N/A — não avaliado</span>

                </div>);

                const nv=nivel(s);const nvs=NS[nv];

                return(<div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0",borderBottom:"1px solid #f8fafc",flexWrap:"wrap"}}>

                  <div style={{flex:1,minWidth:120,fontSize:13,color:"#1e293b"}}>{m.titulo}</div>

                  <div style={{fontSize:10,color:"#94a3b8"}}>peso {m.peso}x</div>

                  <div style={{width:60,height:5,background:"#e2e8f0",borderRadius:10,overflow:"hidden"}}>

                    <div style={{ height: "100%", borderRadius: 10, width: `${s}%`,...Object.fromEntries(nvs.bar.split(";").filter(Boolean).map(x=>{const[k,v]=x.split(":");return[k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v.trim()];}))}}/></div>

                  <div style={{fontSize:13,fontWeight:700,minWidth:32,...Object.fromEntries(nvs.txt.split(";").filter(Boolean).map(x=>{const[k,v]=x.split(":");return[k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v.trim()];}))}}>{s}%</div>

                </div>);

              })}

            </div>

          </div>

          <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:16,marginBottom:12}}>

            <div style={{fontWeight:700,fontSize:16,color:"#0f2744",marginBottom:8}}>Interpretação do Resultado</div>

            <div style={{fontSize:14,lineHeight:1.65,color:"#334155"}}>{interps[ng]}</div>

          </div>

          {criticos.length>0?(

            <div style={S.card}>

              <div style={{padding:"14px 16px",background:"#0f2744",color:"#fff",fontSize:13,fontWeight:600}}>

                🎯 Plano de Ação Priorizado — {criticos.length} item(ns)

              </div>

              {criticos.map((a,i)=>(

                <div key={i} style={{display:"flex",gap:10,padding:"12px 16px",borderBottom:"1px solid #f8fafc",alignItems:"flex-start"}}>

                  <div style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,marginTop:2,background:a.p===1?"#fee2e2":"#fef3c7",color:a.p===1?"#991b1b":"#92400e"}}>{i+1}</div>

                  <div style={{flex:1}}>

                    <div style={{fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase",marginBottom:3}}>{a.p===1?"🔴 Crítico":"🟡 Atenção"} — {a.mod}</div>

                    <div style={{fontSize:13,fontWeight:600,color:"#1e293b",marginBottom:4}}>{a.txt}</div>

                    <div style={{fontSize:12,color:"#334155",background:"#f8fafc",borderRadius:8,padding:"8px 10px",lineHeight:1.6}}>{a.acao}</div>

                  </div>

                </div>

              ))}

            </div>

          ):(

            <div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:12,padding:16,marginBottom:12,fontSize:14,color:"#166534"}}>

              ✅ <b>Parabéns!</b> Nenhum item crítico ou de atenção identificado.

            </div>

          )}

          <div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:12,padding:16,marginBottom:16,fontSize:13,color:"#78350f",lineHeight:1.6}}>

            ⚖️ <b>Este relatório não substitui assessoria jurídica trabalhista.</b> É uma ferramenta de gestão administrativa preventiva. Situações críticas — especialmente do Módulo 4 — devem ser encaminhadas ao departamento jurídico. Reaplique o CheckUp a cada 6 meses.

          </div>

          <button onClick={()=>setTela("form")} style={{width:"100%",background:"#fff",border:"2px solid #0f2744",color:"#0f2744",borderRadius:12,padding:13,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:32}}>

            ← Voltar ao CheckUp

          </button>

        </div>

      </div>

    );

  }

  return(

    <div style={S.page}>

      <div style={{background:"linear-gradient(150deg,#0f2744,#1a4a8a)",padding:"32px 16px 48px",textAlign:"center"}}>

        <div style={{display:"inline-block",background:"rgba(201,168,76,.2)",border:"1px solid rgba(201,168,76,.4)",color:"#f0c96e",fontSize:10,fontWeight:600,letterSpacing:2,textTransform:"uppercase",padding:"5px 14px",borderRadius:20,marginBottom:14}}>Ferramenta de Gestão Preventiva</div>

        <h1 style={{fontSize:"clamp(20px,6vw,38px)",fontWeight:700,color:"#fff",lineHeight:1.2,marginBottom:10}}>CheckUp <span style={{color:"#f0c96e"}}>Trabalhista</span></h1>

        <p style={{color:"rgba(255,255,255,.65)",fontSize:13,maxWidth:500,margin:"0 auto 20px"}}>Levantamento estruturado para identificação de vulnerabilidades nas rotinas administrativas do seu DP e RH.</p>

        <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:6}}>

          {["📋 7 módulos","✅ 84+ itens","📊 Score automático","⚖️ Âmbito administrativo"].map(p=>(

            <span key={p} style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.18)",color:"rgba(255,255,255,.85)",fontSize:11,padding:"4px 10px",borderRadius:20}}>{p}</span>

          ))}

        </div>

      </div>

      <div style={{padding:"0 12px",maxWidth:860,margin:"0 auto"}}>

        <div style={{background:"#fffbeb",border:"1px solid #f59e0b",borderLeft:"4px solid #f59e0b",borderRadius:12,padding:14,display:"flex",gap:10,marginTop:-20,position:"relative",zIndex:10,marginBottom:14}}>

          <span style={{fontSize:17,flexShrink:0}}>⚠️</span>

          <div style={{fontSize:13,color:"#78350f",lineHeight:1.55}}>

            <b style={{display:"block",marginBottom:2}}>Este CheckUp não substitui assessoria jurídica trabalhista.</b>

            É uma ferramenta de gestão administrativa preventiva. Os resultados devem ser usados como insumo para o departamento jurídico e para aprimoramento dos processos internos de RH e DP.

          </div>

        </div>

        <div style={S.card}>

          <div style={S.cardHead}>

            <div style={{width:34,height:34,background:"#dbeafe",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🏢</div>

            <div><div style={{fontWeight:600,fontSize:15,color:"#0f2744"}}>Identificação da Empresa</div><div style={{fontSize:12,color:"#64748b",marginTop:2}}>Preencha antes de iniciar</div></div>

          </div>

          <div style={{padding:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>

            {[["razao","Razão Social","Nome da empresa"],["cnpj","CNPJ","00.000.000/0000-00"],["resp","Responsável","Nome completo"],["cargo","Cargo","Ex: Gerente de RH"]].map(([k,l,ph])=>(

              <div key={k}><label style={S.label}>{l}</label><input value={empresa[k]} onChange={e=>setEmpresa(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={S.input}/></div>

            ))}

          </div>

        </div>

        <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:12,padding:14,marginBottom:12,fontSize:13,color:"#7c2d12",lineHeight:1.6}}>

          <b style={{display:"block",marginBottom:4}}>📌 Como preencher este CheckUp:</b>

          <b>🟢 Verde:</b> Práticas que a empresa já faz integralmente &nbsp;|&nbsp; <b>🟡 Amarelo:</b> Práticas feitas às vezes, mas não sempre &nbsp;|&nbsp; <b>🔴 Vermelho:</b> Práticas que a empresa não faz &nbsp;|&nbsp; <b>⬜ N/A:</b> Não se aplica à sua atividade<br/>

          <span style={{marginTop:4,display:"block"}}>⚠️ <b>Na dúvida sobre qual opção escolher, sempre marque Vermelho.</b> Isso indicará uma ação urgente — a relevância real só pode ser determinada após o alinhamento entre conhecimento e prática.</span>

        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>

          {[{s:"background:#dcfce7;border:1px solid #86efac",d:"🟢",l:"Verde — Conforme/Ativo",desc:"Práticas que a empresa já faz atualmente, integralmente"},

            {s:"background:#fef3c7;border:1px solid #fcd34d",d:"🟡",l:"Amarelo — Atenção/Lacunas",desc:"Práticas que a empresa faz em determinados momentos, e outros não"},

            {s:"background:#fee2e2;border:1px solid #fca5a5",d:"🔴",l:"Vermelho — Crítico/Urgente",desc:"Práticas que a empresa não faz"},

            {s:"background:#f1f5f9;border:1px solid #cbd5e1",d:"⬜",l:"N/A — Não se aplica",desc:"Práticas que não se aplicam à sua atividade"}].map(l=>(
            <div key={l.l} style={{borderRadius:10,padding:12,...Object.fromEntries(l.s.split(";").filter(Boolean).map(x=>{const[k,v]=x.split(":");return[k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v.trim()];}))}}>
              <div style={{fontSize:17,marginBottom:4}}>{l.d}</div>
              <div style={{fontSize:12,fontWeight:600}}>{l.l}</div>
              <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{l.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
