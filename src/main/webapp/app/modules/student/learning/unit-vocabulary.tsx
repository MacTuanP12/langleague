import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/unit/unit.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
import { LoadingSpinner } from 'app/shared/components';
import './unit-vocabulary.scss'; // Pure widget styling

interface UnitVocabularyProps {
  data?: IVocabulary[];
}

export const UnitVocabulary: React.FC<UnitVocabularyProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const { unitId } = useParams<'unitId'>();
  const unit = useAppSelector(state => state.unit.entity);
  const loading = useAppSelector(state => state.unit.loading);

  useEffect(() => {
    if (!data && unitId) {
      dispatch(getEntity(unitId));
    }
  }, [unitId, data, dispatch]);

  const vocabList = useMemo(() => data || unit?.vocabularies || [], [data, unit]);
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  // Detect language from text
  const detectLanguage = (text: string): string => {
    if (!text) return 'en-US';
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh-CN';
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja-JP';
    if (/[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text)) return 'ko-KR';
    if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)) return 'vi-VN';
    if (/[àâæçéèêëïîôùûüÿœ]/i.test(text)) return 'fr-FR';
    if (/[áéíñóúü¿¡]/i.test(text)) return 'es-ES';
    if (/[äöüß]/i.test(text)) return 'de-DE';
    return 'en-US';
  };

  // Text-to-Speech function with language detection
  const speakWord = (word: string, vocabId: number, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    window.speechSynthesis.cancel();

    if ('speechSynthesis' in window) {
      const detectedLang = detectLanguage(word);
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = detectedLang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      setSpeakingId(vocabId);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner message="langleague.student.learning.vocabulary.loading" isI18nKey />
      </div>
    );
  }

  return (
    <div className="vocabulary-grid">
      {vocabList.map(vocab => (
        <div key={vocab.id} className="vocabulary-card">
          {/* Vocab Header */}
          <div className="vocab-header">
            <h5 className="vocab-word clickable" onClick={e => speakWord(vocab.word, vocab.id, e)} title="Click to pronounce">
              {vocab.word}
            </h5>
            <button
              className={`speak-btn ${speakingId === vocab.id ? 'speaking' : ''}`}
              onClick={e => speakWord(vocab.word, vocab.id, e)}
              title="Pronounce"
            >
              <FontAwesomeIcon icon={speakingId === vocab.id ? 'volume-high' : 'volume-up'} />
            </button>
          </div>

          {/* Pronunciation */}
          {vocab.phonetic && <p className="vocab-pronunciation">/{vocab.phonetic}/</p>}

          {/* Meaning */}
          <p className="vocab-meaning">{vocab.meaning}</p>

          {/* Example */}
          {vocab.example && (
            <div className="vocab-example">
              <em>&quot;{vocab.example}&quot;</em>
            </div>
          )}

          {/* Image */}
          {vocab.imageUrl && (
            <div className="vocab-image">
              <img src={vocab.imageUrl} alt={vocab.word} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UnitVocabulary;
