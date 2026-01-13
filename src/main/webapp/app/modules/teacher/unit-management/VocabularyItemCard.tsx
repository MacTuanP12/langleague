import React from 'react';
import { translate } from 'react-jhipster';

export interface VocabularyItemCardProps {
  index: number;
  data: {
    word: string;
    phonetic: string;
    meaning: string;
    example: string;
    imageUrl: string;
    orderIndex: number;
  };
  isExpanded: boolean;
  isDragging: boolean;
  onToggle: () => void;
  onChange: <K extends keyof VocabularyItemCardProps['data']>(field: K, value: VocabularyItemCardProps['data'][K]) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

/**
 * VocabularyItemCard Component
 *
 * Wrapped with React.memo for performance optimization.
 * This prevents unnecessary re-renders when typing in other vocabulary items.
 *
 * The component will only re-render if:
 * - index changes
 * - data changes
 * - isExpanded changes
 * - isDragging changes
 */
export const VocabularyItemCard: React.FC<VocabularyItemCardProps> = React.memo(
  ({ index, data, isExpanded, isDragging, onToggle, onChange, onRemove, onDuplicate, onDragStart, onDragOver, onDragEnd }) => {
    const displayText = data.word || translate('langleague.teacher.units.labels.newVocabulary');

    return (
      <div
        className={`collapsible-card ${isExpanded ? 'expanded' : 'collapsed'} ${isDragging ? 'dragging' : ''}`}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {/* Card Header - Always Visible */}
        <div className="collapsible-card-header" onClick={onToggle}>
          <div className="header-left">
            <i className="bi bi-grip-vertical drag-handle"></i>
            <span className="card-number">{index + 1}</span>
            <i className="bi bi-chat-square-text card-icon"></i>
            <span className="card-summary">{displayText}</span>
          </div>
          <div className="header-right">
            <button
              className="action-btn delete"
              onClick={e => {
                e.stopPropagation();
                onRemove();
              }}
              title={translate('langleague.teacher.units.form.actions.removeTooltip')}
            >
              <i className="bi bi-trash"></i>
            </button>
            <button
              className="toggle-btn"
              title={
                isExpanded
                  ? translate('langleague.teacher.units.form.controls.collapseAll')
                  : translate('langleague.teacher.units.form.controls.expandAll')
              }
            >
              <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        {/* Card Body - Collapsible */}
        <div className="collapsible-card-body" style={{ display: isExpanded ? 'block' : 'none' }}>
          <div className="form-field">
            <input
              type="text"
              value={data.word}
              onChange={e => onChange('word', e.target.value)}
              placeholder={translate('langleague.teacher.units.vocabulary.placeholders.word')}
              className="field-input"
              onClick={e => e.stopPropagation()}
            />
            <div className="field-underline"></div>
          </div>

          <div className="form-field">
            <input
              type="text"
              value={data.phonetic}
              onChange={e => onChange('phonetic', e.target.value)}
              placeholder={translate('langleague.teacher.units.vocabulary.placeholders.phonetic')}
              className="field-input"
              onClick={e => e.stopPropagation()}
            />
            <div className="field-underline"></div>
          </div>

          <div className="form-field">
            <input
              type="text"
              value={data.meaning}
              onChange={e => onChange('meaning', e.target.value)}
              placeholder={translate('langleague.teacher.units.vocabulary.placeholders.meaning')}
              className="field-input"
              onClick={e => e.stopPropagation()}
            />
            <div className="field-underline"></div>
          </div>

          <div className="form-field">
            <textarea
              value={data.example}
              onChange={e => onChange('example', e.target.value)}
              placeholder={translate('langleague.teacher.units.vocabulary.placeholders.example')}
              className="field-textarea"
              rows={2}
              onClick={e => e.stopPropagation()}
            />
            <div className="field-underline"></div>
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <input
                type="text"
                value={data.imageUrl}
                onChange={e => onChange('imageUrl', e.target.value)}
                placeholder={translate('langleague.teacher.units.vocabulary.placeholders.imageUrl')}
                className="field-input small"
                onClick={e => e.stopPropagation()}
              />
              <div className="field-underline"></div>
            </div>
            <div className="form-field">
              <input
                type="number"
                value={data.orderIndex}
                onChange={e => onChange('orderIndex', parseInt(e.target.value, 10))}
                placeholder={translate('langleague.teacher.units.vocabulary.placeholders.order')}
                className="field-input small"
                onClick={e => e.stopPropagation()}
              />
              <div className="field-underline"></div>
            </div>
          </div>

          {/* Footer with duplicate button */}
          <div className="card-footer">
            <button
              className="action-btn"
              onClick={e => {
                e.stopPropagation();
                onDuplicate();
              }}
              title={translate('langleague.teacher.units.form.actions.duplicateTooltip')}
            >
              <i className="bi bi-files"></i> {translate('langleague.teacher.units.form.actions.duplicate')}
            </button>
          </div>
        </div>
      </div>
    );
  },
  // Custom comparison function for better performance
  // Only re-render if these specific props change
  (prevProps, nextProps) => {
    return (
      prevProps.index === nextProps.index &&
      prevProps.data.word === nextProps.data.word &&
      prevProps.data.phonetic === nextProps.data.phonetic &&
      prevProps.data.meaning === nextProps.data.meaning &&
      prevProps.data.example === nextProps.data.example &&
      prevProps.data.imageUrl === nextProps.data.imageUrl &&
      prevProps.data.orderIndex === nextProps.data.orderIndex &&
      prevProps.isExpanded === nextProps.isExpanded &&
      prevProps.isDragging === nextProps.isDragging
    );
  },
);
