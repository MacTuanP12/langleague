import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';
import { IUnit } from 'app/shared/model/unit.model';
import { UnitProgressIndicator } from 'app/shared/components/progress';
import { ProgressBar } from 'app/shared/components/progress';
import { LoadingSpinner } from 'app/shared/components';
import './book-learn.scss';

export const BookLearn = () => {
  const [book, setBook] = useState<IBook | null>(null);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadBook();
      loadUnits();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      const response = await axios.get<IBook>(`/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error loading book:', error);
      toast.error('Failed to load book. Please try again.');
    }
  };

  const loadUnits = async () => {
    try {
      const response = await axios.get<IUnit[]>(`/api/books/${id}/units`);
      setUnits(response.data);
    } catch (error) {
      console.error('Error loading units:', error);
      toast.error('Failed to load units. Please try again.');
    }
  };

  const handleUnitClick = (unit: IUnit) => {
    if (expandedUnit === unit.id) {
      setExpandedUnit(null);
      setSelectedUnit(null);
    } else {
      setExpandedUnit(unit.id);
      setSelectedUnit(unit);
    }
  };

  if (!book) {
    return <LoadingSpinner message="langleague.student.learning.loading" isI18nKey />;
  }

  return (
    <div className="book-learn">
      <div className="learn-header">
        <Link to={`/student/books/${id}`} className="back-link">
          ← Back to Book Detail
        </Link>
        <h2>{book.title}</h2>
      </div>

      <div className="learn-content">
        <div className="units-sidebar">
          <div className="sidebar-header">
            <h3>COURSE CONTENT</h3>
          </div>

          <div className="units-list">
            {units.length === 0 ? (
              <div className="empty-state">
                <p>No units available yet</p>
              </div>
            ) : (
              units.map(unit => (
                <div key={unit.id} className="unit-item">
                <div className={`unit-header ${selectedUnit?.id === unit.id ? 'active' : ''}`} onClick={() => handleUnitClick(unit)}>
                  <span className="unit-icon"><i className="bi bi-play-fill"></i></span>
                  <span className="unit-title">{unit.title}</span>
                  <UnitProgressIndicator progress={unit.progresses?.[0]} compact />
                  <span className={`expand-icon ${expandedUnit === unit.id ? 'expanded' : ''}`}><i className="bi bi-chevron-right"></i></span>
                </div>

                {expandedUnit === unit.id && (
                  <div className="unit-sections">
                    <Link to={`/student/learn/unit/${unit.id}/vocabulary`} className="section-link">
                      <span className="section-icon"><i className="bi bi-book"></i></span>
                      Vocabulary
                    </Link>
                    <Link to={`/student/learn/unit/${unit.id}/grammar`} className="section-link">
                      <span className="section-icon"><i className="bi bi-journal-text"></i></span>
                      Grammar
                    </Link>
                    <Link to={`/student/learn/unit/${unit.id}/exercise`} className="section-link">
                      <span className="section-icon"><i className="bi bi-pencil-square"></i></span>
                      Exercise
                    </Link>
                    <Link to={`/student/learn/unit/${unit.id}/flashcard`} className="section-link">
                      <span className="section-icon"><i className="bi bi-card-text"></i></span>
                      Flashcard
                    </Link>
                  </div>
                )}
              </div>
              ))
            )}
          </div>
        </div>

        <div className="learn-main">
          {selectedUnit ? (
            <div className="unit-content">
              <div className="unit-header-info">
                <h2>{selectedUnit.title}</h2>
                <p className="unit-summary">{selectedUnit.summary}</p>
              </div>

              <div className="content-sections">
                <Link to={`/student/learn/unit/${selectedUnit.id}/vocabulary`} className="content-card">
                  <div className="card-icon vocabulary"><i className="bi bi-book"></i></div>
                  <div className="card-content">
                    <h3><Translate contentKey="langleague.student.learning.vocabulary.title">Vocabulary</Translate></h3>
                    <p>Learn new words and their meanings</p>
                    <span className="item-count">{selectedUnit.vocabularyCount || 0} words</span>
                  </div>
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link to={`/student/learn/unit/${selectedUnit.id}/grammar`} className="content-card">
                  <div className="card-icon grammar"><i className="bi bi-journal-text"></i></div>
                  <div className="card-content">
                    <h3><Translate contentKey="langleague.student.learning.grammar.title">Grammar</Translate></h3>
                    <p>Master grammar rules and structures</p>
                    <span className="item-count">{selectedUnit.grammarCount || 0} topics</span>
                  </div>
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link to={`/student/learn/unit/${selectedUnit.id}/exercise`} className="content-card">
                  <div className="card-icon exercise"><i className="bi bi-pencil-square"></i></div>
                  <div className="card-content">
                    <h3><Translate contentKey="langleague.student.learning.exercise.title">Exercise</Translate></h3>
                    <p>Practice what you&apos;ve learned</p>
                    <span className="item-count">{selectedUnit.exerciseCount || 0} questions</span>
                  </div>
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link to={`/student/learn/unit/${selectedUnit.id}/flashcard`} className="content-card">
                  <div className="card-icon flashcard"><i className="bi bi-card-text"></i></div>
                  <div className="card-content">
                    <h3><Translate contentKey="langleague.student.learning.flashcard.title">Flashcard</Translate></h3>
                    <p>Review vocabulary with flashcards</p>
                    <span className="item-count">Interactive learning</span>
                  </div>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="unit-progress">
                <h4><Translate contentKey="langleague.student.learning.bookLearn.progress">Your Progress</Translate></h4>
                <ProgressBar progress={0} height="medium" color="gradient" ariaLabel="Unit progress" />
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h3>Ready to learn?</h3>
              <p>Select a unit from the sidebar to start learning.</p>
              <p>Your progress will be saved automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookLearn;
