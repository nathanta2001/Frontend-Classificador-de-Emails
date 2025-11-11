// src/pages/Classificador.jsx

import React, { useState } from 'react';

const CLASSIFY_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/classificar`;

function Classificador() {
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [announcement, setAnnouncement] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);
    setAnnouncement('Classificando email, por favor aguarde.'); 

    try {
      const response = await fetch(CLASSIFY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'email_texto': emailText }),
      });

      if (!response.ok) {
        throw new Error(`A requisição falhou: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      setAnnouncement(`Resultado recebido. Categoria: ${data.categoria}. Resposta sugerida: ${data.resposta}`);
    
    } catch (err) {
      setError(err.message);
      setAnnouncement(`Erro ao processar: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="tool-content" aria-labelledby="classificador-title">
      <div className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>

      <h1 id="classificador-title">Classificador de Emails</h1>
      <p>Cole o texto do seu email abaixo. A IA irá classificá-lo e sugerir uma resposta.</p>

      <form onSubmit={handleSubmit}>
        
        {/* NOVO: Adiciona <label> e 'id' para acessibilidade */}
        <label htmlFor="email-text-input" className="visually-hidden">
          Texto do Email para Classificar
        </label>
        <textarea
          id="email-text-input" // NOVO: ID corresponde ao 'htmlFor' do label
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="Cole o texto do email aqui..."
          rows={10}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Classificando...' : 'Classificar'}
        </button>
      </form>

      {/* Área de Resultados */}
      {error && (
        <div className="erro" role="alert"> 
          <strong>Erro ao processar:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="resultado" role="status"> 
          <div className="resultado-item">
            <strong>Categoria:</strong>
            <span>{result.categoria || 'N/A'}</span>
          </div>
          <div className="resultado-item">
            <strong>Resposta Sugerida:</strong>
            <span>{result.resposta || 'N/A'}</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default Classificador;