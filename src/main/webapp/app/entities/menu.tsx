import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { useAppSelector } from 'app/config/store';

const EntitiesMenu = () => {
  const account = useAppSelector(state => state.authentication.account);
  const isAdmin = account?.authorities?.includes('ROLE_ADMIN');
  const isTeacher = account?.authorities?.includes('ROLE_TEACHER');

  return (
    <>
      {/* Admin only - User Profile management */}
      {isAdmin && (
        <Link to="/user-profile" className="dropdown-item">
          <Translate contentKey="global.menu.entities.userProfile" />
        </Link>
      )}

      {/* Teacher only - Content management (không có enrollment và progress) */}
      {isTeacher && (
        <>
          <Link to="/book" className="dropdown-item">
            <Translate contentKey="global.menu.entities.book" />
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
        </>
      )}

      {/* Student only - Enrollment và Progress (chỉ Student có quyền truy cập) */}
      {account?.authorities?.includes('ROLE_STUDENT') && (
        <>
          <Link to="/enrollment" className="dropdown-item">
            <Translate contentKey="global.menu.entities.enrollment" />
          </Link>
          <Link to="/progress" className="dropdown-item">
            <Translate contentKey="global.menu.entities.progress" />
          </Link>
        </>
      )}
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
