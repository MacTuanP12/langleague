import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <Link to="/books" className="dropdown-item">
        <i className="bi bi-book"></i>
        <Translate contentKey="global.menu.entities.book" />
      </Link>
      <Link to="/units" className="dropdown-item">
        <i className="bi bi-list"></i>
        <Translate contentKey="global.menu.entities.unit" />
      </Link>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
