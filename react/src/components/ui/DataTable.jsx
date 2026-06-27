import { useMemo, useState } from 'react';
import { Card, SectionTitle, Button } from './Primitives';
import { useToast } from '../../context/ToastContext';

/**
 * DataTable — searchable, sortable, paginated, CSV-exportable.
 * columns: [{ key, label, render?(row), sortValue?(row), csv?(row), align? }]
 */
export default function DataTable({ columns, rows, title, subtitle, pageSize = 8, searchable = true, exportable = true }) {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: null, dir: 1 });
  const [page, setPage] = useState(0);

  const searchText = (row) =>
    columns.map((c) => (c.csv ? c.csv(row) : c.key ? row[c.key] : '')).join(' ').toLowerCase();

  const filtered = useMemo(() => {
    let r = rows;
    if (query.trim()) { const q = query.toLowerCase(); r = r.filter((row) => searchText(row).includes(q)); }
    if (sort.key) {
      const col = columns.find((c) => c.key === sort.key || c.label === sort.key);
      const val = (row) => (col?.sortValue ? col.sortValue(row) : col?.key ? row[col.key] : '');
      r = [...r].sort((a, b) => {
        const va = val(a), vb = val(b);
        if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sort.dir;
        return String(va).localeCompare(String(vb)) * sort.dir;
      });
    }
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, sort, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const view = filtered.slice(current * pageSize, current * pageSize + pageSize);

  const toggleSort = (col) => {
    const key = col.key || col.label;
    if (!col.key && !col.sortValue) return;
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));
  };

  const exportCSV = () => {
    const cell = (c, r) => {
      const raw = c.csv ? c.csv(r) : c.key != null ? r[c.key] : '';
      return `"${String(raw ?? '').replace(/"/g, '""')}"`;
    };
    const head = columns.map((c) => `"${(c.label || '').replace(/"/g, '""')}"`).join(',');
    const body = filtered.map((r) => columns.map((c) => cell(c, r)).join(',')).join('\r\n');
    const blob = new Blob([head + '\r\n' + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'export').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast({ title: 'Export ready', text: `${filtered.length} rows downloaded.`, type: 'success' });
  };

  return (
    <Card className="overflow-hidden">
      {(title || searchable || exportable) && (
        <div className="px-5 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
            {title ? <SectionTitle title={title} sub={subtitle} /> : <div />}
            <div className="flex items-center gap-2 mb-3.5">
              {searchable && (
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted" />
                  <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }}
                    placeholder="Search…" aria-label="Search table"
                    className="input !py-2 !pl-9 !w-44 sm:!w-56" />
                </div>
              )}
              {exportable && <Button size="sm" icon="fa-file-export" onClick={exportCSV}>Export</Button>}
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full border-separate" style={{ borderSpacing: 0, fontSize: 13.5 }}>
          <thead>
            <tr>
              {columns.map((c, i) => {
                const sortable = c.key || c.sortValue;
                const active = sort.key === (c.key || c.label);
                return (
                  <th key={i} onClick={() => toggleSort(c)}
                    className={`text-left uppercase tracking-wide text-[11px] font-bold text-muted px-3.5 py-3 border-b border-line select-none ${sortable ? 'cursor-pointer hover:text-app' : ''} ${c.align === 'right' ? 'text-right' : ''}`}>
                    {c.label}
                    {sortable && (
                      <i className={`fa-solid ml-1.5 text-[9px] ${active ? (sort.dir === 1 ? 'fa-arrow-up-short-wide' : 'fa-arrow-down-wide-short') : 'fa-sort opacity-40'}`} />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {view.map((row, ri) => (
              <tr key={ri} className="hover:bg-surface-2 transition-colors">
                {columns.map((c, ci) => (
                  <td key={ci} className={`px-3.5 py-3 ${c.align === 'right' ? 'text-right' : ''}`}
                    style={{ borderBottom: '1px solid rgb(var(--c-border) / .6)' }}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {!view.length && (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-muted">No matching records.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-line text-[12.5px] text-muted">
          <span>Showing {current * pageSize + 1}–{Math.min((current + 1) * pageSize, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1.5">
            <button disabled={current === 0} onClick={() => setPage(current - 1)}
              className="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 hover:text-app">Prev</button>
            <span className="px-2 font-semibold text-app">{current + 1}/{pages}</span>
            <button disabled={current >= pages - 1} onClick={() => setPage(current + 1)}
              className="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 hover:text-app">Next</button>
          </div>
        </div>
      )}
    </Card>
  );
}
