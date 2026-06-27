import { useState } from 'react';
import { Badge } from './Primitives';
import { inr, statusVariant } from '../../lib/format';
import { useToast } from '../../context/ToastContext';

/**
 * Kanban — drag & drop board (native HTML5 DnD, no external dependency).
 * `initial` is an object: { 'Column Name': [ { id, org, value, owner, tag } ] }
 */
export default function Kanban({ initial }) {
  const toast = useToast();
  const [cols, setCols] = useState(initial);
  const [dragging, setDragging] = useState(null); // { from, id }
  const [over, setOver] = useState(null);

  const onDrop = (toCol) => {
    setOver(null);
    if (!dragging || dragging.from === toCol) { setDragging(null); return; }
    setCols((prev) => {
      const card = prev[dragging.from].find((c) => c.id === dragging.id);
      if (!card) return prev;
      return {
        ...prev,
        [dragging.from]: prev[dragging.from].filter((c) => c.id !== dragging.id),
        [toCol]: [card, ...prev[toCol]],
      };
    });
    toast({ title: 'Opportunity moved', text: `${dragging.id} → "${toCol}"`, type: 'success' });
    setDragging(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Object.entries(cols).map(([col, cards]) => {
        const total = cards.reduce((s, c) => s + (c.value || 0), 0);
        return (
          <div key={col}
            onDragOver={(e) => { e.preventDefault(); setOver(col); }}
            onDragLeave={() => setOver((o) => (o === col ? null : o))}
            onDrop={() => onDrop(col)}
            className={`kanban-col p-3 flex-shrink-0 ${over === col ? 'drop-target' : ''}`} style={{ width: 300 }}>
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="font-semibold text-sm flex items-center gap-2">
                {col} <Badge>{cards.length}</Badge>
              </div>
              <span className="text-muted text-[11px] font-mono">{inr(total)}</span>
            </div>
            <div className="space-y-2.5 min-h-[40px]">
              {cards.map((c) => (
                <div key={c.id} draggable
                  onDragStart={() => setDragging({ from: col, id: c.id })}
                  onDragEnd={() => setDragging(null)}
                  className={`kanban-card p-3 ${dragging?.id === c.id ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={statusVariant(c.tag)}>{c.tag}</Badge>
                    <span className="text-muted text-[10px] font-mono">{c.id}</span>
                  </div>
                  <div className="font-semibold text-sm">{c.org}</div>
                  <div className="text-muted text-xs mt-1">{c.owner}</div>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-line">
                    <span className="metric-value text-sm gradient-text">{inr(c.value)}</span>
                    <i className="fa-regular fa-clock text-muted text-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
