import React from 'react';
import ReactMarkdown from 'react-markdown';
import { IGrammar } from 'app/shared/model/grammar.model';
import './book-learn.scss';

interface GrammarViewerProps {
  grammars: IGrammar[];
}

export const GrammarViewer: React.FC<GrammarViewerProps> = ({ grammars }) => {
  if (!grammars || grammars.length === 0) {
    return (
      <div className="empty-state">
        <p>No grammar lessons available.</p>
      </div>
    );
  }

  return (
    <div className="grammar-list">
      {grammars.map(grammar => (
        <div key={grammar.id} className="grammar-card">
          <div className="grammar-title">{grammar.title}</div>

          {grammar.contentMarkdown && (
            <div className="grammar-content">
              <ReactMarkdown>{grammar.contentMarkdown}</ReactMarkdown>
            </div>
          )}

          {grammar.exampleUsage && (
            <div className="grammar-example">
              <strong>Example:</strong>
              <ReactMarkdown>{grammar.exampleUsage}</ReactMarkdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
