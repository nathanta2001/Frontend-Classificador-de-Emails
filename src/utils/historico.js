
// Chave usada para guardar os dados no localStorage do navegador.
const HISTORY_KEY = 'emailToolkitHistory';

/**
 * Obtém todos os itens do histórico a partir do localStorage.
 * @returns {Array} Um array de itens do histórico.
 */
export const getHistory = () => {
  try {
    const items = localStorage.getItem(HISTORY_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Erro ao ler o histórico do localStorage", error);
    return [];
  }
};

/**
 * Adiciona um novo item ao histórico.
 * @param {Object} item - O objeto de histórico a ser salvo.
 */
export const addHistoryItem = (item) => {
  try {
    const currentHistory = getHistory();

    // Adiciona o item novo no início do array
    const newHistory = [item, ...currentHistory];
    
    // Limita o histórico aos 10 itens mais recentes (pra não sobrecarregar)
    if (newHistory.length > 10) {
      newHistory.pop(); // Remove o item mais antigo
    }
    
    // Salva o novo array de volta no localStorage.
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Erro ao salvar o item no histórico", error);
  }
};

/**
 * Limpa todo o histórico.
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Erro ao limpar o histórico", error);
  }
};