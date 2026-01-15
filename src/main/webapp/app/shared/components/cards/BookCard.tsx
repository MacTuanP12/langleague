import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Badge, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IBook } from 'app/shared/model/book.model';
import './BookCard.scss';

type BookCardMode = 'teacher' | 'student';

interface BookCardAction {
  label: string;
  icon: string;
  onClick?: () => void;
  to?: string;
  color?: string;
  size?: string;
  outline?: boolean;
}

interface BookCardProps {
  book: IBook;
  mode: BookCardMode;

  // Optional props for customization
  progress?: number;
  status?: string;
  actions?: BookCardAction[];

  // Teacher-specific
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;

  // Student-specific
  onEnroll?: (id: number) => void;
  enrolledAt?: Date | string | null;
}

/**
 * Unified BookCard component for both Teacher and Student modules
 *
 * @example Teacher Mode:
 * <BookCard
 *   mode="teacher"
 *   book={book}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 *
 * @example Student Mode:
 * <BookCard
 *   mode="student"
 *   book={book}
 *   progress={75}
 *   status="ACTIVE"
 * />
 */
export const BookCard: React.FC<BookCardProps> = ({
  book,
  mode,
  progress = 0,
  status,
  actions,
  onEdit,
  onDelete,
  // onEnroll and enrolledAt are optional and not used in current implementation
}) => {
  // Default actions based on mode
  const getDefaultActions = (): BookCardAction[] => {
    if (mode === 'teacher') {
      return [
        {
          label: 'langleague.teacher.dashboard.quickActions.manageContent',
          icon: 'list',
          to: `/teacher/books/${book.id}`,
          color: 'primary',
          size: 'sm',
        },
        {
          label: 'langleague.teacher.books.actions.edit',
          icon: 'pencil-alt',
          onClick: () => onEdit?.(book.id),
          color: 'secondary',
          size: 'sm',
          outline: true,
        },
        {
          label: 'langleague.teacher.books.actions.delete',
          icon: 'trash',
          onClick: () => onDelete?.(book.id),
          color: 'danger',
          size: 'sm',
          outline: true,
        },
      ];
    }

    // Student mode
    return [
      {
        label: status === 'COMPLETED' ? 'langleague.student.dashboard.book.continue' : 'langleague.student.dashboard.book.start',
        icon: status === 'COMPLETED' ? 'redo' : 'play-circle',
        to: `/student/books/${book.id}/learn`,
        color: 'primary',
      },
    ];
  };

  const displayActions = actions || getDefaultActions();

  return (
    <div className={`book-card book-card-${mode}`}>
      {/* Book Cover */}
      <div className="book-card-image">
        <img
          src={book.coverImageUrl || '/content/images/default-book.png'}
          alt={book.title}
          onError={e => (e.currentTarget.src = '/content/images/default-book.png')}
        />

        {/* Status Badge (Student) */}
        {mode === 'student' && status && (
          <Badge className={`book-badge ${status.toLowerCase()}`}>
            <FontAwesomeIcon icon={status === 'COMPLETED' ? 'check-circle' : 'plus-circle'} className="me-1" />
            <Translate contentKey={`langleague.student.dashboard.book.${status.toLowerCase()}`}>{status}</Translate>
          </Badge>
        )}

        {/* Public Badge (Teacher) */}
        {mode === 'teacher' && book.isPublic && (
          <Badge className="book-badge public">
            <FontAwesomeIcon icon="globe" className="me-1" />
            <Translate contentKey="langleague.teacher.books.form.fields.publicStatus">Public</Translate>
          </Badge>
        )}

        {/* Progress Overlay (Student) */}
        {mode === 'student' && progress > 0 && (
          <div className="progress-overlay">
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-text">{progress}% Complete</div>
          </div>
        )}
      </div>

      {/* Book Content */}
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-description">{book.description}</p>

        {/* Book Stats */}
        {mode === 'student' && (
          <div className="book-stats">
            <span className="stat-item">
              <FontAwesomeIcon icon="book-open" />
              <Translate contentKey="langleague.student.dashboard.book.units">Units</Translate>
            </span>
          </div>
        )}

        {/* Teacher Status */}
        {mode === 'teacher' && (
          <div className="book-meta">
            <span className={`book-status ${book.isPublic ? 'public' : 'private'}`}>
              {book.isPublic ? (
                <Translate contentKey="langleague.teacher.books.form.fields.publicStatus">Public</Translate>
              ) : (
                <Translate contentKey="langleague.teacher.books.form.fields.privateStatus">Private</Translate>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="book-card-actions">
        {displayActions.map((action, index) => (
          <Button
            key={index}
            {...(action.to ? { tag: Link, to: action.to } : {})}
            onClick={action.onClick}
            color={action.color || 'primary'}
            size={action.size}
            outline={action.outline}
            className={action.size === 'sm' ? 'btn-icon' : ''}
            title={action.label}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <FontAwesomeIcon icon={action.icon as any} className={action.size !== 'sm' ? 'me-2' : ''} />
            {action.size !== 'sm' && <Translate contentKey={action.label}>{action.label}</Translate>}
          </Button>
        ))}
      </div>
    </div>
  );
};
