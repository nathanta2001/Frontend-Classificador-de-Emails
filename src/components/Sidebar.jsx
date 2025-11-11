import React from 'react';

/**
 * Exibe os links para as diferentes páginas da aplicação.
 *
 * @param {object} props
 * @param {string} props.activeView - O nome da página ativa ('classificador', 'revisor', 'historico').
 * @param {function} props.setActiveView - Função do App.jsx para mudar a página ativa.
 * @param {function} props.setIsSidebarOpen - Função do App.jsx para fechar o menu móvel.
 */
function Sidebar({ activeView, setActiveView, setIsSidebarOpen }) {

  /**
   * Gere o clique num item de menu.
   * Muda a página ativa e fecha o menu lateral (em modo móvel).
   */
  const handleViewChange = (view) => {
    setActiveView(view);
    setIsSidebarOpen(false); // Fecha o menu em mobile ao mudar de página
  };

  return (
    <nav className="sidebar">
      {/* Botão de Fechar (só visível em mobile) */}
      <button 
        className="sidebar-close-btn" 
        onClick={() => setIsSidebarOpen(false)}
        aria-label="Fechar menu"
      >
        × 
      </button>

      <h2>Email Toolkit</h2>
      
      <ul>
        <li className={activeView === 'classificador' ? 'active' : ''}>
          <button onClick={() => handleViewChange('classificador')}>
            Classificador de Email
          </button>
        </li>
        
        <li className={activeView === 'revisor' ? 'active' : ''}>
          <button onClick={() => handleViewChange('revisor')}>
            Revisor de Texto
          </button>
        </li>
        
        <li className={activeView === 'historico' ? 'active' : ''}>
          <button onClick={() => handleViewChange('historico')}>
            Histórico
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;