import React, { useState, useEffect, useRef } from 'react';
import UnitNotes from './unit-notes';
import styles from './floating-note-widget.module.scss';

interface IFloatingNoteWidgetProps {
  unitId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingNoteWidget = ({ unitId, isOpen, onClose }: IFloatingNoteWidgetProps) => {
  // Vị trí mặc định: Cách phải 20px, cách trên 100px
  const [position, setPosition] = useState({ x: window.innerWidth - 380, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  // Refs để lưu vị trí chuột khi bắt đầu kéo
  const dragStartPos = useRef({ x: 0, y: 0 });
  const panelStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      setPosition({
        x: panelStartPos.current.x + dx,
        y: panelStartPos.current.y + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Chỉ bắt đầu kéo khi nhấn chuột trái
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    panelStartPos.current = { ...position };
  };

  if (!isOpen) return null;

  return (
    <div className={styles.notePanel} style={{ left: position.x, top: position.y }}>
      <div className={styles.notePanelHeader} onMouseDown={handleMouseDown}>
        <h4>
          <i className="bi bi-journal-text"></i> Notes
        </h4>
        <button className={styles.closeButton} onClick={onClose} onMouseDown={e => e.stopPropagation()}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div className={styles.notePanelBody}>
        {/* Truyền prop hideTitle để ẩn tiêu đề thừa bên trong */}
        <UnitNotes unitId={unitId} hideTitle={true} />
      </div>
    </div>
  );
};

export default FloatingNoteWidget;
