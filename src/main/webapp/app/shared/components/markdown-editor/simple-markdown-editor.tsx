import React, { useMemo, useCallback } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './simple-markdown-editor.scss';

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  readOnly?: boolean;
  minHeight?: number;
  disableFullscreen?: boolean; // Disable fullscreen when used in modals
}

/**
 * Simple Markdown Editor Component
 * A lightweight wrapper around SimpleMDE for use in forms
 * Provides full markdown editing toolbar without the complexity of MarkdownNoteEditor
 */
export const SimpleMarkdownEditor: React.FC<SimpleMarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Supports Markdown formatting...',
  id,
  className = '',
  readOnly = false,
  minHeight = 200,
  disableFullscreen = false,
}) => {
  // Memoize SimpleMDE options to prevent re-initialization
  const editorOptions = useMemo(() => {
    const toolbar = [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      'image',
      'code',
      'table',
      '|',
      'preview',
      'side-by-side',
    ];

    // Only add fullscreen if not disabled (for modal usage)
    if (!disableFullscreen) {
      toolbar.push('fullscreen');
    }

    toolbar.push('|', 'guide');

    return {
      spellChecker: false,
      status: false,
      placeholder,
      autofocus: false,
      toolbar,
      minHeight: `${minHeight}px`,
      readOnly,
    };
  }, [placeholder, minHeight, readOnly, disableFullscreen]);

  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange],
  );

  return (
    <div className={`simple-markdown-editor ${className}`}>
      <SimpleMDE value={value} onChange={handleChange} options={editorOptions} id={id} />
    </div>
  );
};

export default SimpleMarkdownEditor;
