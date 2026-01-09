import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IUnit, defaultUnitValue as defaultUnit } from 'app/shared/model/unit.model';
import { IVocabulary, defaultVocabularyValue as defaultVocab } from 'app/shared/model/vocabulary.model';
import { IGrammar, defaultGrammarValue as defaultGrammar } from 'app/shared/model/grammar.model';
import { IExercise, defaultExerciseValue as defaultExercise } from 'app/shared/model/exercise.model';
import { IExerciseOption, defaultExerciseOptionValue as defaultOption } from 'app/shared/model/exercise-option.model';
import { ExerciseType } from 'app/shared/model/enumerations/enums.model';
import './unit-update-v2.scss';

export const UnitUpdateV2 = () => {
  const [unit, setUnit] = useState<IUnit>(defaultUnit);
  const [vocabularies, setVocabularies] = useState<IVocabulary[]>([]);
  const [grammars, setGrammars] = useState<IGrammar[]>([]);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<{ [exerciseId: number]: IExerciseOption[] }>({});
  const [focusedSection, setFocusedSection] = useState<number | string | null>(null);
  const [draggedVocabIndex, setDraggedVocabIndex] = useState<number | null>(null);
  const [draggedGrammarIndex, setDraggedGrammarIndex] = useState<number | null>(null);
  const [draggedExerciseIndex, setDraggedExerciseIndex] = useState<number | null>(null);

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
      const response = await axios.get<IUnit>(`/api/units/${unitId}`);
      setUnit(response.data);
    } catch (error) {
      console.error('Error loading unit:', error);
    }
  };

  const loadVocabularies = async () => {
    try {
      const response = await axios.get<IVocabulary[]>(`/api/units/${unitId}/vocabularies`);
      setVocabularies(response.data);
    } catch (error) {
      console.error('Error loading vocabularies:', error);
    }
  };

  const loadGrammars = async () => {
    try {
      const response = await axios.get<IGrammar[]>(`/api/units/${unitId}/grammars`);
      setGrammars(response.data);
    } catch (error) {
      console.error('Error loading grammars:', error);
    }
  };

  const loadExercises = async () => {
    try {
      const response = await axios.get<IExercise[]>(`/api/units/${unitId}/exercises`);
      const exercisesData = response.data;
      setExercises(exercisesData);

      // Load options for each exercise
      const optionsMap: { [exerciseId: number]: IExerciseOption[] } = {};
      for (const exercise of exercisesData) {
        if (exercise.id) {
          const optionsResponse = await axios.get<IExerciseOption[]>(`/api/exercises/${exercise.id}/options`);
          optionsMap[exercise.id] = optionsResponse.data;
        }
      }
      setExerciseOptions(optionsMap);
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
      navigate(`/teacher/books/${bookId}/edit`);
    } catch (error) {
      console.error('Error saving unit:', error);
    }
  };

  // Vocabulary functions
  const addVocabulary = () => {
    setVocabularies([...vocabularies, { ...defaultVocab }]);
  };

  const updateVocabulary = (index: number, field: keyof IVocabulary, value: any) => {
    const updated = [...vocabularies];
    updated[index] = { ...updated[index], [field]: value };
    setVocabularies(updated);
  };

  const deleteVocabulary = (index: number) => {
    setVocabularies(vocabularies.filter((_, i) => i !== index));
  };

  // Vocabulary drag & drop handlers
  const handleVocabDragStart = (index: number) => {
    setDraggedVocabIndex(index);
  };

  const handleVocabDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedVocabIndex === null || draggedVocabIndex === index) return;

    const items = [...vocabularies];
    const draggedItem = items[draggedVocabIndex];
    items.splice(draggedVocabIndex, 1);
    items.splice(index, 0, draggedItem);

    setVocabularies(items);
    setDraggedVocabIndex(index);
  };

  const handleVocabDragEnd = () => {
    setDraggedVocabIndex(null);
    // Update orderIndex for all vocabularies
    const updated = vocabularies.map((vocab, idx) => ({
      ...vocab,
      orderIndex: idx + 1,
    }));
    setVocabularies(updated);
  };

  const duplicateVocabulary = (index: number) => {
    const vocab = { ...vocabularies[index], id: undefined };
    const updated = [...vocabularies];
    updated.splice(index + 1, 0, vocab);
    setVocabularies(updated);
  };

  // Grammar functions
  const addGrammar = () => {
    setGrammars([...grammars, { ...defaultGrammar }]);
  };

  const updateGrammar = (index: number, field: keyof IGrammar, value: any) => {
    const updated = [...grammars];
    updated[index] = { ...updated[index], [field]: value };
    setGrammars(updated);
  };

  const deleteGrammar = (index: number) => {
    setGrammars(grammars.filter((_, i) => i !== index));
  };

  const duplicateGrammar = (index: number) => {
    const grammar = { ...grammars[index], id: undefined };
    const updated = [...grammars];
    updated.splice(index + 1, 0, grammar);
    setGrammars(updated);
  };

  const handleGrammarDragStart = (index: number) => {
    setDraggedGrammarIndex(index);
  };

  const handleGrammarDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedGrammarIndex === null || draggedGrammarIndex === index) return;

    const items = [...grammars];
    const draggedItem = items[draggedGrammarIndex];
    items.splice(draggedGrammarIndex, 1);
    items.splice(index, 0, draggedItem);

    setGrammars(items);
    setDraggedGrammarIndex(index);
  };

  const handleGrammarDragEnd = () => {
    setDraggedGrammarIndex(null);
  };

  // Exercise functions
  const addExercise = (type: ExerciseType = ExerciseType.SINGLE_CHOICE) => {
    const newExercise = { ...defaultExercise, exerciseType: type };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (index: number, field: keyof IExercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const deleteExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const duplicateExercise = (index: number) => {
    const exercise = { ...exercises[index], id: undefined };
    const updated = [...exercises];
    updated.splice(index + 1, 0, exercise);
    setExercises(updated);
  };

  const handleExerciseDragStart = (index: number) => {
    setDraggedExerciseIndex(index);
  };

  const handleExerciseDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedExerciseIndex === null || draggedExerciseIndex === index) return;

    const items = [...exercises];
    const draggedItem = items[draggedExerciseIndex];
    items.splice(draggedExerciseIndex, 1);
    items.splice(index, 0, draggedItem);

    setExercises(items);
    setDraggedExerciseIndex(index);
  };

  const handleExerciseDragEnd = () => {
    setDraggedExerciseIndex(null);
  };

  // Exercise options functions
  const addOption = (exerciseIndex: number) => {
    const exercise = exercises[exerciseIndex];
    if (!exercise.id) return;

    const currentOptions = exerciseOptions[exercise.id] || [];
    setExerciseOptions({
      ...exerciseOptions,
      [exercise.id]: [...currentOptions, { ...defaultOption, exerciseId: exercise.id }],
    });
  };

  const updateOption = (exerciseId: number, optionIndex: number, field: keyof IExerciseOption, value: any) => {
    const options = [...(exerciseOptions[exerciseId] || [])];
    options[optionIndex] = { ...options[optionIndex], [field]: value };
    setExerciseOptions({
      ...exerciseOptions,
      [exerciseId]: options,
    });
  };

  const deleteOption = (exerciseId: number, optionIndex: number) => {
    const options = (exerciseOptions[exerciseId] || []).filter((_, i) => i !== optionIndex);
    setExerciseOptions({
      ...exerciseOptions,
      [exerciseId]: options,
    });
  };

  return (
    <div className="unit-update-v2">
      {/* Header */}
      <div className="form-header">
        <button onClick={() => navigate(`/teacher/books/${bookId}/edit`)} className="back-btn">
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="header-content">
          <input
            type="text"
            className="chapter-title-input"
            value={unit.title}
            onChange={e => setUnit({ ...unit, title: e.target.value })}
            placeholder="Unit Title"
          />
          <textarea
            className="chapter-description-input"
            value={unit.summary}
            onChange={e => setUnit({ ...unit, summary: e.target.value })}
            placeholder="Unit Description"
            rows={2}
          />
        </div>
        <button onClick={handleSaveUnit} className="send-btn">
          <i className="bi bi-send"></i> Submit
        </button>
      </div>

      {/* Main Content */}
      <div className="form-content">
        {/* Vocabulary Section */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <h3 className="section-title">
            <i className="bi bi-chat-square-text"></i> Vocabulary
          </h3>
          <div className="divider-line"></div>
        </div>

        {vocabularies.map((vocab, index) => (
          <div
            key={index}
            className={`form-card ${focusedSection === index ? 'focused' : ''} ${draggedVocabIndex === index ? 'dragging' : ''}`}
            onClick={() => setFocusedSection(index)}
            draggable
            onDragStart={() => handleVocabDragStart(index)}
            onDragOver={e => handleVocabDragOver(e, index)}
            onDragEnd={handleVocabDragEnd}
          >
            <div className="card-header">
              <i className="bi bi-grip-vertical drag-handle"></i>
              <span className="card-number">{index + 1}</span>
              <i className="bi bi-chat-square-text card-icon"></i>
            </div>

            <div className="card-body">
              <div className="form-field">
                <input
                  type="text"
                  value={vocab.word}
                  onChange={e => updateVocabulary(index, 'word', e.target.value)}
                  placeholder="Word (e.g., Hello)"
                  className="field-input"
                />
                <div className="field-underline"></div>
              </div>

              <div className="form-field">
                <input
                  type="text"
                  value={vocab.phonetic}
                  onChange={e => updateVocabulary(index, 'phonetic', e.target.value)}
                  placeholder="Phonetic (e.g., /həˈloʊ/)"
                  className="field-input"
                />
                <div className="field-underline"></div>
              </div>

              <div className="form-field">
                <input
                  type="text"
                  value={vocab.meaning}
                  onChange={e => updateVocabulary(index, 'meaning', e.target.value)}
                  placeholder="Meaning"
                  className="field-input"
                />
                <div className="field-underline"></div>
              </div>

              <div className="form-field">
                <textarea
                  value={vocab.example}
                  onChange={e => updateVocabulary(index, 'example', e.target.value)}
                  placeholder="Example sentence"
                  className="field-textarea"
                  rows={2}
                />
                <div className="field-underline"></div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <input
                    type="text"
                    value={vocab.imageUrl}
                    onChange={e => updateVocabulary(index, 'imageUrl', e.target.value)}
                    placeholder="Image URL"
                    className="field-input small"
                  />
                  <div className="field-underline"></div>
                </div>
                <div className="form-field">
                  <input
                    type="number"
                    value={vocab.orderIndex}
                    onChange={e => updateVocabulary(index, 'orderIndex', parseInt(e.target.value, 10))}
                    placeholder="Order"
                    className="field-input small"
                  />
                  <div className="field-underline"></div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button className="action-btn" onClick={() => duplicateVocabulary(index)}>
                <i className="bi bi-files"></i>
              </button>
              <button className="action-btn delete" onClick={() => deleteVocabulary(index)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}

        <button className="add-section-btn" onClick={addVocabulary}>
          <i className="bi bi-plus-circle"></i> Add Vocabulary
        </button>

        {/* Grammar Section */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <h3 className="section-title">
            <i className="bi bi-book"></i> Grammar
          </h3>
          <div className="divider-line"></div>
        </div>

        {grammars.map((grammar, index) => (
          <div
            key={index}
            className={`form-card ${focusedSection === `grammar-${index}` ? 'focused' : ''} ${draggedGrammarIndex === index ? 'dragging' : ''}`}
            onClick={() => setFocusedSection(`grammar-${index}`)}
            draggable
            onDragStart={() => handleGrammarDragStart(index)}
            onDragOver={e => handleGrammarDragOver(e, index)}
            onDragEnd={handleGrammarDragEnd}
          >
            <div className="card-header">
              <i className="bi bi-grip-vertical drag-handle"></i>
              <span className="card-number">{index + 1}</span>
              <i className="bi bi-book card-icon"></i>
            </div>

            <div className="card-body">
              <div className="form-field">
                <input
                  type="text"
                  value={grammar.title}
                  onChange={e => updateGrammar(index, 'title', e.target.value)}
                  placeholder="Grammar title"
                  className="field-input"
                />
                <div className="field-underline"></div>
              </div>

              <div className="form-field">
                <textarea
                  value={grammar.contentMarkdown}
                  onChange={e => updateGrammar(index, 'contentMarkdown', e.target.value)}
                  placeholder="Content (Markdown supported)"
                  className="field-textarea"
                  rows={6}
                />
                <div className="field-underline"></div>
                <span className="field-hint">Hỗ trợ Markdown: **bold**, *italic*, # heading</span>
              </div>

              <div className="form-field">
                <textarea
                  value={grammar.exampleUsage}
                  onChange={e => updateGrammar(index, 'exampleUsage', e.target.value)}
                  placeholder="Example usage"
                  className="field-textarea"
                  rows={4}
                />
                <div className="field-underline"></div>
                <span className="field-hint">Các ví dụ sử dụng</span>
              </div>

              <div className="form-field">
                <input
                  type="number"
                  value={grammar.orderIndex}
                  onChange={e => updateGrammar(index, 'orderIndex', parseInt(e.target.value, 10))}
                  placeholder="Order"
                  className="field-input"
                />
                <div className="field-underline"></div>
              </div>
            </div>

            <div className="card-footer">
              <button className="action-btn" onClick={() => duplicateGrammar(index)}>
                <i className="bi bi-files"></i>
              </button>
              <button className="action-btn delete" onClick={() => deleteGrammar(index)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}

        <button className="add-section-btn" onClick={addGrammar}>
          <i className="bi bi-plus-circle"></i> Add Grammar
        </button>

        {/* Exercise Section */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <h3 className="section-title">
            <i className="bi bi-question-circle"></i> Exercises
          </h3>
          <div className="divider-line"></div>
        </div>

        {exercises.map((exercise, index) => (
          <div
            key={index}
            className={`form-card ${focusedSection === `exercise-${index}` ? 'focused' : ''} ${draggedExerciseIndex === index ? 'dragging' : ''}`}
            onClick={() => setFocusedSection(`exercise-${index}` as any)}
            draggable
            onDragStart={() => handleExerciseDragStart(index)}
            onDragOver={e => handleExerciseDragOver(e, index)}
            onDragEnd={handleExerciseDragEnd}
          >
            <div className="card-header">
              <span className="card-number">{index + 1}</span>
              <i className="bi bi-question-circle card-icon"></i>
              <i className="bi bi-grip-vertical drag-handle"></i>
              <select
                value={exercise.exerciseType}
                onChange={e => updateExercise(index, 'exerciseType', e.target.value as ExerciseType)}
                className="question-type-select"
              >
                <option value={ExerciseType.SINGLE_CHOICE}>Single Choice</option>
                <option value={ExerciseType.MULTI_CHOICE}>Multiple Choice</option>
                <option value={ExerciseType.FILL_IN_BLANK}>Fill in Blank</option>
              </select>
            </div>

            <div className="card-body">
              <div className="form-field">
                <textarea
                  value={exercise.exerciseText}
                  onChange={e => updateExercise(index, 'exerciseText', e.target.value)}
                  placeholder="Exercise text"
                  className="field-textarea"
                  rows={3}
                />
                <div className="field-underline"></div>
              </div>

              {exercise.exerciseType !== ExerciseType.FILL_IN_BLANK && exercise.id && (
                <div className="options-section">
                  {(exerciseOptions[exercise.id] || []).map((option, optIndex) => (
                    <div key={optIndex} className="option-item">
                      <input
                        type={exercise.exerciseType === ExerciseType.SINGLE_CHOICE ? 'radio' : 'checkbox'}
                        checked={option.isCorrect}
                        onChange={e => updateOption(exercise.id, optIndex, 'isCorrect', e.target.checked)}
                        className="option-radio"
                      />
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={e => updateOption(exercise.id, optIndex, 'optionText', e.target.value)}
                        placeholder={`Option ${optIndex + 1}`}
                        className="option-input"
                      />
                      <button className="option-delete" onClick={() => deleteOption(exercise.id, optIndex)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                  <button className="add-option-btn" onClick={() => addOption(index)}>
                    <i className="bi bi-plus"></i> Add option
                  </button>
                </div>
              )}

              {exercise.exerciseType === ExerciseType.FILL_IN_BLANK && (
                <div className="form-field">
                  <input
                    placeholder="Enter correct answer..."
                    value={exercise.correctAnswerRaw}
                    onChange={e => updateExercise(index, 'correctAnswerRaw', e.target.value)}
                    className="field-input"
                  />
                  <div className="field-underline"></div>
                </div>
              )}

              <div className="form-row-2">
                <div className="form-field">
                  <input
                    type="text"
                    value={exercise.imageUrl}
                    onChange={e => updateExercise(index, 'imageUrl', e.target.value)}
                    placeholder="Image URL (optional)"
                    className="field-input small"
                  />
                  <div className="field-underline"></div>
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    value={exercise.audioUrl}
                    onChange={e => updateExercise(index, 'audioUrl', e.target.value)}
                    placeholder="Audio URL (optional)"
                    className="field-input small"
                  />
                  <div className="field-underline"></div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button className="action-btn" onClick={() => duplicateExercise(index)}>
                <i className="bi bi-files"></i>
              </button>
              <button className="action-btn delete" onClick={() => deleteExercise(index)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}

        <div className="add-question-menu">
          <button className="add-section-btn" onClick={() => addExercise(ExerciseType.SINGLE_CHOICE)}>
            <i className="bi bi-plus-circle"></i> Add Exercise
          </button>
          <div className="question-type-buttons">
            <button onClick={() => addExercise(ExerciseType.SINGLE_CHOICE)} className="type-btn">
              <i className="bi bi-record-circle"></i> Single Choice
            </button>
            <button onClick={() => addExercise(ExerciseType.MULTI_CHOICE)} className="type-btn">
              <i className="bi bi-check-square"></i> Multi Choice
            </button>
            <button onClick={() => addExercise(ExerciseType.FILL_IN_BLANK)} className="type-btn">
              <i className="bi bi-dash-square"></i> Fill in Blank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitUpdateV2;
