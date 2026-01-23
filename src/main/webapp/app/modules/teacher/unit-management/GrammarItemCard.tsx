import React from 'react';
import { IGrammar } from 'app/shared/model/grammar.model';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faBook, faTrash, faChevronUp, faChevronDown, faCopy } from '@fortawesome/free-solid-svg-icons';

export interface GrammarItemCardProps {
  index: number;
  data: IGrammar;
  isExpanded: boolean;
  isDragging: boolean;
  onToggle: () => void;
  onChange: <K extends keyof IGrammar>(field: K, value: IGrammar[K]) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

/**
 * GrammarItemCard Component
 *
 * Wrapped with React.memo for performance optimization.
 * This prevents unnecessary re-renders when typing in other grammar items.
 */
export const GrammarItemCard: React.FC<GrammarItemCardProps> = React.memo(
  ({ index, data, isExpanded, isDragging, onToggle, onChange, onRemove, onDuplicate, onDragStart, onDragOver, onDragEnd }) => {
    const displayText = data.title || translate('langleague.teacher.units.labels.newGrammar');

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
            <FontAwesomeIcon icon={faGripVertical} className="drag-handle" />
            <span className="card-number">{index + 1}</span>
            <FontAwesomeIcon icon={faBook} className="card-icon" />
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
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button
              className="toggle-btn"
              title={
                isExpanded
                  ? translate('langleague.teacher.units.form.controls.collapseAll')
                  : translate('langleague.teacher.units.form.controls.expandAll')
              }
            >
              <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
            </button>
          </div>
        </div>

        {/* Card Body - Collapsible */}
        <div className="collapsible-card-body" style={{ display: isExpanded ? 'block' : 'none' }}>
          <div className="form-field">
            <input
              type="text"
              value={data.title || ''}
              onChange={e => onChange('title', e.target.value)}
              placeholder={translate('langleague.teacher.units.grammar.placeholders.title')}
              className="field-input"
              onClick={e => e.stopPropagation()}
            />
            <div className="field-underline"></div>
          </div>

          <div className="form-field">
            <textarea
              value={data.contentMarkdown || ''}
              onChange={e => onChange('contentMarkdown', e.target.value)}
              placeholder={translate('langleague.teacher.units.grammar.placeholders.content')}
              className="field-textarea"
              rows={6}
              onClick={e => e.stopPropagation()}
            />
            <div className="field-underline"></div>
            <span className="field-hint">{translate('langleague.teacher.units.grammar.fields.contentHint')}</span>
          </div>

          <div className="form-field">
            <textarea
              value={data.exampleUsage || ''}
              onChange={e => onChange('exampleUsage', e.target.value)}
              placeholder={translate('langleague.teacher.units.grammar.placeholders.example')}
              className="field-textarea"
              rows={4}
              onClick={e => e.stopPropagation()}
            />
            <div className="field-underline"></div>
            <span className="field-hint">{translate('langleague.teacher.units.grammar.fields.exampleHint')}</span>
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
              <FontAwesomeIcon icon={faCopy} /> {translate('langleague.teacher.units.form.actions.duplicate')}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
