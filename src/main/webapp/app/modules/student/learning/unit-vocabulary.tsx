import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId } from 'app/shared/reducers/vocabulary.reducer';
import {Translate} from "react-jhipster";

export const UnitVocabulary = () => {
  const dispatch = useAppDispatch();
  const { selectedUnit } = useAppSelector(state => state.unit);
  const { vocabularies } = useAppSelector(state => state.vocabulary);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (unitId) {
      dispatch(fetchUnitById(unitId));
      dispatch(fetchVocabulariesByUnitId(unitId));
    }
  }, [dispatch, unitId]);

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const categories = [
    { id: 'greeting', label: 'Greeting', subtitle: 'Lời chào hỏi', icon: '👋' },
    { id: 'occupation', label: 'Occupation', subtitle: 'Nghề nghiệp', icon: '👔' },
    { id: 'family', label: 'Family', subtitle: 'Gia đình', icon: '👨‍👩‍👧‍👦' },
    { id: 'hobby', label: 'Hobby', subtitle: 'Sở thích', icon: '🎨' },
    { id: 'education', label: 'Education', subtitle: 'Giáo dục', icon: '📚' },
    { id: 'nationality', label: 'Nationality', subtitle: 'Quốc tịch', icon: '🌍' },
  ];

  return (
    <div className="unit-vocabulary">
      <div className="vocabulary-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Book List
        </button>
        <div className="header-info">
          <div className="breadcrumb">
            <span>UNIT 1 - VOCABULARY</span>
          </div>
          <h2>Introduction</h2>
          <span className="learn-count">6 words to learn</span>
        </div>
      </div>

      <div className="vocabulary-content">
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card" onClick={() => setSelectedCategory(category.id)}>
              <div className="category-icon">{category.icon}</div>
              <div className="category-info">
                <h4>{category.label}</h4>
                <p>{category.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="vocabulary-list">
          <h3><Translate contentKey="langleague.student.learning.vocabulary.title">Vocabulary Words</Translate></h3>
          {vocabularies.map(vocab => (
            <div key={vocab.id} className="vocabulary-card">
              <div className="vocab-header">
                <div className="vocab-word">
                  <h4>{vocab.word}</h4>
                  {vocab.phonetic && <span className="pronunciation">/{vocab.phonetic}/</span>}
                </div>
              </div>

              <div className="vocab-meaning">
                <strong><Translate contentKey="langleague.student.learning.vocabulary.meaning">Meaning:</Translate></strong> {vocab.meaning}
              </div>

              {vocab.example && (
                <div className="vocab-example">
                  <strong><Translate contentKey="langleague.student.learning.vocabulary.example">Example:</Translate></strong>
                  <p className="example-sentence">&quot;{vocab.example}&quot;</p>
                </div>
              )}

              {vocab.imageUrl && (
                <div className="vocab-image">
                  <img src={vocab.imageUrl} alt={vocab.word} />
                </div>
              )}
            </div>
          ))}
        </div>

        {vocabularies.length === 0 && (
          <div className="empty-state">
            <p>
              <Translate contentKey="langleague.student.learning.vocabulary.noVocabulary">
                No vocabulary words added yet for this unit.
              </Translate>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitVocabulary;
