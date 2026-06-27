import { useState, useRef, useEffect, cloneElement } from 'react';

/**
 * Dropdown — accessible popover anchored to a trigger.
 * Usage: <Dropdown trigger={<button .../>}>{(close) => <menu/>}</Dropdown>
 */
export default function Dropdown({ trigger, align = 'right', width = 260, children }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      {cloneElement(trigger, { onClick: () => setOpen((o) => !o), 'aria-expanded': open })}
      {open && (
        <div className="menu anim-fade" style={{ top: 'calc(100% + 8px)', [align]: 0, width }}>
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}
