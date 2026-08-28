import React, { useRef, useEffect, useState } from 'react';
import { KnowledgeNote, Domain, AppTheme } from '../../types';

interface GraphNode {
  id: string;
  title: string;
  domainId?: string | null;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isDomain?: boolean;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphCanvasProps {
  notes: KnowledgeNote[];
  domains: Domain[];
  onSelectNote: (note: KnowledgeNote) => void;
  currentTheme: AppTheme;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  notes,
  domains,
  onSelectNote,
  currentTheme
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const draggedNodeRef = useRef<GraphNode | null>(null);

  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);

  // Initialize or update nodes and links
  useEffect(() => {
    const domainMap = new Map(domains.map((d) => [d.id, d]));
    const width = 800;
    const height = 500;

    const existingMap = new Map(nodesRef.current.map((n) => [n.id, n]));

    const newNodes: GraphNode[] = [];
    const newLinks: GraphLink[] = [];

    // Add Domain nodes
    domains.forEach((d, idx) => {
      const existing = existingMap.get(`domain-${d.id}`);
      const angle = (idx / Math.max(1, domains.length)) * Math.PI * 2;
      const dist = 140;

      newNodes.push({
        id: `domain-${d.id}`,
        title: `${d.icon} ${d.name}`,
        domainId: d.id,
        x: existing ? existing.x : width / 2 + Math.cos(angle) * dist,
        y: existing ? existing.y : height / 2 + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: 20,
        color: '#06b6d4',
        isDomain: true
      });
    });

    // Add Note nodes
    notes.forEach((note, idx) => {
      const existing = existingMap.get(note.id);
      const angle = (idx / Math.max(1, notes.length)) * Math.PI * 2;
      const dist = 220;

      newNodes.push({
        id: note.id,
        title: note.title,
        domainId: note.domainId,
        x: existing ? existing.x : width / 2 + Math.cos(angle) * dist,
        y: existing ? existing.y : height / 2 + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: 12,
        color: note.domainId ? '#a855f7' : '#ec4899',
        isDomain: false
      });

      // Link to its domain if set
      if (note.domainId) {
        newLinks.push({
          source: note.id,
          target: `domain-${note.domainId}`
        });
      }

      // Link to other notes
      note.linkedNoteIds.forEach((targetId) => {
        newLinks.push({
          source: note.id,
          target: targetId
        });
      });
    });

    nodesRef.current = newNodes;
    linksRef.current = newLinks;
  }, [notes, domains]);

  // Simulation physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const tick = () => {
      const width = canvas.width;
      const height = canvas.height;
      const nodes = nodesRef.current;
      const links = linksRef.current;

      const nodeMap = new Map(nodes.map((n) => [n.id, n]));

      // Physics: Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 200) {
            const force = (200 - dist) / dist * 0.05;
            a.vx -= dx * force;
            a.vy -= dy * force;
            b.vx += dx * force;
            b.vy += dy * force;
          }
        }
      }

      // Physics: Attraction along links
      for (const link of links) {
        const source = nodeMap.get(link.source);
        const target = nodeMap.get(link.target);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 90;
          const force = (dist - targetDist) * 0.008;
          source.vx += dx * force;
          source.vy += dy * force;
          target.vx -= dx * force;
          target.vy -= dy * force;
        }
      }

      // Physics: Center gravity
      for (const node of nodes) {
        if (node === draggedNodeRef.current) continue;
        const dx = width / 2 - node.x;
        const dy = height / 2 - node.y;
        node.vx += dx * 0.0008;
        node.vy += dy * 0.0008;

        // Damping
        node.vx *= 0.88;
        node.vy *= 0.88;

        node.x += node.vx;
        node.y += node.vy;

        // Keep inside bounds
        node.x = Math.max(node.radius + 10, Math.min(width - node.radius - 10, node.x));
        node.y = Math.max(node.radius + 10, Math.min(height - node.radius - 10, node.y));
      }

      // Render
      ctx.clearRect(0, 0, width, height);

      // Draw Links
      ctx.lineWidth = 1.5;
      for (const link of links) {
        const source = nodeMap.get(link.source);
        const target = nodeMap.get(link.target);
        if (source && target) {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }

      // Draw Nodes
      for (const node of nodes) {
        const isHovered = hoveredNode?.id === node.id;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isHovered ? 4 : 0), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isHovered ? 15 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node label
        ctx.fillStyle = '#f8fafc';
        ctx.font = node.isDomain ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.title, node.x, node.y + node.radius + 12);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredNode]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    for (const node of nodesRef.current) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 5) {
        draggedNodeRef.current = node;
        break;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = x;
      draggedNodeRef.current.y = y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
    } else {
      let found: GraphNode | null = null;
      for (const node of nodesRef.current) {
        const dx = node.x - x;
        const dy = node.y - y;
        if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 5) {
          found = node;
          break;
        }
      }
      setHoveredNode(found);
      canvas.style.cursor = found ? 'pointer' : 'default';
    }
  };

  const handlePointerUp = () => {
    if (draggedNodeRef.current && !draggedNodeRef.current.isDomain) {
      const targetNote = notes.find((n) => n.id === draggedNodeRef.current?.id);
      if (targetNote && hoveredNode?.id === draggedNodeRef.current.id) {
        onSelectNote(targetNote);
      }
    }
    draggedNodeRef.current = null;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    for (const node of nodesRef.current) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 5) {
        if (!node.isDomain) {
          const targetNote = notes.find((n) => n.id === node.id);
          if (targetNote) onSelectNote(targetNote);
        }
        break;
      }
    }
  };

  return (
    <div className="relative w-full h-[460px] rounded-3xl bg-slate-950/90 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        className="w-full h-full touch-none select-none"
      />
      <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 font-mono pointer-events-none">
        💡 Drag nodes to interact • Click any note to open
      </div>
    </div>
  );
};
