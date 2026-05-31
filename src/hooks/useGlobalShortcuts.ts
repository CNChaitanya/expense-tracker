import { useEffect } from 'react';

export const useGlobalShortcuts = (
  onAdd: () => void,
  onSearch: () => void,
  onNavigate: (page: string) => void,
  onClose: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        if (e.key === 'Escape') onClose();
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
        case '+':
          e.preventDefault();
          onAdd();
          break;
        case 'escape':
          onClose();
          break;
        case '1':
          onNavigate('dash');
          break;
        case '2':
          onNavigate('expenses');
          break;
        case '3':
          onNavigate('budgets');
          break;
        case '4':
          onNavigate('settings');
          break;
        case 'k':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onSearch();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAdd, onSearch, onNavigate, onClose]);
};
