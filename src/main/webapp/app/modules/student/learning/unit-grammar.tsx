import React from 'react';
import { IGrammar } from 'app/shared/model/grammar.model';
import ReactMarkdown from 'react-markdown';
import './unit-grammar-widget.scss'; // Widget styling

interface UnitGrammarProps {
  data: IGrammar[];
}

export const UnitGrammar: React.FC<UnitGrammarProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="grammar-empty">No grammar lessons available</div>;
  }

  return (
    <div className="grammar-widget">
      {data.map((grammar, index) => (
        <div key={grammar.id} className="grammar-card">
          {/* Grammar Header */}
          <div className="grammar-header">
            <span className="grammar-number">{index + 1}</span>
            <h3 className="grammar-title">{grammar.title}</h3>
          </div>

          {/* Grammar Content (Markdown) */}
          <div className="grammar-content">
            <ReactMarkdown>{grammar.contentMarkdown || ''}</ReactMarkdown>
          </div>

          {/* Example Usage */}
          {grammar.exampleUsage && (
            <div className="grammar-example">
              <strong>Example:</strong>
              <p>{grammar.exampleUsage}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UnitGrammar;
