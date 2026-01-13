import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './exercise-option.reducer';

export const ExerciseOption = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const exerciseOptionList = useAppSelector(state => state.exerciseOption.entities);
  const loading = useAppSelector(state => state.exerciseOption.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="exercise-option-heading" data-cy="ExerciseOptionHeading">
        <Translate contentKey="langleagueApp.exerciseOption.home.title">Exercise Options</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="langleagueApp.exerciseOption.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/exercise-option/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="langleagueApp.exerciseOption.home.createLabel">Create new Exercise Option</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {exerciseOptionList && exerciseOptionList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="langleagueApp.exerciseOption.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('optionText')}>
                  <Translate contentKey="langleagueApp.exerciseOption.optionText">Option Text</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('optionText')} />
                </th>
                <th className="hand" onClick={sort('isCorrect')}>
                  <Translate contentKey="langleagueApp.exerciseOption.isCorrect">Is Correct</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isCorrect')} />
                </th>
                <th className="hand" onClick={sort('orderIndex')}>
                  <Translate contentKey="langleagueApp.exerciseOption.orderIndex">Order Index</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('orderIndex')} />
                </th>
                <th>
                  <Translate contentKey="langleagueApp.exerciseOption.exercise">Exercise</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {exerciseOptionList.map((exerciseOption, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/exercise-option/${exerciseOption.id}`} color="link" size="sm">
                      {exerciseOption.id}
                    </Button>
                  </td>
                  <td>{exerciseOption.optionText}</td>
                  <td>{exerciseOption.isCorrect ? 'true' : 'false'}</td>
                  <td>{exerciseOption.orderIndex}</td>
                  <td>
                    {exerciseOption.exercise ? (
                      <Link to={`/exercise/${exerciseOption.exercise.id}`}>{exerciseOption.exercise.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/exercise-option/${exerciseOption.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/exercise-option/${exerciseOption.id}/edit`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/exercise-option/${exerciseOption.id}/delete`)}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="langleagueApp.exerciseOption.home.notFound">No Exercise Options found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ExerciseOption;
