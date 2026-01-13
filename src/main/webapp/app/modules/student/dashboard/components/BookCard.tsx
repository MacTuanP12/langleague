import React from 'react';
import { translate } from 'react-jhipster';
import { EnrolledBook } from '../dashboard.constants';
import { ProgressBar } from 'app/shared/components/progress';

interface BookCardProps {
  book: EnrolledBook;
}

/**
 * BookCard component - Displays individual book information in the dashboard
 */
export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const getButtonText = () => {
    switch (book.status) {
      case 'COMPLETED':
        return translate('langleague.student.dashboard.book.continue');
      case 'ENROLLED':
        return translate('langleague.student.dashboard.book.start') + ' →';
      default:
        return translate('langleague.student.dashboard.book.continue') + ' →';
    }
  };

  return (
    <div className="book-card">
      {book.status === 'COMPLETED' && <div className="badge-completed">✓ COMPLETED</div>}
      {book.status === 'ENROLLED' && <div className="badge-enrolled">⊕ ENROLLED</div>}

      <div className="book-cover" style={{ backgroundColor: book.coverColor }}>
        <div className="book-placeholder">{book.title}</div>
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p>{book.description}</p>

        {book.status !== 'ENROLLED' && (
          <div className="progress-section">
            <ProgressBar progress={book.progress} height="small" color="gradient" />
          </div>
        )}

        <button className="enroll-btn" aria-label={getButtonText()}>
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};
