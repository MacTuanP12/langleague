import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchBookById } from 'app/shared/reducers/book.reducer';
import { fetchUnitsByBookId } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId } from 'app/shared/reducers/vocabulary.reducer';
import { fetchGrammarsByUnitId } from 'app/shared/reducers/grammar.reducer';
import { fetchMyProgresses } from 'app/shared/reducers/progress.reducer';
import { IUnit } from 'app/shared/model/unit.model';
import { LessonSkeleton, ContentSidebar, UnitList } from 'app/shared/components';
import { BookLearnContent } from './components/BookLearnContent';
import styles from './book-learn.module.scss';

export const BookLearn = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Redux state
  const selectedBook = useAppSelector(state => state.book.selectedBook);
  const bookLoading = useAppSelector(state => state.book.loading);
  const units = useAppSelector(state => state.unit.units);
  const unitsLoading = useAppSelector(state => state.unit.loading);

  // Local UI state
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);

  useEffect(() => {
    if (id) {
      const bookId = Number(id);
      dispatch(fetchBookById(bookId));
      dispatch(fetchUnitsByBookId(bookId));
      dispatch(fetchMyProgresses());
    }
  }, [id, dispatch]);

  const handleUnitClick = (unit: IUnit) => {
    if (expandedUnit === unit.id) {
      setExpandedUnit(null);
      setSelectedUnit(null);
    } else {
      setExpandedUnit(unit.id);
      setSelectedUnit(unit);

      // Lazy load content for the selected unit
      dispatch(fetchVocabulariesByUnitId(unit.id));
      dispatch(fetchGrammarsByUnitId(unit.id));
    }
  };

  // Loading state - Show lesson skeleton
  if (bookLoading || (unitsLoading && units.length === 0)) {
    return (
      <div className={styles?.bookLearn || 'book-learn'}>
        <div className={styles?.learnHeader || 'learn-header'}>
          <Link to={`/student/books/${id}`} className={styles?.backLink || 'back-link'}>
            <i className="bi bi-arrow-left"></i> Back to Book Detail
          </Link>
        </div>
        <LessonSkeleton />
      </div>
    );
  }

  if (!selectedBook) {
    return null;
  }

  return (
    <div className={styles?.bookLearn || 'book-learn'}>
      <div className={styles?.learnHeader || 'learn-header'}>
        <Link to={`/student/books/${id}`} className={styles?.backLink || 'back-link'}>
          <i className="bi bi-arrow-left"></i> Back to Book Detail
        </Link>
        <h2>{selectedBook.title}</h2>
      </div>
      <div className={styles?.learnContent || 'learn-content'}>
        <ContentSidebar title="BOOK CONTENT" className={styles?.unitsSidebar || 'units-sidebar'}>
          <UnitList
            units={units}
            selectedUnitId={selectedUnit?.id || null}
            expandedUnitId={expandedUnit}
            onUnitClick={handleUnitClick}
            loading={unitsLoading}
          />
        </ContentSidebar>
        <BookLearnContent selectedUnit={selectedUnit} />
      </div>
    </div>
  );
};

export default BookLearn;
