import { useState } from 'react'

// URL da API definida na variável de ambiente
const API_URL = import.meta.env.VITE_API_URL

function App() {
  
  // Armazena o texto digitado no formulário
  const [emailText, setEmailText] = useState('')
  
  // Guarda a resposta retornada pela API ('categoria' e 'resposta')
  const [result, setResult] = useState(null)
  
  // Indica durante o carregamento da requisição
  const [isLoading, setIsLoading] = useState(false)
  
  // Guarda mensagens de erro caso algo falhe
  const [error, setError] = useState(null)


  /**
   * Envia o texto do email para a API e recebe a classificação.
   */
  const handleSubmit = async (event) => {
    event.preventDefault() 

    // Reseta estados antes de nova requisição
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {

      // Faz a requisição POST para o backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'email_texto': emailText }),
      });

      // Se retornar erro de rede / servidor
      if (!response.ok) {
        throw new Error(`A requisição falhou: ${response.statusText}`)
      }

      // Converte o JSON da API em objeto
      const data = await response.json()
      setResult(data) 

    } catch (err) {
      console.error(err)
      setError(err.message) 

    } finally {
      setIsLoading(false) 
    }
  }

  return (
    <main>
      <h1>Classificador de Emails</h1>
      <p>
        Cole o texto do seu email abaixo. A IA irá classificá-lo e sugerir uma resposta.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="Cole o texto do email aqui..."
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Classificando...' : 'Classificar'}
        </button>
      </form>

      {/* Exibição do resultado da IA */}
      {result && (
        <section className="resultado">
          <div className="resultado-item">
            <strong>Categoria:</strong>
            <span>{result.categoria}</span>
          </div>
          <div className="resultado-item">
            <strong>Resposta Sugerida:</strong>
            <span>{result.resposta}</span>
          </div>
        </section>
      )}

      {/* Exibição de erro */}
      {error && (
        <div className="erro">
          <strong>Erro ao processar:</strong> {error}
        </div>
      )}
    </main>
  )
}

export default App
