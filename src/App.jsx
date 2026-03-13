import React, { useState, useMemo } from "react";

// 1. DADOS DOS MÓDULOS (ESTRUTURA COMPLETA)
const MODS = [
  { 
    id: 1, titulo: "Módulo 1: Admissão e Registro", peso: 1, 
    desc: "Avalia a conformidade na contratação e documentação inicial.",
    itens: [
      { txt: "Os funcionários possuem registro em CTPS desde o primeiro dia?", nota: "O registro retroativo gera multas e riscos de processos.", acao: "Regularizar imediatamente todos os registros pendentes.", critico: true },
      { txt: "O contrato de experiência é formalizado por escrito?", nota: "Sem contrato escrito, a contratação é por tempo indeterminado.", acao: "Implementar modelo padrão de contrato de experiência." }
    ]
  },
  { 
    id: 2, titulo: "Módulo 2: Jornada e Ponto", peso: 2, 
    desc: "Controle de horários, horas extras e intervalos.",
    itens: [
      { txt: "Existe controle de ponto para empresas com mais de 20 funcionários?", nota: "Obrigatoriedade legal conforme a Lei da Liberdade Econômica.", acao: "Instalar sistema de ponto eletrônico ou manual.", critico: true }
    ]
  }
  // Você pode adicionar os outros módulos seguindo exatamente este padrão de chaves e vírgulas.
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
  const [abertos, setAbertos] = useState({ 1: true });
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
          if (v === 0 || v === 0.5) {
            planoAcao.push({
              modulo: m.titulo,
              pergunta: m.itens[idx].txt,
              acao: m.itens[idx].acao,
              prioridade: v === 0 ? "Crítica" : "Atenção"
            });
          }
        });
      } else {
        scoresModulos[m.id] = null;
      }
    });

    const final = pesoTotal > 0 ? Math.round(pontosGerais / pesoTotal) : 0;
    return { final, scoresModulos, planoAcao };
  }, [respostas]);

  if (tela === "relatorio") {
    const { final, scoresModulos, planoAcao } = calcularResultados;
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: "sans-serif", color: "#1e293b" }}>
        <div style={{ background: "#0f2744", color: "#fff", padding: 30, borderRadius: 16, textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Resultado Geral</div>
          <div style={{ fontSize: 48, fontWeight: 800 }}>{final}%</div>
          <div style={{ fontSize: 18, marginTop: 10 }}>{empresa.nome || "Empresa Avaliada"}</div>
        </div>

        <div style={{ background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>Desempenho por Módulo</h3>
          {MODS.map(m => (
            <div key={m.id} style={{ marginBottom: 15 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <span>{m.titulo}</span>
                <span style={{ fontWeight: 700 }}>{scoresModulos[m.id] ?? "N/A"}%</span>
              </div>
              <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${scoresModulos[m.id] || 0}%`, background: "#0f2744", transition: "0.5s" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0" }}>
          <h3 style={{ marginTop: 0 }}>🎯 Plano de Ação Priorizado</h3>
          {planoAcao.length > 0 ? planoAcao.map((p, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: p.prioridade === "Crítica" ? "#991b1b" : "#92400e" }}>
                {p.prioridade} • {p.modulo}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, margin: "4px 0" }}>{p.pergunta}</div>
              <div style={{ fontSize: 13, color: "#475569", background: "#f8fafc", padding: 10, borderRadius: 8 }}>{p.acao}</div>
            </div>
          )) : <p>Nenhuma inconformidade detectada.</p>}
        </div>
        
        <button onClick={() => setTela("form")} style={{ width: "100%", marginTop: 20, padding: 15, borderRadius: 12, border: "2px solid #0f2744", background: "none", fontWeight: 700, cursor: "pointer" }}>
          Voltar e Editar
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <div style={{ background: "#0f2744", color: "#fff", padding: 20, borderRadius: 16, marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>CheckUp Trabalhista</h2>
        <p style={{ margin: "5px 0 0", opacity: 0.8, fontSize: 13 }}>Ponto Nosso Gastronomia Urbana</p>
      </div>

      <div style={{ background: "#fff", padding: 15, borderRadius: 12, border: "1px solid #e2e8f0", marginBottom: 20 }}>
        <input 
          placeholder="Nome da Empresa" 
          style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          value={empresa.nome} onChange={e => setEmpresa({...empresa, nome: e.target.value})}
        />
      </div>

      {MODS.map(m => (
        <div key={m.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", marginBottom: 12, overflow: "hidden" }}>
          <div 
            onClick={() => setAbertos(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
            style={{ padding: 15, background: "#f8fafc", cursor: "pointer", display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#0f2744" }}
          >
            <span>{m.titulo}</span>
            <span>{abertos[m.id] ? "▲" : "▼"}</span>
          </div>
          
          {abertos[m.id] && (
            <div style={{ padding: 15 }}>
              {m.itens.map((it, idx) => (
                <div key={idx} style={{ marginBottom: 20, paddingBottom: 15, borderBottom: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>{idx + 1}. {it.txt}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                    {STATUS.map(s => {
                      const sel = respostas[m.id][idx] === s.key;
                      return (
                        <button 
                          key={s.key}
                          onClick={() => setRespostas(prev => ({
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
                          <div style={{ fontSize: 16, marginBottom: 4 }}>{s.emoji}</div>
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button 
        onClick={() => setTela("relatorio")}
        disabled={respondidos &lt; totalItens}
        style={{ width: "100%", padding: 18, borderRadius: 12, background: respondidos &lt; totalItens ? "#94a3b8" : "#0f2744", color: "#fff", fontWeight: 700, border: "none", cursor: respondidos &lt; totalItens ? "not-allowed" : "pointer", fontSize: 16 }}
      >
        {respondidos &lt; totalItens ? `Responda todos os itens (${respondidos}/${totalItens})` : "🚀 Gerar Relatório e Plano de Ação"}
      </button>
    </div>
  );
}
