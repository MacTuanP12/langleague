import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { translate } from 'react-jhipster';
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
      <button className="zoom-btn" onClick={onZoomOut} disabled={isMinZoom} title={translate('langleague.teacher.units.zoom.out')}>
        <FontAwesomeIcon icon={faSearchMinus} />
      </button>

      <button className="zoom-reset" onClick={onResetZoom} title={translate('langleague.teacher.units.zoom.reset')}>
        <span className="zoom-percentage">{percentage}%</span>
      </button>

      <button className="zoom-btn" onClick={onZoomIn} disabled={isMaxZoom} title={translate('langleague.teacher.units.zoom.in')}>
        <FontAwesomeIcon icon={faSearchPlus} />
      </button>
    </div>
  );
};

export default ZoomControls;
