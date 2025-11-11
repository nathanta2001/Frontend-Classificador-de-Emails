import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Classificador from './pages/Classificador';
import Revisor from './pages/Revisor';
import Historico from './pages/Historico';

/**
 * Componente principal da aplicação.
 * Gere o estado global do layout, incluindo:
 * 1. O tema (claro/escuro).
 * 2. O estado do menu lateral móvel (aberto/fechado).
 */
function App() {

  // Estado para o tema claro como padrão e leitura do localStorage.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  // Estado para controlar o menu lateral em telas pequenas.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Estado para controlar qual página está ativa.
  const [activeView, setActiveView] = useState('classificador');

  /**
   * Effect é executado sempre que o estado 'theme' muda.
   * Adiciona a classe 'dark-mode' or 'light-mode' ao <body> do HTML.
   */
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', theme);
  }, [theme]); 

  return (
    // A classe 'sidebar-open' é aplicada condicionalmente para o CSS móvel
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      
      {/* Overlay escuro que aparece em modo móvel para fechar o menu */}
      <div 
        className="sidebar-overlay" 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Componente de Navegação (sidebar) */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      {/* Conteúdo Principal da Página */}
      <main className="main-content">
        
        {/* Botão "Hambúrguer" (só visível em mobile) */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          ☰
        </button>

        {/* Alternador de Tema (Claro/Escuro) */}
        <div className="theme-toggle">
          <button 
            onClick={() => setTheme('light')}
            className={theme === 'light' ? 'active' : ''}
            aria-label="Ativar modo claro"
          >
            ☀️ Claro
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={theme === 'dark' ? 'active' : ''}
            aria-label="Ativar modo escuro"
          >
            🌙 Escuro
          </button>
        </div>

        {/* Renderização Condicional da Página Ativa */}
        {activeView === 'classificador' && <Classificador />}
        {activeView === 'revisor' && <Revisor />}
        {activeView === 'historico' && <Historico />}
      </main>
    </div>
  );
}

export default App;