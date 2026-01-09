import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById, updateUnit, createUnit } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId, bulkUpdateVocabularies } from 'app/shared/reducers/vocabulary.reducer';
import { fetchGrammarsByUnitId, bulkUpdateGrammars } from 'app/shared/reducers/grammar.reducer';
import { fetchExercisesWithOptions } from 'app/shared/reducers/exercise.reducer';
import { IUnit, defaultUnitValue as defaultUnit } from 'app/shared/model/unit.model';
import { IVocabulary, defaultVocabularyValue as defaultVocab } from 'app/shared/model/vocabulary.model';
import { IGrammar, defaultGrammarValue as defaultGrammar } from 'app/shared/model/grammar.model';
import { IExercise, defaultExerciseValue as defaultExercise } from 'app/shared/model/exercise.model';
import { IExerciseOption, defaultExerciseOptionValue as defaultOption } from 'app/shared/model/exercise-option.model';
import { ExerciseType } from 'app/shared/model/enumerations/enums.model';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import './unit-update-v2.scss';
import {Translate} from "react-jhipster";

export const UnitUpdateV2 = () => {
  const dispatch = useAppDispatch();
  const { selectedUnit, loading: unitLoading, errorMessage: unitError } = useAppSelector(state => state.unit);
  const { vocabularies: reduxVocabularies, loading: vocabLoading, errorMessage: vocabError } = useAppSelector(state => state.vocabulary);
  const { grammars: reduxGrammars, loading: grammarLoading, errorMessage: grammarError } = useAppSelector(state => state.grammar);
  const { exercises: reduxExercises, exerciseOptions: reduxExerciseOptions, loading: exerciseLoading, errorMessage: exerciseError } = useAppSelector(state => state.exercise);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IUnit>({
    defaultValues: defaultUnit,
    mode: 'onBlur', // Only validate on blur to prevent re-renders on every keystroke
  });

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
      dispatch(fetchUnitById(unitId));
      dispatch(fetchVocabulariesByUnitId(unitId));
      dispatch(fetchGrammarsByUnitId(unitId));
      dispatch(fetchExercisesWithOptions(unitId));
    }
  }, [dispatch, unitId]);

  useEffect(() => {
    if (selectedUnit && unitId) {
      // Populate form with existing unit data
      setValue('id', selectedUnit.id);
      setValue('title', selectedUnit.title);
      setValue('summary', selectedUnit.summary);
      setValue('orderIndex', selectedUnit.orderIndex);
      setValue('bookId', selectedUnit.bookId);
    }
  }, [selectedUnit, unitId, setValue]);

  useEffect(() => {
    setVocabularies(reduxVocabularies);
  }, [reduxVocabularies]);

  useEffect(() => {
    setGrammars(reduxGrammars);
  }, [reduxGrammars]);

  useEffect(() => {
    setExercises(reduxExercises);
    setExerciseOptions(reduxExerciseOptions);
  }, [reduxExercises, reduxExerciseOptions]);

  const onSubmit = useCallback(
    async (formData: IUnit) => {
      try {
        if (unitId) {
          await dispatch(updateUnit(formData));
          await dispatch(bulkUpdateVocabularies(vocabularies));
          await dispatch(bulkUpdateGrammars(grammars));
        } else {
          await dispatch(createUnit({ ...formData, bookId: Number(bookId) }));
        }
        navigate(`/teacher/books/${bookId}/edit`);
      } catch (error) {
        console.error('Error saving unit:', error);
      }
    },
    [dispatch, unitId, vocabularies, grammars, bookId, navigate]
  );

  // Vocabulary functions - optimized with useCallback
  const addVocabulary = useCallback(() => {
    setVocabularies(prev => [...prev, { ...defaultVocab }]);
  }, []);

  const updateVocabulary = useCallback(<K extends keyof IVocabulary>(index: number, field: K, value: IVocabulary[K]) => {
    setVocabularies(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const deleteVocabulary = useCallback((index: number) => {
    setVocabularies(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Vocabulary drag & drop handlers - optimized
  const handleVocabDragStart = useCallback((index: number) => {
    setDraggedVocabIndex(index);
  }, []);

  const handleVocabDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedVocabIndex === null || draggedVocabIndex === index) return;

      setVocabularies(prev => {
        const items = [...prev];
        const draggedItem = items[draggedVocabIndex];
        items.splice(draggedVocabIndex, 1);
        items.splice(index, 0, draggedItem);
        return items;
      });
      setDraggedVocabIndex(index);
    },
    [draggedVocabIndex]
  );

  const handleVocabDragEnd = useCallback(() => {
    setDraggedVocabIndex(null);
    // Update orderIndex for all vocabularies
    setVocabularies(prev =>
      prev.map((vocab, idx) => ({
        ...vocab,
        orderIndex: idx + 1,
      }))
    );
  }, []);

  const duplicateVocabulary = useCallback((index: number) => {
    setVocabularies(prev => {
      const vocab = { ...prev[index], id: undefined };
      const updated = [...prev];
      updated.splice(index + 1, 0, vocab);
      return updated;
    });
  }, []);

  // Grammar functions - optimized with useCallback
  const addGrammar = useCallback(() => {
    setGrammars(prev => [...prev, { ...defaultGrammar }]);
  }, []);

  const updateGrammar = useCallback(<K extends keyof IGrammar>(index: number, field: K, value: IGrammar[K]) => {
    setGrammars(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const deleteGrammar = useCallback((index: number) => {
    setGrammars(prev => prev.filter((_, i) => i !== index));
  }, []);

  const duplicateGrammar = useCallback((index: number) => {
    setGrammars(prev => {
      const grammar = { ...prev[index], id: undefined };
      const updated = [...prev];
      updated.splice(index + 1, 0, grammar);
      return updated;
    });
  }, []);

  const handleGrammarDragStart = useCallback((index: number) => {
    setDraggedGrammarIndex(index);
  }, []);

  const handleGrammarDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedGrammarIndex === null || draggedGrammarIndex === index) return;

      setGrammars(prev => {
        const items = [...prev];
        const draggedItem = items[draggedGrammarIndex];
        items.splice(draggedGrammarIndex, 1);
        items.splice(index, 0, draggedItem);
        return items;
      });
      setDraggedGrammarIndex(index);
    },
    [draggedGrammarIndex]
  );

  const handleGrammarDragEnd = useCallback(() => {
    setDraggedGrammarIndex(null);
  }, []);

  // Exercise functions - optimized with useCallback
  const addExercise = useCallback((type: ExerciseType = ExerciseType.SINGLE_CHOICE) => {
    const newExercise = { ...defaultExercise, exerciseType: type };
    setExercises(prev => [...prev, newExercise]);
  }, []);

  const updateExercise = useCallback(<K extends keyof IExercise>(index: number, field: K, value: IExercise[K]) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const deleteExercise = useCallback((index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  }, []);

  const duplicateExercise = useCallback((index: number) => {
    setExercises(prev => {
      const exercise = { ...prev[index], id: undefined };
      const updated = [...prev];
      updated.splice(index + 1, 0, exercise);
      return updated;
    });
  }, []);

  const handleExerciseDragStart = useCallback((index: number) => {
    setDraggedExerciseIndex(index);
  }, []);

  const handleExerciseDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedExerciseIndex === null || draggedExerciseIndex === index) return;

      setExercises(prev => {
        const items = [...prev];
        const draggedItem = items[draggedExerciseIndex];
        items.splice(draggedExerciseIndex, 1);
        items.splice(index, 0, draggedItem);
        return items;
      });
      setDraggedExerciseIndex(index);
    },
    [draggedExerciseIndex]
  );

  const handleExerciseDragEnd = useCallback(() => {
    setDraggedExerciseIndex(null);
  }, []);

  // Exercise options functions - optimized with useCallback
  const addOption = useCallback(
    (exerciseIndex: number) => {
      const exercise = exercises[exerciseIndex];
      if (!exercise.id) return;

      setExerciseOptions(prev => {
        const currentOptions = prev[exercise.id] || [];
        return {
          ...prev,
          [exercise.id]: [...currentOptions, { ...defaultOption, exerciseId: exercise.id }],
        };
      });
    },
    [exercises]
  );

  const updateOption = useCallback(<K extends keyof IExerciseOption>(
    exerciseId: number,
    optionIndex: number,
    field: K,
    value: IExerciseOption[K]
  ) => {
    setExerciseOptions(prev => {
      const options = [...(prev[exerciseId] || [])];
      options[optionIndex] = { ...options[optionIndex], [field]: value };
      return {
        ...prev,
        [exerciseId]: options,
      };
    });
  }, []);

  const deleteOption = useCallback((exerciseId: number, optionIndex: number) => {
    setExerciseOptions(prev => {
      const options = (prev[exerciseId] || []).filter((_, i) => i !== optionIndex);
      return {
        ...prev,
        [exerciseId]: options,
      };
    });
  }, []);

  // Check if any data is loading
  const isLoading = unitLoading || vocabLoading || grammarLoading || exerciseLoading;
  const hasError = unitError || vocabError || grammarError || exerciseError;

  // Show loading state while fetching data
  if (isLoading && unitId) {
    return (
      <LoadingSpinner
        message="Loading unit data..."
        fullScreen
      />
    );
  }

  // Show error state if any fetch failed
  if (hasError) {
    const errorMsg = unitError || vocabError || grammarError || exerciseError;
    return (
      <ErrorDisplay
        message={errorMsg || 'Failed to load unit data'}
        onRetry={() => {
          if (unitId) {
            dispatch(fetchUnitById(unitId));
            dispatch(fetchVocabulariesByUnitId(unitId));
            dispatch(fetchGrammarsByUnitId(unitId));
            dispatch(fetchExercisesWithOptions(unitId));
          }
        }}
        fullScreen
      />
    );
  }

  return (
    <div className="unit-update-v2">
      {/* Header */}
      <div className="form-header">
        <button onClick={() => navigate(`/teacher/books/${bookId}/edit`)} className="back-btn" type="button">
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="header-content">
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Unit title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  className={`chapter-title-input ${errors.title ? 'error' : ''}`}
                  placeholder="Unit Title"
                />
                {errors.title && <span className="error-message">{errors.title.message}</span>}
              </div>
            )}
          />
          <Controller
            name="summary"
            control={control}
            render={({ field }) => (
              <textarea {...field} className="chapter-description-input" placeholder="Unit Description" rows={2} />
            )}
          />
        </div>
        <button onClick={handleSubmit(onSubmit)} className="send-btn" type="button" disabled={isSubmitting}>
          <i className="bi bi-send"></i> {isSubmitting ? 'Saving...' : 'Submit'}
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
            <i className="bi bi-plus-circle"></i> <Translate contentKey="langleague.teacher.units.exercises.menu.addExercise">Add Exercise</Translate>
          </button>
          <div className="question-type-buttons">
            <button onClick={() => addExercise(ExerciseType.SINGLE_CHOICE)} className="type-btn">
              <i className="bi bi-record-circle"></i>{' '}
              <Translate contentKey="langleague.teacher.units.exercises.menu.singleChoice">Single Choice</Translate>
            </button>
            <button onClick={() => addExercise(ExerciseType.MULTI_CHOICE)} className="type-btn">
              <i className="bi bi-check-square"></i>{' '}
              <Translate contentKey="langleague.teacher.units.exercises.menu.multiChoice">Multi Choice</Translate>
            </button>
            <button onClick={() => addExercise(ExerciseType.FILL_IN_BLANK)} className="type-btn">
              <i className="bi bi-dash-square"></i>{' '}
              <Translate contentKey="langleague.teacher.units.exercises.menu.fillInBlank">Fill in Blank</Translate>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitUpdateV2;
