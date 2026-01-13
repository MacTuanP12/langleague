import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchBookById } from 'app/shared/reducers/book.reducer';
import { fetchUnitsByBookId } from 'app/shared/reducers/unit.reducer';
import { LoadingSpinner } from 'app/shared/components';
import styles from 'app/modules/student/learning/book-learn.module.scss';

export const BookLearn = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  // Redux state
  const { selectedBook, loading: bookLoading } = useAppSelector(state => state.book);
  const { units, loading: unitsLoading } = useAppSelector(state => state.unit);

  // Local UI state
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(Number(id)));
      dispatch(fetchUnitsByBookId(Number(id)));
    }
  }, [dispatch, id]);

  if (bookLoading || unitsLoading) {
    return <LoadingSpinner message="Loading book..." />;
  }

  if (!selectedBook) {
    return null;
  }

  return (
    <div className={styles.bookLearn}>
      <div className={styles.learnHeader}>
        <Link to={`/books/${id}`} className={styles.backLink}>
          ← Back to Book List
        </Link>
        <h2>{selectedBook.title}</h2>
      </div>

      <div className={styles.learnContent}>
        <div className={styles.unitsSidebar}>
          <div className={styles.sidebarHeader}>
            <h3>COURSE CONTENT</h3>
          </div>

          <div className={styles.unitsList}>
            {units.map(unit => (
              <div key={unit.id} className={styles.unitItem}>
                <div
                  className={`${styles.unitHeader} ${expandedUnit === unit.id ? styles.active : ''}`}
                  onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                >
                  <span className={styles.unitIcon}>
                    <i className="bi bi-play-fill"></i>
                  </span>
                  <span className={styles.unitTitle}>{unit.title}</span>
                  <span className={`${styles.expandIcon} ${expandedUnit === unit.id ? styles.expanded : ''}`}>
                    <i className="bi bi-chevron-right"></i>
                  </span>
                </div>

                {expandedUnit === unit.id && (
                  <div className={styles.unitSections}>
                    <Link to={`/units/${unit.id}/vocabulary`} className={styles.sectionLink}>
                      <span className={styles.sectionIcon}>
                        <i className="bi bi-book"></i>
                      </span>
                      Vocabulary
                    </Link>
                    <Link to={`/units/${unit.id}/grammar`} className={styles.sectionLink}>
                      <span className={styles.sectionIcon}>
                        <i className="bi bi-journal-text"></i>
                      </span>
                      Grammar
                    </Link>
                    <Link to={`/units/${unit.id}/exercise`} className={styles.sectionLink}>
                      <span className={styles.sectionIcon}>
                        <i className="bi bi-pencil-square"></i>
                      </span>
                      Exercise
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.learnMain}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎓</div>
            <h3>Ready to learn?</h3>
            <p>Select a section from the sidebar to start learning.</p>
            <p>Your progress will be saved automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLearn;
