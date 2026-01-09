import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IUnit, defaultUnitValue as defaultUnit } from 'app/shared/model/unit.model';
import { IVocabulary, defaultVocabularyValue as defaultVocab } from 'app/shared/model/vocabulary.model';
import { IGrammar, defaultGrammarValue as defaultGrammar } from 'app/shared/model/grammar.model';
import { IExercise, defaultExerciseValue as defaultExercise } from 'app/shared/model/exercise.model';
import { ExerciseType } from 'app/shared/model/enumerations/enums.model';

export const UnitUpdate = () => {
  const [unit, setUnit] = useState<IUnit>(defaultUnit);
  const [vocabularies, setVocabularies] = useState<IVocabulary[]>([]);
  const [grammars, setGrammars] = useState<IGrammar[]>([]);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar' | 'exercise'>('vocabulary');

  const { bookId, unitId } = useParams<{ bookId: string; unitId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (unitId) {
      loadUnit();
      loadVocabularies();
      loadGrammars();
      loadExercises();
    }
  }, [unitId]);

  const loadUnit = async () => {
    try {
      const response = await axios.get(`/api/units/${unitId}`);
      setUnit(response.data);
    } catch (error) {
      console.error('Error loading unit:', error);
    }
  };

  const loadVocabularies = async () => {
    try {
      const response = await axios.get(`/api/units/${unitId}/vocabularies`);
      setVocabularies(response.data);
    } catch (error) {
      console.error('Error loading vocabularies:', error);
    }
  };

  const loadGrammars = async () => {
    try {
      const response = await axios.get(`/api/units/${unitId}/grammars`);
      setGrammars(response.data);
    } catch (error) {
      console.error('Error loading grammars:', error);
    }
  };

  const loadExercises = async () => {
    try {
      const response = await axios.get(`/api/units/${unitId}/exercises`);
      setExercises(response.data);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const handleSaveUnit = async () => {
    try {
      if (unitId) {
        await axios.put(`/api/units/${unitId}`, unit);
      } else {
        await axios.post('/api/units', { ...unit, bookId });
      }
      navigate(`/books/${bookId}/edit`);
    } catch (error) {
      console.error('Error saving unit:', error);
    }
  };

  const addVocabulary = () => {
    setVocabularies([...vocabularies, { ...defaultVocab, unitId: Number(unitId) }]);
  };

  const updateVocabulary = <K extends keyof IVocabulary>(index: number, field: K, value: IVocabulary[K]) => {
    const updated = [...vocabularies];
    updated[index] = { ...updated[index], [field]: value };
    setVocabularies(updated);
  };

  const deleteVocabulary = (index: number) => {
    const updated = vocabularies.filter((_, i) => i !== index);
    setVocabularies(updated);
  };

  const saveVocabulary = async (vocab: IVocabulary, index: number) => {
    try {
      if (vocab.id) {
        await axios.put(`/api/vocabularies/${vocab.id}`, vocab);
      } else {
        const response = await axios.post('/api/vocabularies', { ...vocab, unitId });
        const updated = [...vocabularies];
        updated[index] = response.data;
        setVocabularies(updated);
      }
    } catch (error) {
      console.error('Error saving vocabulary:', error);
    }
  };

  const addGrammar = () => {
    setGrammars([...grammars, { ...defaultGrammar, unitId: Number(unitId) }]);
  };

  const updateGrammar = <K extends keyof IGrammar>(index: number, field: K, value: IGrammar[K]) => {
    const updated = [...grammars];
    updated[index] = { ...updated[index], [field]: value };
    setGrammars(updated);
  };

  const deleteGrammar = (index: number) => {
    const updated = grammars.filter((_, i) => i !== index);
    setGrammars(updated);
  };

  const saveGrammar = async (grammar: IGrammar, index: number) => {
    try {
      if (grammar.id) {
        await axios.put(`/api/grammars/${grammar.id}`, grammar);
      } else {
        const response = await axios.post('/api/grammars', { ...grammar, unitId });
        const updated = [...grammars];
        updated[index] = response.data;
        setGrammars(updated);
      }
    } catch (error) {
      console.error('Error saving grammar:', error);
    }
  };

  const addExercise = () => {
    setExercises([...exercises, { ...defaultExercise, unitId: Number(unitId) }]);
  };

  const updateExercise = <K extends keyof IExercise>(index: number, field: K, value: IExercise[K]) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const deleteExercise = (index: number) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  const saveExercise = async (exercise: IExercise, index: number) => {
    try {
      if (exercise.id) {
        await axios.put(`/api/exercises/${exercise.id}`, exercise);
      } else {
        const response = await axios.post('/api/exercises', { ...exercise, unitId });
        const updated = [...exercises];
        updated[index] = response.data;
        setExercises(updated);
      }
    } catch (error) {
      console.error('Error saving exercise:', error);
    }
  };

  return (
    <div className="unit-update">
      <div className="unit-header">
        <button onClick={() => navigate(`/books/${bookId}/edit`)} className="back-btn">
          ← Back
        </button>
        <div className="unit-title">
          <h2>{unit.title || 'Sách Tiếng Hàn Cơ Bản'}</h2>
          <button className="btn-edit">✏️ Edit</button>
        </div>
      </div>

      <div className="unit-content">
        <div className="unit-lessons">
          <div className="lesson-item">
            <span className="lesson-icon">📚</span>
            <span>Bài học 1: Lời Chào & Giới Thiệu</span>
          </div>
          <div className="lesson-item active">
            <span className="lesson-icon">📚</span>
            <span>Bài học 2: Gia Đình Của Tôi</span>
          </div>
          <div className="lesson-item">
            <span className="lesson-icon">📝</span>
            <span>Gia đình của tôi</span>
            <span className="lesson-subtitle">Hãy học cách nói về gia đình bạn trong ngôn ngữ mới và giới thiệu...</span>
          </div>
        </div>

        <div className="unit-main">
          <div className="tabs">
            <button className={activeTab === 'vocabulary' ? 'active' : ''} onClick={() => setActiveTab('vocabulary')}>
              Vocabulary
            </button>
            <button className={activeTab === 'grammar' ? 'active' : ''} onClick={() => setActiveTab('grammar')}>
              Grammar
            </button>
            <button className={activeTab === 'exercise' ? 'active' : ''} onClick={() => setActiveTab('exercise')}>
              Exercise
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'vocabulary' && (
              <div className="vocabulary-section">
                <div className="section-header">
                  <h3>Vocabulary List</h3>
                  <button className="btn-add" onClick={addVocabulary}>
                    + Add Vocabulary
                  </button>
                </div>

                {vocabularies.map((vocab, index) => (
                  <div key={index} className="vocabulary-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Word</label>
                        <input
                          type="text"
                          value={vocab.word}
                          onChange={e => updateVocabulary(index, 'word', e.target.value)}
                          placeholder="Enter word"
                        />
                      </div>
                      <div className="form-group">
                        <label>Phonetic (Phiên âm)</label>
                        <input
                          type="text"
                          value={vocab.phonetic || ''}
                          onChange={e => updateVocabulary(index, 'phonetic', e.target.value)}
                          placeholder="e.g., /həˈloʊ/"
                        />
                      </div>
                      <div className="form-group">
                        <label>Order Index</label>
                        <input
                          type="number"
                          value={vocab.orderIndex || 0}
                          onChange={e => updateVocabulary(index, 'orderIndex', parseInt(e.target.value, 10))}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Meaning</label>
                        <input
                          type="text"
                          value={vocab.meaning}
                          onChange={e => updateVocabulary(index, 'meaning', e.target.value)}
                          placeholder="Enter meaning"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Example (Câu ví dụ)</label>
                        <textarea
                          value={vocab.example || ''}
                          onChange={e => updateVocabulary(index, 'example', e.target.value)}
                          placeholder="Enter example sentence"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Image URL</label>
                        <input
                          type="text"
                          value={vocab.imageUrl || ''}
                          onChange={e => updateVocabulary(index, 'imageUrl', e.target.value)}
                          placeholder="Enter image URL"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button className="btn-save" onClick={() => saveVocabulary(vocab, index)}>
                        Save
                      </button>
                      <button className="btn-delete" onClick={() => deleteVocabulary(index)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'grammar' && (
              <div className="grammar-section">
                <div className="section-header">
                  <h3>Grammar List</h3>
                  <button className="btn-add" onClick={addGrammar}>
                    + Add Grammar
                  </button>
                </div>

                {grammars.map((grammar, index) => (
                  <div key={index} className="grammar-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={grammar.title || ''}
                          onChange={e => updateGrammar(index, 'title', e.target.value)}
                          placeholder="Enter grammar title"
                        />
                      </div>
                      <div className="form-group">
                        <label>Order Index</label>
                        <input
                          type="number"
                          value={grammar.orderIndex || 0}
                          onChange={e => updateGrammar(index, 'orderIndex', parseInt(e.target.value, 10))}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Content (Markdown supported)</label>
                        <textarea
                          value={grammar.contentMarkdown || ''}
                          onChange={e => updateGrammar(index, 'contentMarkdown', e.target.value)}
                          placeholder="Enter content with Markdown formatting..."
                          rows={8}
                        />
                        <small className="form-hint">Hỗ trợ Markdown: **bold**, *italic*, # heading, etc.</small>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Example Usage (JSON format)</label>
                        <textarea
                          value={grammar.exampleUsage || ''}
                          onChange={e => updateGrammar(index, 'exampleUsage', e.target.value)}
                          placeholder='[{"en": "I have finished my homework.", "ko": "저는 숙제를 끝냈습니다."}]'
                          rows={4}
                        />
                        <small className="form-hint">Enter as JSON array with &quot;en&quot; and &quot;ko&quot; fields</small>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button className="btn-save" onClick={() => saveGrammar(grammar, index)}>
                        Save
                      </button>
                      <button className="btn-delete" onClick={() => deleteGrammar(index)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'exercise' && (
              <div className="exercise-section">
                <div className="section-header">
                  <h3>Exercise List</h3>
                  <button className="btn-add" onClick={addExercise}>
                    + Add Exercise
                  </button>
                </div>

                {exercises.map((exercise, index) => (
                  <div key={index} className="exercise-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Question Text</label>
                        <textarea
                          value={exercise.exerciseText}
                          onChange={e => updateExercise(index, 'exerciseText', e.target.value)}
                          placeholder="Enter exercise question"
                          rows={2}
                        />
                      </div>
                      <div className="form-group">
                        <label>Type</label>
                        <select
                          value={exercise.exerciseType}
                          onChange={e => updateExercise(index, 'exerciseType', e.target.value as ExerciseType)}
                        >
                          <option value={ExerciseType.SINGLE_CHOICE}>Single Choice</option>
                          <option value={ExerciseType.MULTI_CHOICE}>Multi Choice</option>
                          <option value={ExerciseType.FILL_IN_BLANK}>Fill in Blank</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Audio URL (optional)</label>
                        <input
                          type="text"
                          value={exercise.audioUrl}
                          onChange={e => updateExercise(index, 'audioUrl', e.target.value)}
                          placeholder="Enter audio URL"
                        />
                      </div>
                      <div className="form-group">
                        <label>Image URL (optional)</label>
                        <input
                          type="text"
                          value={exercise.imageUrl}
                          onChange={e => updateExercise(index, 'imageUrl', e.target.value)}
                          placeholder="Enter image URL"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Correct Answer</label>
                        <input
                          type="text"
                          value={exercise.correctAnswerRaw}
                          onChange={e => updateExercise(index, 'correctAnswerRaw', e.target.value)}
                          placeholder="Enter correct answer"
                        />
                      </div>
                      <div className="form-group">
                        <label>Order</label>
                        <input
                          type="number"
                          value={exercise.orderIndex}
                          onChange={e => updateExercise(index, 'orderIndex', parseInt(e.target.value, 10))}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button className="btn-save" onClick={() => saveExercise(exercise, index)}>
                        Save
                      </button>
                      <button className="btn-delete" onClick={() => deleteExercise(index)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitUpdate;
