
import React, { useState } from 'react';
import { addHistoryItem } from '../utils/historico';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Permite ao usuario inserir um texto, escolher uma ação de revisão e envia para a API.
 * Exibe o texto revisado ou mensagens de erro conforme necessário.
 */
function Revisor() {
  const [originalText, setOriginalText] = useState('');
  const [revisedText, setRevisedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState(''); 
  const [announcement, setAnnouncement] = useState('');

  // Define as ações que a API suporta
  const actions = [
    { id: 'formal', label: 'Tornar Formal' },
    { id: 'encurtar', label: 'Encurtar' },
    { id: 'corrigir_gramatica', label: 'Corrigir Gramática' },
    { id: 'detalhar', label: 'Detalhar' },
  ];

  /**
   * Envia o texto e a ação para a API de backend.
   * @param {string} actionId - O ID da ação 
   * @param {string} actionLabel - O texto do botão 
   */
  const handleActionClick = async (actionId, actionLabel) => {
    if (!originalText) {
      setError('Por favor, insira um texto para revisar.');
      setAnnouncement('Erro: Por favor, insira um texto para revisar.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRevisedText('');
    setCurrentAction(actionId); 
    setAnnouncement(`Revisando texto para ${actionLabel}, por favor aguarde.`);

    try {
      // Chamada de API para o endpoint /api/revisar
      const response = await fetch(`${API_BASE_URL}/api/revisar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto: originalText,
          acao: actionId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `A requisição falhou: ${response.statusText}`);
      }

      // A API respondeu com sucesso
      const data = await response.json();
      setRevisedText(data.texto_revisado);
      setAnnouncement('Texto revisado com sucesso.');

      // Guarda o resultado no histórico (localStorage)
      addHistoryItem({
        type: 'revisor',
        action: actionLabel,
        date: new Date().toISOString(),
        original: originalText,
        result: data 
      });

    } catch (err) {
      setError(err.message);
      setAnnouncement(`Erro ao revisar: ${err.message}`);
    } finally {
      setIsLoading(false);
      setCurrentAction('');
    }
  };

  return (
    <section className="tool-content" aria-labelledby="revisor-title">
      <div className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>

      <h1 id="revisor-title">Revisor de Texto</h1>
      <p>Cole um texto, escolha uma ação e deixe a IA melhorá-lo para você.</p>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Rótulo oculto para acessibilidade */}
        <label htmlFor="original-text-input" className="visually-hidden">
          Texto Original para Revisar
        </label>
        <textarea
          id="original-text-input"
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="Cole o texto original aqui..."
          required
        />

        <div className="action-buttons">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action.id, action.label)}
              disabled={isLoading}
              className="btn-secondary"
            >
              {/* Mostra "Revisando..." apenas no botão que foi clicado */}
              {isLoading && currentAction === action.id
                ? 'Revisando...'
                : action.label
              }
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="erro" role="alert">
          <strong>Erro ao processar:</strong> {error}
        </div>
      )}

      {revisedText && (
        <div className="resultado" role="status">
          <div className="resultado-item">
            <strong>Texto Revisado:</strong>
            <span>{revisedText}</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default Revisor;