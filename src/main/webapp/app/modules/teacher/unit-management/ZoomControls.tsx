import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ZoomControls.scss';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  minZoom?: number;
  maxZoom?: number;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  minZoom = 0.5,
  maxZoom = 1.5,
}) => {
  const percentage = Math.round(zoomLevel * 100);
  const isMinZoom = zoomLevel <= minZoom;
  const isMaxZoom = zoomLevel >= maxZoom;

  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={onZoomOut} disabled={isMinZoom} title="Zoom Out (Ctrl + -)">
        <FontAwesomeIcon icon="search-minus" />
      </button>

      <button className="zoom-reset" onClick={onResetZoom} title="Reset Zoom (Ctrl + 0)">
        <span className="zoom-percentage">{percentage}%</span>
      </button>

      <button className="zoom-btn" onClick={onZoomIn} disabled={isMaxZoom} title="Zoom In (Ctrl + +)">
        <FontAwesomeIcon icon="search-plus" />
      </button>
    </div>
  );
};

export default ZoomControls;
