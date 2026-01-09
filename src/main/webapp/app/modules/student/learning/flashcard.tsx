import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
import { IUnit } from 'app/shared/model/unit.model';
import './flashcard.scss';

export const Flashcard = () => {
  const [vocabularies, setVocabularies] = useState<IVocabulary[]>([]);
  const [unit, setUnit] = useState<IUnit | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (unitId) {
      loadVocabularies();
    }
  }, [unitId]);

  const loadVocabularies = async () => {
    try {
      setLoading(true);
      // Load unit data
      const unitResponse = await axios.get<IUnit>(`/api/units/${unitId}`);
      setUnit(unitResponse.data);

      // Load vocabularies
      const response = await axios.get<IVocabulary[]>(`/api/units/${unitId}/vocabularies`);
      setVocabularies(response.data);
    } catch (error) {
      console.error('Error loading vocabularies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % vocabularies.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + vocabularies.length) % vocabularies.length);
  };

  const handleShuffle = () => {
    const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
    setVocabularies(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className="flashcard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (!vocabularies.length) {
    return (
      <div className="flashcard-container">
        <div className="flashcard-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <i className="bi bi-arrow-left"></i> Back
          </button>
          <h2>{unit?.title || 'Flashcards'}</h2>
        </div>
        <div className="empty-state">
          <i className="bi bi-card-text"></i>
          <p>No flashcards available</p>
        </div>
      </div>
    );
  }

  const currentVocab = vocabularies[currentIndex];

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-btn">
            <i className="bi bi-arrow-left"></i>
          </button>
          <div className="breadcrumb">
            <span>Learning</span>
            <i className="bi bi-chevron-right"></i>
            <span>Flashcards</span>
            {unit && (
              <>
                <i className="bi bi-chevron-right"></i>
                <span className="current">{unit.title}</span>
              </>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button onClick={handleShuffle} className="shuffle-btn">
            <i className="bi bi-shuffle"></i> Shuffle
          </button>
          <button onClick={() => setIsStudyMode(!isStudyMode)} className={`mode-btn ${isStudyMode ? 'active' : ''}`}>
            <i className="bi bi-star"></i> Study Mode
          </button>
        </div>
      </div>

      <div className="flashcard-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / vocabularies.length) * 100}%` }} />
        </div>
        <span className="progress-text">
          Card {currentIndex + 1} of {vocabularies.length}
        </span>
      </div>

      <div className="flashcard-main">
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="card-label">DEFINITION</div>
              <div className="card-content">
                <h2 className="main-text">{currentVocab.meaning}</h2>
                {currentVocab.example && (
                  <p className="example-text">
                    <i className="bi bi-quote"></i>
                    {currentVocab.example}
                  </p>
                )}
              </div>
              <div className="flip-hint">
                <span>Click to Flip</span>
              </div>
            </div>

            <div className="flashcard-back">
              <div className="card-label">ANSWER</div>
              <div className="card-content">
                <h2 className="main-text">{currentVocab.word}</h2>
                {currentVocab.phonetic && <p className="pronunciation">/{currentVocab.phonetic}/</p>}
                {currentVocab.imageUrl && (
                  <div className="card-image">
                    <img src={currentVocab.imageUrl} alt={currentVocab.word} />
                  </div>
                )}
              </div>
              <div className="flip-hint">
                <span>Click to Flip</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flashcard-controls">
          <button onClick={handlePrevious} className="control-btn nav-btn" disabled={vocabularies.length <= 1}>
            <i className="bi bi-chevron-left"></i>
          </button>

          <button className="control-btn play-btn">
            <i className="bi bi-play-fill"></i>
          </button>

          <button onClick={handleNext} className="control-btn nav-btn" disabled={vocabularies.length <= 1}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Terminology Section */}
      <div className="terminology-section">
        <div className="terminology-header">
          <i className="bi bi-book"></i>
          <h3>Terminology in this section</h3>
        </div>
        <div className="terminology-list">
          {vocabularies.map((vocab, index) => (
            <div
              key={vocab.id}
              className={`terminology-item ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                setIsFlipped(false);
              }}
            >
              <div className="term-header">
                <span className="term-word">{vocab.word}</span>
              </div>
              <div className="term-meaning">{vocab.meaning}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
