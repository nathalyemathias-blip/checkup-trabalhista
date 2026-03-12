import React, { useState, useMemo } from "react";

// 1. DADOS DOS MÓDULOS (Você pode adicionar os outros itens seguindo este padrão)
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
      <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
        <div style={{ background: "#0f2744", color: "#fff", padding: 30, borderRadius: 16, textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, fontWeight: 800 }}>{final}%</div>
          <div style={{ fontSize: 18 }}>{empresa.nome || "Empresa"}</div>
        </div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0" }}>
          <h3>🎯 Plano de Ação</h3>
          {planoAcao.map((p, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ color: p.prioridade === "Crítica" ? "red" : "orange", fontWeight: 700, fontSize: 12 }}>{p.prioridade}</div>
              <div style={{ fontWeight: 600 }}>{p.pergunta}</div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 5 }}>{p.acao}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setTela("form")} style={{ width: "100%", marginTop: 20, padding: 15, borderRadius: 12, cursor: "pointer" }}>Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <div style={{ background: "#0f2744", color: "#fff", padding: 20, borderRadius: 16, marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>CheckUp Trabalhista</h2>
      </div>
      <input 
        placeholder="Nome da Empresa" 
        style={{ width: "100%", padding: 12, marginBottom: 20, borderRadius: 8, border: "1px solid #ccc", boxSizing: "border-box" }}
        value={empresa.nome} onChange={e => setEmpresa({...empresa, nome: e.target.value})}
      />
      {MODS.map(m => (
        <div key={m.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", marginBottom: 12 }}>
          <div 
            onClick={() => setAbertos(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
            style={{ padding: 15, cursor: "pointer", display: "flex", justifyContent: "space-between", fontWeight: 700 }}
          >
            <span>{m.titulo}</span>
            <span>{abertos[m.id] ? "▲" : "▼"}</span>
          </div>
          {abertos[m.id] && (
            <div style={{ padding: 15 }}>
              {m.itens.map((it, idx) => (
                <div key={idx} style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 14, marginBottom: 10 }}>{idx + 1}. {it.txt}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
                    {STATUS.map(s => (
                      <button 
                        key={s.key}
                        onClick={() => setRespostas(prev => ({
                          ...prev, [m.id]: prev[m.id].map((v, i) => i === idx ? s.key : v)
                        }))}
                        style={{ 
                          padding: 8, fontSize: 10, borderRadius: 6, cursor: "pointer",
                          background: respostas[m.id][idx] === s.key ? s.cor : "#fff"
                        }}
                      >
                        {s.emoji} {s.label}
                      </button>
                    ))}
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
        style={{ 
          width: "100%", padding: 15, borderRadius: 12, 
          background: respondidos &lt; totalItens ? "#94a3b8" : "#0f2744", 
          color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" 
        }}
      >
        {respondidos &lt; totalItens ? `Responda tudo (${respondidos}/${totalItens})` : "Gerar Relatório"}
      </button>
    </div>
  );
}
