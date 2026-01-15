import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import '../book-learn.scss';

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
    <Link to={linkTo} className={`content-card ${variant}`}>
      <div className={`card-icon ${variant}`}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="card-content">
        <h3>{titleKey ? <Translate contentKey={titleKey}>{title}</Translate> : title}</h3>
        <p>{description}</p>
        <span className="item-count">{itemCount}</span>
      </div>
      <i className="bi bi-arrow-right"></i>
    </Link>
  );
};
