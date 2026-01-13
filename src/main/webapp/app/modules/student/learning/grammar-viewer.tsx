import React from 'react';
import ReactMarkdown from 'react-markdown';
import { IGrammar } from 'app/shared/model/grammar.model';
import styles from './book-learn.module.scss';

interface GrammarViewerProps {
  grammars: IGrammar[];
}

export const GrammarViewer: React.FC<GrammarViewerProps> = ({ grammars }) => {
  if (!grammars || grammars.length === 0) {
    return <div className={styles.emptyState}>No grammar lessons available.</div>;
  }

  return (
    <div className={styles.grammarViewer}>
      {grammars.map(grammar => (
        <div key={grammar.id} className={styles.grammarCard}>
          <h3 className={styles.grammarTitle}>{grammar.title}</h3>

          {grammar.contentMarkdown && (
            <div className={styles.grammarContent}>
              <ReactMarkdown>{grammar.contentMarkdown}</ReactMarkdown>
            </div>
          )}

          {grammar.exampleUsage && (
            <div className={styles.grammarExample}>
              <h4>Examples:</h4>
              <div className={styles.exampleContent}>
                <ReactMarkdown>{grammar.exampleUsage}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
