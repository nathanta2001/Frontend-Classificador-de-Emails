import { useState } from 'react'
import Sidebar from './components/Sidebar';
import Classificador from './pages/Classificador';
import Revisor from './pages/Revisor';
import './index.css';


// URL da API definida na variável de ambiente
const API_URL = import.meta.env.VITE_API_BASE_URL 

function App() {

  
  const [activeView, setActiveView] = useState('classificador');
  
  return (
    <div className="app-container">
      <Sidebar activeView={activeView} setView={setActiveView} />
      
      <main className="main-content">
        
        {activeView === 'classificador' && <Classificador />}
        {activeView === 'revisor' && <Revisor />}
      </main>
    </div>
  );
}

export default App
