// src/pages/Revisor.jsx

import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Revisor() {
  const [originalText, setOriginalText] = useState('');
  const [revisedText, setRevisedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState('');

  // NOVO: Estado para anúncios do leitor de ecrã
  const [announcement, setAnnouncement] = useState('');

  const actions = [
    { id: 'formal', label: 'Tornar Formal' },
    { id: 'encurtar', label: 'Encurtar' },
    { id: 'corrigir_gramatica', label: 'Corrigir Gramática' },
    { id: 'detalhar', label: 'Detalhar' },
  ];

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

      const data = await response.json();
      setRevisedText(data.texto_revisado);
      setAnnouncement('Texto revisado com sucesso.');

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
        
        <label htmlFor="original-text-input" className="visually-hidden">
          Texto Original para Revisar
        </label>
        <textarea
          id="original-text-input" 
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="Cole o texto original aqui..."
          rows={10}
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
              {isLoading && currentAction === action.id 
                ? 'Revisando...' 
                : action.label
              }
            </button>
          ))}
        </div>
      </form>

      {/* Área de Resultados */}
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