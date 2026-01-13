import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import styles from '../book-learn.module.scss';

interface UnitContentCardProps {
  icon: string;
  title: string;
  titleKey?: string;
  description: string;
  itemCount: string | number;
  linkTo: string;
  variant: 'vocabulary' | 'grammar' | 'exercise' | 'flashcard';
}

export const UnitContentCard: React.FC<UnitContentCardProps> = ({ icon, title, titleKey, description, itemCount, linkTo, variant }) => {
  return (
    <Link to={linkTo} className={`${styles.contentCard} ${styles[variant]}`}>
      <div className={`${styles.cardIcon} ${styles[variant]}`}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div className={styles.cardContent}>
        <h3>{titleKey ? <Translate contentKey={titleKey}>{title}</Translate> : title}</h3>
        <p>{description}</p>
        <span className={styles.itemCount}>{itemCount}</span>
      </div>
      <i className="bi bi-arrow-right"></i>
    </Link>
  );
};
