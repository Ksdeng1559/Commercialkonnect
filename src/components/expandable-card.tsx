'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Maximize2, X } from 'lucide-react';

export default function ExpandableCard({className, title, children}: {className: string; title: string; children: ReactNode}) {
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!expanded) return;
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {element?.close(); document.body.style.overflow = overflow; previous?.focus();};
  }, [expanded]);
  return <>
    <article className={`${className} expandable-card`}>
      <button className="icon-button card-expand" aria-label={`Expand ${title}`} title={`Expand ${title}`} onClick={() => setExpanded(true)}><Maximize2 size={15}/></button>
      {children}
    </article>
    {expanded && <dialog className="expanded-card-dialog" ref={dialog} aria-label={title} onCancel={() => setExpanded(false)} onClick={event => {if (event.target === event.currentTarget) setExpanded(false);}}>
      <header><h2>{title}</h2><button className="icon-button" aria-label={`Close expanded ${title}`} onClick={() => setExpanded(false)}><X size={22}/></button></header>
      <div className={`${className} expanded-card-body`}>{children}</div>
    </dialog>}
  </>;
}
