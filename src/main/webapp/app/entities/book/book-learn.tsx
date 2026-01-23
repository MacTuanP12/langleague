import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/book/book.reducer';
import { fetchUnitsByBookId } from 'app/shared/reducers/unit.reducer';
import { LoadingSpinner } from 'app/shared/components';
import { Translate } from 'react-jhipster';
import 'app/modules/student/learning/book-learn.scss';

export const BookLearn = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  // Redux state
  const { entity: selectedBook, loading: bookLoading } = useAppSelector(state => state.book);
  const { units, loading: unitsLoading } = useAppSelector(state => state.unit);

  // Local UI state
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      dispatch(fetchUnitsByBookId(Number(id)));
    }
  }, [dispatch, id]);

  if (bookLoading || unitsLoading) {
    return <LoadingSpinner message="global.loading" isI18nKey />;
  }

  if (!selectedBook) {
    return null;
  }

  return (
    <div className="book-learn">
      <div className="learn-header">
        <Link to={`/books/${id}`} className="back-link">
          ← <Translate contentKey="langleague.student.learning.exercise.backToBook">Back to Book List</Translate>
        </Link>
        <h2>{selectedBook.title}</h2>
      </div>

      <div className="learn-content">
        <div className="units-sidebar">
          <div className="sidebar-header">
            <h3>
              <Translate contentKey="langleague.student.learning.bookContent">COURSE CONTENT</Translate>
            </h3>
          </div>

          <div className="units-list">
            {units.map(unit => (
              <div key={unit.id} className="unit-item">
                <div
                  className={`unit-header ${expandedUnit === unit.id ? 'active' : ''}`}
                  onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                >
                  <span className="unit-icon">
                    <i className="bi bi-play-fill"></i>
                  </span>
                  <span className="unit-title">{unit.title}</span>
                  <span className={`expand-icon ${expandedUnit === unit.id ? 'expanded' : ''}`}>
                    <i className="bi bi-chevron-right"></i>
                  </span>
                </div>

                {expandedUnit === unit.id && (
                  <div className="unit-sections">
                    <Link to={`/units/${unit.id}/vocabulary`} className="section-link">
                      <span className="section-icon">
                        <i className="bi bi-book"></i>
                      </span>
                      <Translate contentKey="langleague.student.learning.vocabulary.title">Vocabulary</Translate>
                    </Link>
                    <Link to={`/units/${unit.id}/grammar`} className="section-link">
                      <span className="section-icon">
                        <i className="bi bi-journal-text"></i>
                      </span>
                      <Translate contentKey="langleague.student.learning.grammar.title">Grammar</Translate>
                    </Link>
                    <Link to={`/units/${unit.id}/exercise`} className="section-link">
                      <span className="section-icon">
                        <i className="bi bi-pencil-square"></i>
                      </span>
                      <Translate contentKey="langleague.student.learning.exercise.title">Exercise</Translate>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="learn-main">
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>
              <Translate contentKey="langleague.student.learning.selectUnit">Ready to learn?</Translate>
            </h3>
            <p>
              <Translate contentKey="global.selectSection">Select a section from the sidebar to start learning.</Translate>
            </p>
            <p>
              <Translate contentKey="global.progressSaved">Your progress will be saved automatically.</Translate>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLearn;
