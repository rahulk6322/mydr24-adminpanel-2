import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: { i: 'fa-circle-check', c: '#16ad8f' },
  error: { i: 'fa-circle-exclamation', c: '#ef4444' },
  info: { i: 'fa-circle-info', c: '#1b7df5' },
  warn: { i: 'fa-triangle-exclamation', c: '#f59e0b' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(({ title, text, type = 'info', duration = 4200 }) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, title, text, type }]);
    if (duration) setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[300] flex flex-col gap-2.5 max-w-[360px]">
        {toasts.map((t) => {
          const ic = ICONS[t.type] || ICONS.info;
          return (
            <div key={t.id} className="anim-fade flex gap-3 items-start p-3.5 rounded-2xl card shadow-lg">
              <span className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-none text-[15px]"
                style={{ background: ic.c + '22', color: ic.c }}>
                <i className={`fa-solid ${ic.i}`} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm">{t.title}</div>
                {t.text && <div className="text-muted text-xs mt-0.5">{t.text}</div>}
              </div>
              <button onClick={() => remove(t.id)} className="text-muted hover:text-app text-xs -mr-1 -mt-1 p-1" aria-label="Dismiss">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx.toast;
}
