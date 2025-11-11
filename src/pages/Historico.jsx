
import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../utils/historico';

/**
 * Lê e exibe os dados salvos no localStorage 
 */
function Historico() {

  const [history, setHistory] = useState([]);

  /**
   * Carrega o histórico do localStorage para o estado.
   */
  useEffect(() => {
    setHistory(getHistory());
  }, []); 

  /**
   * Função chamada ao clicar no botão "Limpar Histórico".
   */
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  /**
   * Formata uma data para um formato legível (pt-BR).
   * @param {string} isoString - A data em formato ISO (ex: "2025-11-11T...").
   * @returns {string} A data formatada (ex: "11/11/2025, 15:30").
   */
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="tool-content" aria-labelledby="historico-title">
      <h1 id="historico-title">Histórico de Atividades</h1>
      <p>Veja aqui as últimas classificações e revisões que você realizou.</p>

      {/* botão só aparece se houver histórico */}
      {history.length > 0 && (
        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
          <button
            onClick={handleClearHistory}
            className="btn-secondary"
            
            style={{ borderColor: 'var(--cor-erro)', color: 'var(--cor-erro)' }}
          >
            Limpar Histórico
          </button>
        </div>
      )}

      <div className="history-list">

        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--texto-secundario)' }}>
            O seu histórico está vazio.
          </p>
        ) : (

          // Mapeia o array 'history' para criar um card para cada item
          history.map((item, index) => (
            <div key={index} className="resultado-item" style={{ marginBottom: '1.5rem' }}>
              <strong style={{ display: 'flex', justifyContent: 'space-between' }}>
                {item.type === 'classificador' ? 'Classificação' : `Revisão (${item.action})`}
                <span style={{ fontSize: '0.9rem', fontWeight: '400', color: 'var(--texto-secundario)' }}>
                  {formatDate(item.date)}
                </span>
              </strong>

              {/* Renderiza o conteúdo do card com base no 'type' */}
              {item.type === 'classificador' ? (
                <>
                  <p><strong>Original:</strong> {item.original}</p>
                  <span><strong>Categoria:</strong> {item.result.categoria}</span><br />
                  <span><strong>Resposta:</strong> {item.result.resposta}</span>
                </>
              ) : (
                <>
                  <p><strong>Original:</strong> {item.original}</p>
                  <span><strong>Revisado:</strong> {item.result.texto_revisado}</span>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Historico;