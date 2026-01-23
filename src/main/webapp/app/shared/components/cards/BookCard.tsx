import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Badge, Button } from 'reactstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IBook } from 'app/shared/model/book.model';
import SafeIcon from 'app/shared/components/SafeIcon';
import './BookCard.scss';

type BookCardMode = 'teacher' | 'student';

interface BookCardAction {
  label: string;
  icon: IconProp;
  onClick?: () => void;
  to?: string;
  color?: string;
  size?: string;
  outline?: boolean;
}

interface BookCardProps {
  book: IBook;
  mode: BookCardMode;
  progress?: number;
  status?: string;
  actions?: BookCardAction[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEnroll?: (id: number) => void;
  enrolledAt?: Date | string | null;
}

export const BookCard: React.FC<BookCardProps> = ({ book, mode, progress = 0, status, actions, onEdit, onDelete }) => {
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

    if (status === 'NOT_ENROLLED') {
      return [
        {
          label: 'langleague.student.books.viewDetails',
          icon: 'info-circle',
          to: `/student/books/${book.id}`,
          color: 'info',
        },
      ];
    }

    return [
      {
        label: status === 'COMPLETED' ? 'langleague.student.dashboard.book.continue' : 'langleague.student.dashboard.book.start',
        icon: status === 'COMPLETED' ? 'redo' : 'play-circle',
        to: `/student/learn/book/${book.id}`,
        color: 'primary',
      },
    ];
  };

  const displayActions = actions || getDefaultActions();

  return (
    <div className={`book-card book-card-${mode}`}>
      <div className="book-card-image">
        <img
          src={book.coverImageUrl || '/content/images/default-book.png'}
          alt={book.title}
          onError={e => (e.currentTarget.src = '/content/images/default-book.png')}
        />

        {mode === 'student' && status && (
          <Badge className={`book-badge ${status.toLowerCase()}`}>
            <SafeIcon icon={status === 'COMPLETED' ? 'check-circle' : 'plus-circle'} className="me-1" />
            <Translate contentKey={`langleague.student.dashboard.book.${status.toLowerCase()}`}>{status}</Translate>
          </Badge>
        )}

        {mode === 'teacher' && book.isPublic && (
          <Badge className="book-badge public">
            <SafeIcon icon="globe" className="me-1" />
            <Translate contentKey="langleague.teacher.books.form.fields.publicStatus">Public</Translate>
          </Badge>
        )}

        {mode === 'student' && progress > 0 && (
          <div className="progress-overlay">
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-text">{progress}% Complete</div>
          </div>
        )}
      </div>

      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-description">{book.description}</p>

        {mode === 'student' && (
          <div className="book-stats">
            <span className="stat-item">
              <SafeIcon icon="book-open" />
              <Translate contentKey="langleague.student.dashboard.book.units">Units</Translate>
            </span>
          </div>
        )}

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
            <SafeIcon icon={action.icon} className={action.size !== 'sm' ? 'me-2' : ''} />
            {action.size !== 'sm' && <Translate contentKey={action.label}>{action.label}</Translate>}
          </Button>
        ))}
      </div>
    </div>
  );
};
