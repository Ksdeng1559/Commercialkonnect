'use client';
import { useId, useState } from 'react';
import { ArrowUpRight, GripVertical, Maximize2, MoveRight } from 'lucide-react';
import { money, pipelineStages, type PipelineStage, type Project } from '@/lib/demo';

type Props = {
  projects: Project[];
  status: Record<string, PipelineStage>;
  onMove: (id: string, stage: PipelineStage) => void;
  onOpen: (project: Project) => void;
};

export default function ProjectKanban({ projects, status, onMove, onOpen }: Props) {
  const boardId = useId();
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<PipelineStage | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const move = (id: string, stage: PipelineStage) => {
    const project = projects.find(p => p.id === id);
    if (!project || (status[id] ?? 'Discovered') === stage) return;
    onMove(id, stage);
    setAnnouncement(`${project.name} moved to ${stage}.`);
    requestAnimationFrame(() => document.getElementById(`${boardId}-card-${id}`)?.focus());
  };
  const clearDrag = () => { setDragging(null); setOver(null); };
  return <>
    <p className="kanban-help"><GripVertical size={15}/> Drag a project into a column, or use its move buttons.</p>
    <div className="kanban" aria-label="Project qualification Kanban board">
      {pipelineStages.map(stage => {
        const records = projects.filter(p => (status[p.id] ?? 'Discovered') === stage);
        const value = records.reduce((sum, p) => sum + p.value, 0);
        return <section key={stage} className={`kanban-column ${over === stage && dragging ? 'drop-active' : ''}`} aria-labelledby={`${boardId}-column-${stage.replaceAll(' ', '-')}`}
          onDragOver={event => { if (!dragging) return; event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setOver(stage); }}
          onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(null); }}
          onDrop={event => { event.preventDefault(); if (dragging && event.dataTransfer.getData('application/x-konstruction-project') === dragging) move(dragging, stage); clearDrag(); }}>
          <h3 id={`${boardId}-column-${stage.replaceAll(' ', '-')}`}><span className={`pipeline-dot ${stage.replace(' ', '-').toLowerCase()}`}/>{stage}<span>{records.length}</span></h3>
          <p className="column-value">{money(value)} <span>assumed project value</span></p>
          <div className="kanban-dropzone">
            {records.map(project => <article id={`${boardId}-card-${project.id}`} key={project.id} tabIndex={-1} className={`deal-card ${dragging === project.id ? 'is-dragging' : ''}`} draggable
              aria-label={`${project.name}, ${stage}`}
              onDragStart={event => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('application/x-konstruction-project', project.id); setDragging(project.id); }}
              onDragEnd={clearDrag}>
              <div className="card-drag-label"><span>{project.id}</span><span className="kanban-card-actions"><span title="Drag to another column" aria-hidden="true"><GripVertical size={16}/></span><button className="icon-button" draggable={false} aria-label={`Expand ${project.name} project card`} title="Expand project briefing" onClick={() => onOpen(project)}><Maximize2 size={15}/></button></span></div>
              <button className="deal-title" draggable={false} onClick={() => onOpen(project)}>{project.name}<ArrowUpRight size={15}/></button>
              <p>{project.location}</p>
              <span className="stage-pill card-stage">{project.stage}</span>
              <div><strong>{money(project.value)}</strong><span className={`score ${project.score >= 85 ? 'high' : ''}`}><span/>{project.score}<small>/100</small></span></div>
              <small>Assumed project value · CAD</small>
              <div className="card-moves" role="group" aria-label={`Move ${project.name}`}>
                <span><MoveRight size={12}/> Move to</span>
                {pipelineStages.filter(target => target !== stage).map(target => <button key={target} draggable={false} onClick={() => move(project.id, target)} aria-label={`Move ${project.name} to ${target}`}>{target}</button>)}
              </div>
            </article>)}
            {!records.length && <div className="column-empty"><MoveRight size={20}/><p>Drop a project here</p></div>}
          </div>
        </section>;
      })}
    </div>
    <p className="kanban-announcement" role="status" aria-live="polite">{announcement || 'Qualification changes stay in this demo session.'}</p>
  </>;
}
