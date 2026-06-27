import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Primitives';

/**
 * Accessible modal: role=dialog, aria-modal, focus trap, Escape to close,
 * focus restoration to the previously-focused element.
 */
export default function Modal({ title, subtitle, icon, onClose, footer, children }) {
  const ref = useRef(null);
  const lastFocus = useRef(null);

  const focusables = useCallback(() => {
    if (!ref.current) return [];
    return Array.from(
      ref.current.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);
  }, []);

  useEffect(() => {
    lastFocus.current = document.activeElement;
    const t = setTimeout(() => {
      const els = focusables();
      const input = ref.current?.querySelector('input,textarea,select');
      (input || els[0] || ref.current)?.focus();
    }, 50);

    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey, true);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey, true);
      if (lastFocus.current?.focus) try { lastFocus.current.focus(); } catch { /* noop */ }
    };
  }, [focusables, onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-5 anim-fade"
      style={{ background: 'rgba(5,9,18,.6)', backdropFilter: 'blur(6px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title}
        className="card w-full max-w-[560px] max-h-[88vh] overflow-hidden flex flex-col rounded-[20px] shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-line">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg,#1b7df5,#0a8b75)' }}>
                <i className={`fa-solid ${icon}`} />
              </div>
            )}
            <div>
              <div className="section-title text-base">{title}</div>
              {subtitle && <div className="text-muted text-xs">{subtitle}</div>}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close dialog"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-app hover:bg-surface-2">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
        {footer && <div className="p-4 border-t border-line flex justify-end gap-2.5">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export { Button };
