import React from "react";

function Sidebar({activeView, setView}) {
  return (
    <nav className="sidebar">
        <h2>Email Toolkit</h2>
        <ul>
            <li className={activeView === 'classificador' ? 'active' : ''}>
                <button onClick={() => setView('classificador')} >
                    Classificador de Emails
                </button>
            </li>
            <li className={activeView === 'revisor' ? 'active' : ''}>
                <button onClick={() => setView('revisor')} >
                    Revisor de Textos
                </button>
            </li>
        </ul>
    </nav>
    );
}

export default Sidebar;