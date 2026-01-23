import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './markdown-note-editor.scss';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';

interface MarkdownNoteEditorProps {
  initialValue?: string;
  value?: string; // For controlled component usage
  onChange?: (value: string) => void; // For controlled component usage
  onSave: (value: string) => void;
  onDelete?: () => void;
  onEdit?: () => void; // Callback when edit button is clicked
  onCancel?: () => void; // Callback when cancel is clicked
  placeholder?: string;
  readOnly?: boolean;
  isUpdate?: boolean; // true if editing existing note, false if creating new
  showEditButton?: boolean; // Show edit button in read-only mode
  showPreview?: boolean; // Show preview mode when editing
  disabled?: boolean; // Disable all interactions
}

export const MarkdownNoteEditor: React.FC<MarkdownNoteEditorProps> = ({
  initialValue = '',
  value: controlledValue,
  onChange: onControlledChange,
  onSave,
  onDelete,
  onEdit,
  onCancel,
  placeholder,
  readOnly = false,
  isUpdate = false,
  showEditButton = false,
  showPreview = false,
  disabled = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const [tempValue, setTempValue] = useState(controlledValue !== undefined ? controlledValue : initialValue);

  // Use translated placeholder if not provided
  const displayPlaceholder = placeholder || translate('langleague.student.learning.notes.placeholder');

  // Memoize SimpleMDE options to prevent re-initialization
  const editorOptions = useMemo(
    () => ({
      spellChecker: false,
      status: false,
      placeholder: displayPlaceholder,
      autofocus: true,
      toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'preview', '|', 'guide'],
    }),
    [displayPlaceholder],
  );

  useEffect(() => {
    if (controlledValue !== undefined) {
      setTempValue(controlledValue);
    } else {
      setValue(initialValue);
      setTempValue(initialValue);
    }
  }, [initialValue, controlledValue]);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(); // Use parent callback if provided
    } else {
      setTempValue(value);
    }
  };

  const handleSave = () => {
    if (controlledValue === undefined) {
      setValue(tempValue);
    }
    onSave(tempValue);
  };

  const handleCancel = () => {
    if (controlledValue === undefined) {
      setTempValue(value);
    }
    if (onCancel) {
      onCancel(); // Call parent callback
    }
  };

  const handleChange = useCallback(
    (val: string) => {
      setTempValue(val);
      if (onControlledChange) {
        onControlledChange(val);
      }
    },
    [onControlledChange],
  );

  // Editing mode with optional preview
  if (!readOnly) {
    return (
      <div className={`markdown-note-editor ${showPreview ? 'split-view' : 'editing'}`}>
        {showPreview ? (
          // Split view: Editor + Preview side by side
          <div className="split-editor-container">
            <div className="editor-pane">
              <SimpleMDE
                key={`editor-${isUpdate ? 'update' : 'create'}`}
                value={tempValue}
                onChange={handleChange}
                options={editorOptions}
              />
            </div>
            <div className="preview-pane">
              <div className="preview-header">
                <FontAwesomeIcon icon="eye" className="me-2" />
                <Translate contentKey="langleague.student.learning.notes.preview">Preview</Translate>
              </div>
              <div className="preview-content">
                {tempValue ? (
                  <ReactMarkdown>{tempValue}</ReactMarkdown>
                ) : (
                  <div className="empty-preview">
                    <Translate contentKey="langleague.student.learning.notes.emptyPreview">Nothing to preview yet...</Translate>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Normal editing mode
          <SimpleMDE key={`editor-${isUpdate ? 'update' : 'create'}`} value={tempValue} onChange={handleChange} options={editorOptions} />
        )}

        <div className="editor-actions">
          <div className="left-actions">
            {isUpdate && onDelete && (
              <Button color="danger" size="sm" onClick={onDelete} outline>
                <FontAwesomeIcon icon="trash" className="me-1" />
                <Translate contentKey="entity.action.delete">Delete</Translate>
              </Button>
            )}
          </div>
          <div className="right-actions">
            <Button color="secondary" size="sm" onClick={handleCancel} className="me-2">
              <FontAwesomeIcon icon="times" className="me-1" />
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button color="primary" size="sm" onClick={handleSave}>
              <FontAwesomeIcon icon="save" className="me-1" />
              {isUpdate ? (
                <Translate contentKey="langleague.student.learning.notes.updateButton">Update Note</Translate>
              ) : (
                <Translate contentKey="langleague.student.learning.notes.addButton">Add Note</Translate>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Read-only view mode
  return (
    <div className="markdown-note-viewer read-only">
      {value ? <ReactMarkdown>{value}</ReactMarkdown> : <div className="empty-placeholder">{displayPlaceholder}</div>}
      {showEditButton && (
        <div className="viewer-actions">
          <Button color="primary" size="sm" onClick={handleEdit} disabled={disabled}>
            <FontAwesomeIcon icon="pen" className="me-1" />
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </Button>
          {onDelete && (
            <Button color="danger" size="sm" onClick={onDelete} outline className="ms-2" disabled={disabled}>
              <FontAwesomeIcon icon="trash" className="me-1" />
              <Translate contentKey="entity.action.delete">Delete</Translate>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownNoteEditor;
