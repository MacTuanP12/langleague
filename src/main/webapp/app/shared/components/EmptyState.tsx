import React from 'react';
import { Translate } from 'react-jhipster';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './EmptyState.scss';

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  to?: string;
  icon?: string;
  color?: string;
}

interface EmptyStateProps {
  /** Icon to display (e.g., 'book', 'inbox', 'search') */
  icon: IconProp;

  /** Title translation key or raw text */
  title: string;

  /** Description translation key or raw text */
  description?: string;

  /** Whether title and description are i18n keys (default: true) */
  isI18nKey?: boolean;

  /** Optional action button */
  action?: EmptyStateAction;

  /** Multiple actions */
  actions?: EmptyStateAction[];

  /** Variant style: 'default' | 'teacher' | 'student' */
  variant?: 'default' | 'teacher' | 'student';

  /** Custom className */
  className?: string;
}

/**
 * Reusable EmptyState component for displaying "no data" states
 *
 * @example Basic usage:
 * <EmptyState
 *   icon="book"
 *   title="langleague.common.noData"
 *   description="langleague.common.noDataDescription"
 * />
 *
 * @example With action:
 * <EmptyState
 *   icon="plus"
 *   title="No books yet"
 *   description="Create your first book"
 *   isI18nKey={false}
 *   action={{
 *     label: 'Create Book',
 *     onClick: handleCreate,
 *     icon: 'plus',
 *     color: 'primary'
 *   }}
 * />
 *
 * @example Teacher variant:
 * <EmptyState
 *   icon="inbox"
 *   title="langleague.teacher.books.management.noBooks"
 *   variant="teacher"
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  isI18nKey = true,
  action,
  actions,
  variant = 'default',
  className = '',
}) => {
  const allActions = actions || (action ? [action] : []);

  return (
    <div className={`empty-state empty-state-${variant} ${className}`}>
      <div className="empty-state-icon">
        <FontAwesomeIcon icon={icon} />
      </div>

      <h3 className="empty-state-title">{isI18nKey ? <Translate contentKey={title}>{title}</Translate> : title}</h3>

      {description && (
        <p className="empty-state-description">{isI18nKey ? <Translate contentKey={description}>{description}</Translate> : description}</p>
      )}

      {allActions.length > 0 && (
        <div className="empty-state-actions">
          {allActions.map((act, index) => (
            <Button key={index} color={act.color || 'primary'} onClick={act.onClick} {...(act.to ? { tag: 'a', href: act.to } : {})}>
              {act.icon && <FontAwesomeIcon icon={act.icon as IconProp} className="me-2" />}
              {isI18nKey ? <Translate contentKey={act.label}>{act.label}</Translate> : act.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
