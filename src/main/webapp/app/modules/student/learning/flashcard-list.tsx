import React, { useState } from 'react';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
import './flashcard-list.scss';
import { Translate } from 'react-jhipster';

interface FlashcardListProps {
  vocabularies?: IVocabulary[];
}

export const FlashcardList: React.FC<FlashcardListProps> = ({ vocabularies = [] }) => {
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});

  const handleFlip = (id: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAudioClick = (e: React.MouseEvent, word: string) => {
    e.stopPropagation(); // Prevent card flip
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="empty-state">
        <Translate contentKey="langleague.student.learning.flashcard.noVocabulary">
          No vocabulary available. Please select a unit.
        </Translate>
      </div>
    );
  }

  return (
    <div className="flashcard-grid">
      {vocabularies.map(vocab => (
        <div key={vocab.id} className={`flashcard-item ${flippedCards[vocab.id] ? 'flipped' : ''}`} onClick={() => handleFlip(vocab.id)}>
          <div className="flashcard-inner">
            {/* Front Side */}
            <div className="flashcard-front">
              <div className="card-content">
                <h3 className="word">{vocab.word}</h3>
                {vocab.phonetic && <span className="phonetic">/{vocab.phonetic}/</span>}
              </div>
              <button className="audio-btn" onClick={e => handleAudioClick(e, vocab.word)} title="Listen">
                <i className="bi bi-volume-up-fill"></i>
              </button>
              <div className="flip-hint">Click to flip</div>
            </div>

            {/* Back Side */}
            <div className="flashcard-back">
              <div className="card-content">
                <h4 className="meaning">{vocab.meaning}</h4>
                {vocab.example && (
                  <p className="example">
                    <i className="bi bi-quote"></i> {vocab.example}
                  </p>
                )}
                {vocab.imageUrl && (
                  <div className="image-container">
                    <img src={vocab.imageUrl} alt={vocab.word} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashcardList;
