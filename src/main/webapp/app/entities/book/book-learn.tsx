import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';
import { IUnit } from 'app/shared/model/unit.model';

export const BookLearn = () => {
  const [book, setBook] = useState<IBook | null>(null);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadBook();
      loadUnits();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error loading book:', error);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await axios.get(`/api/books/${id}/units`);
      setUnits(response.data);
    } catch (error) {
      console.error('Error loading units:', error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-learn">
      <div className="learn-header">
        <Link to={`/books/${id}`} className="back-link">
          ← Back to Book List
        </Link>
        <h2>{book.title}</h2>
      </div>

      <div className="learn-content">
        <div className="units-sidebar">
          <div className="sidebar-header">
            <h3>COURSE CONTENT</h3>
          </div>

          <div className="units-list">
            {units.map(unit => (
              <div key={unit.id} className="unit-item">
                <div className="unit-header" onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}>
                  <span className="unit-icon">▶</span>
                  <span className="unit-title">{unit.title}</span>
                  <span className={`expand-icon ${expandedUnit === unit.id ? 'expanded' : ''}`}>›</span>
                </div>

                {expandedUnit === unit.id && (
                  <div className="unit-sections">
                    <Link to={`/units/${unit.id}/vocabulary`} className="section-link">
                      <span className="section-icon">📚</span>
                      Vocabulary
                    </Link>
                    <Link to={`/units/${unit.id}/grammar`} className="section-link">
                      <span className="section-icon">📝</span>
                      Grammar
                    </Link>
                    <Link to={`/units/${unit.id}/exercise`} className="section-link">
                      <span className="section-icon">✏️</span>
                      Exercise
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
