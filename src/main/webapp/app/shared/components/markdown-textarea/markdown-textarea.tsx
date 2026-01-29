import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Input, Button, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './markdown-textarea.scss';

interface MarkdownTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  className?: string;
  showPreview?: boolean; // Allow parent to control preview
  readOnly?: boolean;
}

export const MarkdownTextarea: React.FC<MarkdownTextareaProps> = ({
  value,
  onChange,
  placeholder = 'Supports Markdown formatting...',
  rows = 5,
  id,
  className = '',
  showPreview: externalShowPreview,
  readOnly = false,
}) => {
  const [internalShowPreview, setInternalShowPreview] = useState(false);
  const showPreview = externalShowPreview !== undefined ? externalShowPreview : internalShowPreview;

  return (
    <div className={`markdown-textarea-wrapper ${className}`}>
      <div className="markdown-textarea-header">
        <small className="text-muted">
          <FontAwesomeIcon icon="info-circle" className="me-1" />
          Markdown supported (bold, italic, lists, links, etc.)
        </small>
        {externalShowPreview === undefined && (
          <Button color="link" size="sm" onClick={() => setInternalShowPreview(!internalShowPreview)} className="preview-toggle-btn">
            <FontAwesomeIcon icon={showPreview ? faEyeSlash : faEye} className="me-1" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        )}
      </div>
      <div className="markdown-textarea-content">
        <Collapse isOpen={!showPreview}>
          <Input
            type="textarea"
            id={id}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            readOnly={readOnly}
            className="markdown-textarea-input"
          />
        </Collapse>
        <Collapse isOpen={showPreview}>
          <div className="markdown-textarea-preview">
            {value ? <ReactMarkdown>{value}</ReactMarkdown> : <div className="text-muted font-italic">{placeholder}</div>}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default MarkdownTextarea;
