import React, { useState, useEffect, useRef, useCallback } from 'react';
import UnitNotes from './unit-notes';
import './floating-note-widget.scss';

interface IFloatingNoteWidgetProps {
  unitId: number;
  isOpen: boolean;
  onClose: () => void;
}

const PANEL_WIDTH = 350;
const PANEL_HEIGHT = 500;
const BOUNDARY_PADDING = 10;

export const FloatingNoteWidget = ({ unitId, isOpen, onClose }: IFloatingNoteWidgetProps) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 380, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const panelStartPos = useRef({ x: 0, y: 0 });

  // Fixed: Wrap in useCallback to stabilize reference
  const clampPosition = useCallback((x: number, y: number) => {
    const maxX = window.innerWidth - PANEL_WIDTH - BOUNDARY_PADDING;
    const maxY = window.innerHeight - PANEL_HEIGHT - BOUNDARY_PADDING;

    return {
      x: Math.max(BOUNDARY_PADDING, Math.min(x, maxX)),
      y: Math.max(BOUNDARY_PADDING, Math.min(y, maxY)),
    };
  }, []);

  // Fixed: Added clampPosition to dependencies
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      const newX = panelStartPos.current.x + dx;
      const newY = panelStartPos.current.y + dy;

      setPosition(clampPosition(newX, newY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.classList.remove('dragging-no-select');
    };

    if (isDragging) {
      document.body.classList.add('dragging-no-select');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('dragging-no-select');
    };
  }, [isDragging, clampPosition]);

  // Fixed: Added clampPosition to dependencies
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => clampPosition(prev.x, prev.y));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Chỉ bắt đầu kéo khi nhấn chuột trái
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    panelStartPos.current = { ...position };
  };

  if (!isOpen) return null;

  return (
    <div className="note-panel" style={{ left: position.x, top: position.y }}>
      <div className="note-panel-header" onMouseDown={handleMouseDown}>
        <h4>
          <i className="bi bi-journal-text"></i> Notes
        </h4>
        <button className="close-button" onClick={onClose} onMouseDown={e => e.stopPropagation()}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div className="note-panel-body">
        <UnitNotes unitId={unitId} />
      </div>
    </div>
  );
};

export default FloatingNoteWidget;
