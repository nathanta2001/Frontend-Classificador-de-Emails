import React, { useState } from 'react';
import { addHistoryItem } from '../utils/historico';

// A URL do endpoint da API é lida das variáveis de ambiente
const CLASSIFY_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/classificar`;

/**
 * Permite ao utilizador inserir um texto de email, enviá-lo para a API
 * e ver a classificação e a resposta sugerida.
 */
function Classificador() {
    const [emailText, setEmailText] = useState('');     // O texto no textarea
    const [result, setResult] = useState(null);         // A resposta da API
    const [isLoading, setIsLoading] = useState(false);  // Estado de "loading" do botão
    const [error, setError] = useState(null);           // Mensagem de erro, se houver
    const [announcement, setAnnouncement] = useState(''); // Texto para leitores de tela (acessibilidade)

    /**
     * Envia o texto do email para a API de backend.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setResult(null);
        setError(null);
        setAnnouncement('Classificando email, por favor aguarde.');

        try {
            // Chamada de API para o backend (Flask)
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

            // A API respondeu com sucesso
            const data = await response.json();
            setResult(data);
            setAnnouncement(`Resultado recebido. Categoria: ${data.categoria}. Resposta sugerida: ${data.resposta}`);

            // Guarda o resultado no histórico (localStorage)
            addHistoryItem({
                type: 'classificador',
                date: new Date().toISOString(),
                original: emailText,
                result: data
            });

        } catch (err) {
            setError(err.message);
            setAnnouncement(`Erro ao processar: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="tool-content" aria-labelledby="classificador-title">
            {/* Região ARIA para leitores de tela anunciarem resultados */}
            <div className="visually-hidden" role="status" aria-live="polite">
                {announcement}
            </div>

            <h1 id="classificador-title">Classificador de Emails</h1>
            <p>Cole o texto do seu email abaixo. A IA irá classificá-lo e sugerir uma resposta.</p>

            <form onSubmit={handleSubmit}>
                {/* Rótulo oculto para acessibilidade */}
                <label htmlFor="email-text-input" className="visually-hidden">
                    Texto do Email para Classificar
                </label>
                <textarea
                    id="email-text-input"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    placeholder="Cole o texto do email aqui..."
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Classificando...' : 'Classificar'}
                </button>
            </form>

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