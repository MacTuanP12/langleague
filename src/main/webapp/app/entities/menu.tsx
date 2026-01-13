import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <Link to="/user-profile" className="dropdown-item">
        <Translate contentKey="global.menu.entities.userProfile" />
      </Link>
      <Link to="/book" className="dropdown-item">
        <Translate contentKey="global.menu.entities.book" />
      </Link>
      <Link to="/enrollment" className="dropdown-item">
        <Translate contentKey="global.menu.entities.enrollment" />
      </Link>
      <Link to="/unit" className="dropdown-item">
        <Translate contentKey="global.menu.entities.unit" />
      </Link>
      <Link to="/vocabulary" className="dropdown-item">
        <Translate contentKey="global.menu.entities.vocabulary" />
      </Link>
      <Link to="/grammar" className="dropdown-item">
        <Translate contentKey="global.menu.entities.grammar" />
      </Link>
      <Link to="/exercise" className="dropdown-item">
        <Translate contentKey="global.menu.entities.exercise" />
      </Link>
      <Link to="/exercise-option" className="dropdown-item">
        <Translate contentKey="global.menu.entities.exerciseOption" />
      </Link>
      <Link to="/progress" className="dropdown-item">
        <Translate contentKey="global.menu.entities.progress" />
      </Link>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
