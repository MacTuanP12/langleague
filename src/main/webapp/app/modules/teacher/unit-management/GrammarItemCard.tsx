import React, { useState } from 'react';
import { IGrammar } from 'app/shared/model/grammar.model';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faBook, faTrash, faChevronUp, faChevronDown, faCopy, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import { SimpleMarkdownEditor } from 'app/shared/components/markdown-editor/simple-markdown-editor';

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
    const [showPreview, setShowPreview] = useState(false);
    const [showExamplePreview, setShowExamplePreview] = useState(false);
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
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="field-hint small text-muted">
                <FontAwesomeIcon icon="info-circle" className="me-1" />
                Markdown supported
              </span>
              <button
                type="button"
                className="btn btn-link btn-sm p-0"
                onClick={e => {
                  e.stopPropagation();
                  setShowPreview(!showPreview);
                }}
              >
                <FontAwesomeIcon icon={showPreview ? faEyeSlash : faEye} className="me-1" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
            {!showPreview ? (
              <textarea
                value={data.contentMarkdown || ''}
                onChange={e => onChange('contentMarkdown', e.target.value)}
                placeholder={translate('langleague.teacher.units.grammar.placeholders.content')}
                className="field-textarea"
                rows={6}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <div
                className="field-textarea markdown-preview"
                style={{
                  minHeight: '150px',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  backgroundColor: '#f8f9fa',
                }}
                onClick={e => e.stopPropagation()}
              >
                <ReactMarkdown>{data.contentMarkdown || ''}</ReactMarkdown>
              </div>
            )}
            <div className="field-underline"></div>
            <span className="field-hint">{translate('langleague.teacher.units.grammar.fields.contentHint')}</span>
          </div>

          <div className="form-field">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="field-hint small text-muted">
                <FontAwesomeIcon icon="info-circle" className="me-1" />
                Markdown supported
              </span>
              <button
                type="button"
                className="btn btn-link btn-sm p-0"
                onClick={e => {
                  e.stopPropagation();
                  setShowExamplePreview(!showExamplePreview);
                }}
              >
                <FontAwesomeIcon icon={showExamplePreview ? faEyeSlash : faEye} className="me-1" />
                {showExamplePreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
            {!showExamplePreview ? (
              <div onClick={e => e.stopPropagation()}>
                <SimpleMarkdownEditor
                  value={data.exampleUsage || ''}
                  onChange={value => onChange('exampleUsage', value)}
                  placeholder={translate('langleague.teacher.units.grammar.placeholders.example')}
                  minHeight={120}
                />
              </div>
            ) : (
              <div
                className="field-textarea markdown-preview"
                style={{
                  minHeight: '100px',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  backgroundColor: '#f8f9fa',
                }}
                onClick={e => e.stopPropagation()}
              >
                <ReactMarkdown>{data.exampleUsage || ''}</ReactMarkdown>
              </div>
            )}
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
