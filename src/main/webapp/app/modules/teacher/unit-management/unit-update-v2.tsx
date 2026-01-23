import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById, updateUnit, createUnit, clearSelectedUnit } from 'app/shared/reducers/unit.reducer';
import {
  fetchVocabulariesByUnitId,
  updateVocabulary as updateVocabAction,
  deleteVocabulary as deleteVocabAction,
  resetAll as resetAllVocabulary,
  bulkCreateVocabularies,
} from 'app/shared/reducers/vocabulary.reducer';
import {
  fetchGrammarsByUnitId,
  updateGrammar as updateGrammarAction,
  deleteGrammar as deleteGrammarAction,
  resetAll as resetAllGrammar,
  bulkCreateGrammars,
} from 'app/shared/reducers/grammar.reducer';
import {
  fetchExercisesWithOptions,
  updateExercise as updateExerciseAction,
  deleteExercise as deleteExerciseAction,
  resetAll as resetAllExercise,
  bulkCreateExercises,
} from 'app/shared/reducers/exercise.reducer';
import { IUnit, defaultUnitValue as defaultUnit } from 'app/shared/model/unit.model';
import { IVocabulary, defaultVocabularyValue as defaultVocab } from 'app/shared/model/vocabulary.model';
import { IGrammar, defaultGrammarValue as defaultGrammar } from 'app/shared/model/grammar.model';
import { IExercise, defaultExerciseValue as defaultExercise } from 'app/shared/model/exercise.model';
import { IExerciseOption, defaultExerciseOptionValue as defaultOption } from 'app/shared/model/exercise-option.model';
import { ExerciseType } from 'app/shared/model/enumerations/exercise-type.model';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import './unit-update-v2.scss';
import { translate, Translate } from 'react-jhipster';
import { GrammarItemCard } from 'app/modules/teacher/unit-management/GrammarItemCard';
import { ZoomControls } from 'app/modules/teacher/unit-management/ZoomControls';
import { AddContentMenu } from 'app/modules/teacher/unit-management/AddContentMenu';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSave,
  faTrash,
  faPlus,
  faGripVertical,
  faCommentDots,
  faBook,
  faQuestionCircle,
  faChevronDown,
  faChevronUp,
  faCopy,
  faCheckSquare,
  faDotCircle,
  faSquare,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { MediaUploadField } from 'app/shared/components/form/MediaUploadField';

type FocusedSection = number | string | null;

export const UnitUpdateV2 = () => {
  const dispatch = useAppDispatch();
  const { selectedUnit, loading: unitLoading, errorMessage: unitError } = useAppSelector(state => state.unit);
  const {
    vocabularies: reduxVocabularies = [],
    loading: vocabLoading,
    errorMessage: vocabError,
  } = useAppSelector(state => state.vocabulary);
  const { grammars: reduxGrammars = [], loading: grammarLoading, errorMessage: grammarError } = useAppSelector(state => state.grammar);
  const { exercises: reduxExercises = [], loading: exerciseLoading, errorMessage: exerciseError } = useAppSelector(state => state.exercise);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IUnit>({
    defaultValues: defaultUnit,
    mode: 'onBlur',
  });

  const [vocabularies, setVocabularies] = useState<IVocabulary[]>([]);
  const [grammars, setGrammars] = useState<IGrammar[]>([]);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [focusedSection, setFocusedSection] = useState<number | string | null>(null);
  const [draggedVocabIndex, setDraggedVocabIndex] = useState<number | null>(null);
  const [draggedGrammarIndex, setDraggedGrammarIndex] = useState<number | null>(null);
  const [draggedExerciseIndex, setDraggedExerciseIndex] = useState<number | null>(null);
  const [expandedGrammarItems, setExpandedGrammarItems] = useState<Set<number>>(new Set());
  const [expandedVocabItems, setExpandedVocabItems] = useState<Set<number>>(new Set());
  const [expandedExerciseItems, setExpandedExerciseItems] = useState<Set<number>>(new Set());
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const { bookId, id } = useParams<{ bookId: string; id: string }>();
  const unitId = id;

  const navigate = useNavigate();

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
  }, []);

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleResetZoom();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleResetZoom]);

  useEffect(() => {
    if (unitId) {
      dispatch(fetchUnitById(unitId));
      dispatch(fetchVocabulariesByUnitId(unitId));
      dispatch(fetchGrammarsByUnitId(unitId));
      dispatch(fetchExercisesWithOptions(unitId));
    } else {
      // Reset state for new unit
      dispatch(clearSelectedUnit());
      dispatch(resetAllVocabulary());
      dispatch(resetAllGrammar());
      dispatch(resetAllExercise());
      // Also clear local state
      setVocabularies([]);
      setGrammars([]);
      setExercises([]);
    }
  }, [dispatch, unitId]);

  useEffect(() => {
    if (selectedUnit && unitId) {
      setValue('id', selectedUnit.id);
      setValue('title', selectedUnit.title || '');
      setValue('summary', selectedUnit.summary || '');
      setValue('orderIndex', selectedUnit.orderIndex || 0);
      setValue('bookId', selectedUnit.bookId);
    }
  }, [selectedUnit, unitId, setValue]);

  useEffect(() => {
    if (reduxVocabularies) {
      setVocabularies(reduxVocabularies);
    }
  }, [reduxVocabularies]);

  useEffect(() => {
    if (reduxGrammars) {
      setGrammars(reduxGrammars);
    }
  }, [reduxGrammars]);

  useEffect(() => {
    if (reduxExercises) {
      setExercises(reduxExercises);
    }
  }, [reduxExercises]);

  const onSubmit = useCallback(
    async (formData: IUnit) => {
      try {
        let currentUnitId = unitId;

        // 1. Save Unit Info
        if (unitId) {
          await dispatch(updateUnit(formData)).unwrap();
        } else {
          const newUnit = await dispatch(createUnit({ ...formData, bookId: Number(bookId) })).unwrap();
          currentUnitId = String(newUnit.id);
        }

        // 2. Save Content (Bulk)
        if (currentUnitId) {
          const unitIdNum = Number(currentUnitId);

          // Prepare data with correct unitId
          const vocabulariesToSave = vocabularies.map(v => ({ ...v, unitId: unitIdNum }));
          const grammarsToSave = grammars.map(g => ({ ...g, unitId: unitIdNum }));
          const exercisesToSave = exercises.map(e => ({ ...e, unitId: unitIdNum }));

          // Dispatch bulk actions
          const promises = [];
          if (vocabulariesToSave.length > 0) {
            promises.push(dispatch(bulkCreateVocabularies(vocabulariesToSave)).unwrap());
          }
          if (grammarsToSave.length > 0) {
            promises.push(dispatch(bulkCreateGrammars(grammarsToSave)).unwrap());
          }
          if (exercisesToSave.length > 0) {
            promises.push(dispatch(bulkCreateExercises({ unitId: unitIdNum, exercises: exercisesToSave })).unwrap());
          }

          await Promise.all(promises);

          toast.success(translate('langleague.teacher.units.form.messages.unitUpdated'));

          if (!unitId) {
            // If created new, navigate to edit page
            navigate(`/teacher/units/${currentUnitId}/edit`);
          } else {
            // Refresh data to get updated IDs
            dispatch(fetchVocabulariesByUnitId(currentUnitId));
            dispatch(fetchGrammarsByUnitId(currentUnitId));
            dispatch(fetchExercisesWithOptions(currentUnitId));
          }
        }
      } catch (error) {
        console.error('Error saving unit:', error);
        toast.error(translate('langleague.teacher.units.form.messages.loadFailed'));
      }
    },
    [dispatch, unitId, bookId, navigate, vocabularies, grammars, exercises],
  );

  // Vocabulary functions
  const addVocabulary = useCallback(() => {
    setVocabularies(prev => [...prev, { ...defaultVocab, unitId: Number(unitId) }]);
  }, [unitId]);

  const updateVocabulary = useCallback(<K extends keyof IVocabulary>(index: number, field: K, value: IVocabulary[K]) => {
    setVocabularies(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const deleteVocabulary = useCallback(
    async (index: number) => {
      const vocab = vocabularies[index];
      if (vocab.id) {
        if (window.confirm(translate('langleague.teacher.common.deleteConfirm'))) {
          try {
            await dispatch(deleteVocabAction(vocab.id)).unwrap();
            toast.success(translate('langleague.teacher.units.form.messages.vocabDeleted'));
          } catch (error) {
            toast.error(translate('langleague.teacher.units.form.messages.vocabDeleteFailed'));
            return;
          }
        } else {
          return;
        }
      }
      setVocabularies(prev => prev.filter((_, i) => i !== index));
    },
    [vocabularies, dispatch],
  );

  const toggleVocabItem = useCallback((index: number) => {
    setExpandedVocabItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const expandAllVocab = useCallback(() => {
    setExpandedVocabItems(new Set(vocabularies.map((_, idx) => idx)));
  }, [vocabularies]);

  const collapseAllVocab = useCallback(() => {
    setExpandedVocabItems(new Set());
  }, []);

  // ... (Drag and drop handlers) ...
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
    [draggedVocabIndex],
  );

  const handleVocabDragEnd = useCallback(() => {
    setDraggedVocabIndex(null);
  }, []);

  const duplicateVocabulary = useCallback((index: number) => {
    setVocabularies(prev => {
      const vocab = { ...prev[index], id: undefined };
      const updated = [...prev];
      updated.splice(index + 1, 0, vocab);
      return updated;
    });
  }, []);

  // Grammar functions
  const addGrammar = useCallback(() => {
    setGrammars(prev => [...prev, { ...defaultGrammar, unitId: Number(unitId) }]);
  }, [unitId]);

  const updateGrammar = useCallback(<K extends keyof IGrammar>(index: number, field: K, value: IGrammar[K]) => {
    setGrammars(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const deleteGrammar = useCallback(
    async (index: number) => {
      const grammar = grammars[index];
      if (grammar.id) {
        if (window.confirm(translate('langleague.teacher.common.deleteConfirm'))) {
          try {
            await dispatch(deleteGrammarAction(grammar.id)).unwrap();
            toast.success(translate('langleague.teacher.units.form.messages.grammarDeleted'));
          } catch (error) {
            toast.error(translate('langleague.teacher.units.form.messages.grammarDeleteFailed'));
            return;
          }
        } else {
          return;
        }
      }
      setGrammars(prev => prev.filter((_, i) => i !== index));
    },
    [grammars, dispatch],
  );

  const toggleGrammarItem = useCallback((index: number) => {
    setExpandedGrammarItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const expandAllGrammar = useCallback(() => {
    setExpandedGrammarItems(new Set(grammars.map((_, idx) => idx)));
  }, [grammars]);

  const collapseAllGrammar = useCallback(() => {
    setExpandedGrammarItems(new Set());
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
    [draggedGrammarIndex],
  );

  const handleGrammarDragEnd = useCallback(() => {
    setDraggedGrammarIndex(null);
  }, []);

  // Exercise functions
  const addExercise = useCallback(
    (type: ExerciseType = ExerciseType.SINGLE_CHOICE) => {
      setExercises(prev => [...prev, { ...defaultExercise, exerciseType: type, unitId: Number(unitId), options: [] }]);
    },
    [unitId],
  );

  const updateExercise = useCallback(<K extends keyof IExercise>(index: number, field: K, value: IExercise[K]) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const deleteExercise = useCallback(
    async (index: number) => {
      const exercise = exercises[index];
      if (exercise.id) {
        if (window.confirm(translate('langleague.teacher.common.deleteConfirm'))) {
          try {
            await dispatch(deleteExerciseAction(exercise.id)).unwrap();
            toast.success(translate('langleague.teacher.units.form.messages.exerciseDeleted'));
          } catch (error) {
            toast.error(translate('langleague.teacher.units.form.messages.exerciseDeleteFailed'));
            return;
          }
        } else {
          return;
        }
      }
      setExercises(prev => prev.filter((_, i) => i !== index));
    },
    [exercises, dispatch],
  );

  const toggleExerciseItem = useCallback((index: number) => {
    setExpandedExerciseItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const expandAllExercises = useCallback(() => {
    setExpandedExerciseItems(new Set(exercises.map((_, idx) => idx)));
  }, [exercises]);

  const collapseAllExercises = useCallback(() => {
    setExpandedExerciseItems(new Set());
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
    [draggedExerciseIndex],
  );

  const handleExerciseDragEnd = useCallback(() => {
    setDraggedExerciseIndex(null);
  }, []);

  // Exercise options functions
  const addOption = useCallback((exerciseIndex: number) => {
    setExercises(prev => {
      const updatedExercises = [...prev];
      const exercise = { ...updatedExercises[exerciseIndex] };
      exercise.options = [...(exercise.options || []), { ...defaultOption, orderIndex: exercise.options?.length || 0 }];
      updatedExercises[exerciseIndex] = exercise;
      return updatedExercises;
    });
  }, []);

  const updateOption = useCallback(
    <K extends keyof IExerciseOption>(exerciseIndex: number, optionIndex: number, field: K, value: IExerciseOption[K]) => {
      setExercises(prev => {
        const updatedExercises = [...prev];
        const exercise = { ...updatedExercises[exerciseIndex] };
        const options = [...(exercise.options || [])];
        options[optionIndex] = { ...options[optionIndex], [field]: value };
        exercise.options = options;
        updatedExercises[exerciseIndex] = exercise;
        return updatedExercises;
      });
    },
    [],
  );

  const handleCorrectOptionChange = useCallback((exerciseIndex: number, optionIndex: number, isChecked: boolean) => {
    setExercises(prev => {
      const updatedExercises = [...prev];
      const exercise = { ...updatedExercises[exerciseIndex] };
      const options = [...(exercise.options || [])];

      if (exercise.exerciseType === ExerciseType.SINGLE_CHOICE) {
        options.forEach((opt, i) => {
          options[i] = { ...opt, isCorrect: i === optionIndex };
        });
      } else {
        options[optionIndex] = { ...options[optionIndex], isCorrect: isChecked };
      }
      exercise.options = options;
      updatedExercises[exerciseIndex] = exercise;
      return updatedExercises;
    });
  }, []);

  const deleteOption = useCallback((exerciseIndex: number, optionIndex: number) => {
    setExercises(prev => {
      const updatedExercises = [...prev];
      const exercise = { ...updatedExercises[exerciseIndex] };
      const options = (exercise.options || []).filter((_, i) => i !== optionIndex);
      options.forEach((opt, i) => (opt.orderIndex = i)); // Re-index
      exercise.options = options;
      updatedExercises[exerciseIndex] = exercise;
      return updatedExercises;
    });
  }, []);

  const isLoading = unitLoading || vocabLoading || grammarLoading || exerciseLoading;
  const hasError = unitError || vocabError || grammarError || exerciseError;

  if (isLoading && unitId) {
    return <LoadingSpinner message="langleague.teacher.units.form.messages.loading" isI18nKey fullScreen />;
  }

  if (hasError) {
    const errorMsg = unitError || vocabError || grammarError || exerciseError;
    return (
      <ErrorDisplay
        message={errorMsg || translate('langleague.teacher.units.form.messages.loadFailed')}
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
    <div className="unit-update-v2" style={{ '--zoom-level': zoomLevel } as React.CSSProperties}>
      {/* Zoom Controls */}
      <ZoomControls
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        minZoom={0.5}
        maxZoom={1.5}
      />

      {/* Header */}
      <div className="form-header">
        <button onClick={() => navigate(`/teacher/books/${bookId}/edit`)} className="back-btn" type="button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="header-content">
          <Controller
            name="title"
            control={control}
            rules={{
              required: translate('langleague.teacher.units.form.validation.titleRequired'),
              minLength: {
                value: 3,
                message: translate('langleague.teacher.units.form.validation.titleMinLength'),
              },
            }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  value={field.value || ''}
                  type="text"
                  className={`chapter-title-input ${errors.title ? 'error' : ''}`}
                  placeholder={translate('langleague.teacher.units.form.fields.titlePlaceholder')}
                />
                {errors.title && <span className="error-message">{errors.title.message}</span>}
              </div>
            )}
          />
          <Controller
            name="summary"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                value={field.value || ''}
                className="chapter-description-input"
                placeholder={translate('langleague.teacher.units.form.fields.summaryPlaceholder')}
                rows={2}
              />
            )}
          />
        </div>
        <button onClick={handleSubmit(onSubmit)} className="send-btn" type="button" disabled={isSubmitting}>
          <FontAwesomeIcon icon={faSave} />{' '}
          {isSubmitting
            ? translate('langleague.teacher.units.form.buttons.saving')
            : translate('langleague.teacher.units.form.buttons.submit')}
        </button>
      </div>

      {/* Main Content */}
      <div className="form-content" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
        {/* Add Content Menu */}
        <div className="mb-4">
          <AddContentMenu
            onAddVocabulary={addVocabulary}
            onAddGrammar={addGrammar}
            onAddExercise={type => addExercise(type as ExerciseType)}
            showExerciseTypes={true}
          />
        </div>

        {/* Vocabulary Section */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <h3 className="section-title">
            <FontAwesomeIcon icon={faCommentDots} /> <Translate contentKey="langleague.teacher.units.menu.vocabulary">Vocabulary</Translate>
          </h3>
          <div className="divider-line"></div>
        </div>

        {vocabularies.length > 0 && (
          <div className="global-controls">
            <button className="control-btn" onClick={expandAllVocab} type="button">
              <FontAwesomeIcon icon={faChevronDown} />{' '}
              <Translate contentKey="langleague.teacher.units.form.buttons.expandAll">Expand All</Translate>
            </button>
            <button className="control-btn" onClick={collapseAllVocab} type="button">
              <FontAwesomeIcon icon={faChevronUp} />{' '}
              <Translate contentKey="langleague.teacher.units.form.buttons.collapseAll">Collapse All</Translate>
            </button>
          </div>
        )}

        {vocabularies.map((vocab, index) => (
          <div
            key={index}
            className={`collapsible-card ${expandedVocabItems.has(index) ? 'expanded' : 'collapsed'} ${draggedVocabIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleVocabDragStart(index)}
            onDragOver={e => handleVocabDragOver(e, index)}
            onDragEnd={handleVocabDragEnd}
          >
            <div className="collapsible-card-header" onClick={() => toggleVocabItem(index)}>
              <div className="header-left">
                <FontAwesomeIcon icon={faGripVertical} className="drag-handle" />
                <span className="card-number">{index + 1}</span>
                <FontAwesomeIcon icon={faCommentDots} className="card-icon" />
                <span className="card-summary">{vocab.word || translate('langleague.teacher.units.labels.newVocabulary')}</span>
              </div>
              <div className="header-right">
                <button
                  className="action-btn delete"
                  onClick={e => {
                    e.stopPropagation();
                    deleteVocabulary(index);
                  }}
                  title={translate('entity.action.delete')}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button className="toggle-btn">
                  <FontAwesomeIcon icon={expandedVocabItems.has(index) ? faChevronUp : faChevronDown} />
                </button>
              </div>
            </div>

            <div className="collapsible-card-body" style={{ display: expandedVocabItems.has(index) ? 'block' : 'none' }}>
              <div className="form-field">
                <input
                  type="text"
                  value={vocab.word || ''}
                  onChange={e => updateVocabulary(index, 'word', e.target.value)}
                  placeholder={translate('langleague.teacher.units.vocabulary.placeholders.word')}
                  className="field-input"
                  onClick={e => e.stopPropagation()}
                />
                <div className="field-underline"></div>
              </div>

              <div className="form-field">
                <input
                  type="text"
                  value={vocab.phonetic || ''}
                  onChange={e => updateVocabulary(index, 'phonetic', e.target.value)}
                  placeholder={translate('langleague.teacher.units.vocabulary.placeholders.phonetic')}
                  className="field-input"
                  onClick={e => e.stopPropagation()}
                />
                <div className="field-underline"></div>
              </div>

              <div className="form-field">
                <input
                  type="text"
                  value={vocab.meaning || ''}
                  onChange={e => updateVocabulary(index, 'meaning', e.target.value)}
                  placeholder={translate('langleague.teacher.units.vocabulary.placeholders.meaning')}
                  className="field-input"
                  onClick={e => e.stopPropagation()}
                />
                <div className="field-underline"></div>
              </div>

              <div className="form-field">
                <textarea
                  value={vocab.example || ''}
                  onChange={e => updateVocabulary(index, 'example', e.target.value)}
                  placeholder={translate('langleague.teacher.units.vocabulary.placeholders.example')}
                  className="field-textarea"
                  rows={2}
                  onClick={e => e.stopPropagation()}
                />
                <div className="field-underline"></div>
              </div>

              <MediaUploadField
                type="image"
                label={translate('langleague.teacher.units.vocabulary.placeholders.imageUrl')}
                value={vocab.imageUrl}
                onChange={url => updateVocabulary(index, 'imageUrl', url)}
                placeholder={translate('global.form.image.url.placeholder')}
              />

              <div className="card-footer">
                <button
                  className="action-btn"
                  onClick={e => {
                    e.stopPropagation();
                    duplicateVocabulary(index);
                  }}
                  title={translate('langleague.teacher.units.form.actions.duplicate')}
                >
                  <FontAwesomeIcon icon={faCopy} /> {translate('langleague.teacher.units.form.actions.duplicate')}
                </button>
              </div>
            </div>
          </div>
        ))}

        <button className="add-section-btn" onClick={addVocabulary}>
          <FontAwesomeIcon icon={faPlus} />{' '}
          <Translate contentKey="langleague.teacher.units.form.buttons.addVocabulary">Add Vocabulary</Translate>
        </button>

        <div className="section-divider">
          <div className="divider-line"></div>
          <h3 className="section-title">
            <FontAwesomeIcon icon={faBook} /> <Translate contentKey="langleague.teacher.units.menu.grammar">Grammar</Translate>
          </h3>
          <div className="divider-line"></div>
        </div>

        {grammars.length > 0 && (
          <div className="global-controls">
            <button className="control-btn" onClick={expandAllGrammar} type="button">
              <FontAwesomeIcon icon={faChevronDown} />{' '}
              <Translate contentKey="langleague.teacher.units.form.buttons.expandAll">Expand All</Translate>
            </button>
            <button className="control-btn" onClick={collapseAllGrammar} type="button">
              <FontAwesomeIcon icon={faChevronUp} />{' '}
              <Translate contentKey="langleague.teacher.units.form.buttons.collapseAll">Collapse All</Translate>
            </button>
          </div>
        )}

        {grammars.map((grammar, index) => (
          <div key={index}>
            <GrammarItemCard
              index={index}
              data={grammar}
              isExpanded={expandedGrammarItems.has(index)}
              isDragging={draggedGrammarIndex === index}
              onToggle={() => toggleGrammarItem(index)}
              onChange={(field, value) => updateGrammar(index, field, value)}
              onRemove={() => deleteGrammar(index)}
              onDuplicate={() => duplicateGrammar(index)}
              onDragStart={() => handleGrammarDragStart(index)}
              onDragOver={e => handleGrammarDragOver(e, index)}
              onDragEnd={handleGrammarDragEnd}
            />
          </div>
        ))}

        <button className="add-section-btn" onClick={addGrammar}>
          <FontAwesomeIcon icon={faPlus} /> <Translate contentKey="langleague.teacher.units.form.addGrammar">Add Grammar</Translate>
        </button>

        <div className="section-divider">
          <div className="divider-line"></div>
          <h3 className="section-title">
            <FontAwesomeIcon icon={faQuestionCircle} /> <Translate contentKey="langleague.teacher.units.menu.exercise">Exercises</Translate>
          </h3>
          <div className="divider-line"></div>
        </div>

        {exercises.length > 0 && (
          <div className="global-controls">
            <button className="control-btn" onClick={expandAllExercises} type="button">
              <FontAwesomeIcon icon={faChevronDown} />{' '}
              <Translate contentKey="langleague.teacher.units.form.buttons.expandAll">Expand All</Translate>
            </button>
            <button className="control-btn" onClick={collapseAllExercises} type="button">
              <FontAwesomeIcon icon={faChevronUp} />{' '}
              <Translate contentKey="langleague.teacher.units.form.buttons.collapseAll">Collapse All</Translate>
            </button>
          </div>
        )}

        {exercises.map((exercise, index) => (
          <div
            key={index}
            className={`collapsible-card ${expandedExerciseItems.has(index) ? 'expanded' : 'collapsed'} ${draggedExerciseIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleExerciseDragStart(index)}
            onDragOver={e => handleExerciseDragOver(e, index)}
            onDragEnd={handleExerciseDragEnd}
          >
            <div className="collapsible-card-header" onClick={() => toggleExerciseItem(index)}>
              <div className="header-left">
                <span className="card-number">{index + 1}</span>
                <FontAwesomeIcon icon={faQuestionCircle} className="card-icon" />
                <FontAwesomeIcon icon={faGripVertical} className="drag-handle" />
                <span className="card-summary">
                  {exercise.exerciseText || translate('langleague.teacher.units.labels.newExercise')}
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--teacher-text-tertiary)' }}>
                    (
                    {translate(
                      `langleague.teacher.units.exercises.types.${exercise.exerciseType === ExerciseType.SINGLE_CHOICE ? 'singleChoice' : exercise.exerciseType === ExerciseType.MULTI_CHOICE ? 'multiChoice' : 'fillInBlank'}`,
                    )}
                    )
                  </span>
                </span>
              </div>
              <div className="header-right">
                <button
                  className="action-btn delete"
                  onClick={e => {
                    e.stopPropagation();
                    deleteExercise(index);
                  }}
                  title={translate('entity.action.delete')}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button className="toggle-btn">
                  <FontAwesomeIcon icon={expandedExerciseItems.has(index) ? faChevronUp : faChevronDown} />
                </button>
              </div>
            </div>

            <div className="collapsible-card-body" style={{ display: expandedExerciseItems.has(index) ? 'block' : 'none' }}>
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <select
                  value={exercise.exerciseType}
                  onChange={e => updateExercise(index, 'exerciseType', e.target.value as ExerciseType)}
                  className="question-type-select"
                  onClick={e => e.stopPropagation()}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--teacher-border)',
                    background: 'transparent',
                    color: 'var(--teacher-text-primary)',
                  }}
                >
                  <option value={ExerciseType.SINGLE_CHOICE}>{translate('langleague.teacher.units.exercises.types.singleChoice')}</option>
                  <option value={ExerciseType.MULTI_CHOICE}>{translate('langleague.teacher.units.exercises.types.multiChoice')}</option>
                  <option value={ExerciseType.FILL_IN_BLANK}>{translate('langleague.teacher.units.exercises.types.fillInBlank')}</option>
                </select>
              </div>

              <div className="form-field">
                <textarea
                  value={exercise.exerciseText || ''}
                  onChange={e => updateExercise(index, 'exerciseText', e.target.value)}
                  placeholder={translate('langleague.teacher.units.exercises.placeholders.text')}
                  className="field-textarea"
                  rows={3}
                  onClick={e => e.stopPropagation()}
                />
                <div className="field-underline"></div>
              </div>

              {exercise.exerciseType !== ExerciseType.FILL_IN_BLANK && (
                <div className="options-section">
                  {(exercise.options || []).map((option, optIndex) => (
                    <div key={optIndex} className="option-item">
                      <input
                        type={exercise.exerciseType === ExerciseType.SINGLE_CHOICE ? 'radio' : 'checkbox'}
                        name={`exercise-${index}-option-${optIndex}`}
                        checked={option.isCorrect || false}
                        onChange={e => handleCorrectOptionChange(index, optIndex, e.target.checked)}
                        className="option-radio"
                        onClick={e => e.stopPropagation()}
                      />
                      <input
                        type="text"
                        value={option.optionText || ''}
                        onChange={e => updateOption(index, optIndex, 'optionText', e.target.value)}
                        placeholder={`${translate('langleague.teacher.units.exercises.placeholders.option')} ${optIndex + 1}`}
                        className="option-input"
                        onClick={e => e.stopPropagation()}
                      />
                      <button
                        className="option-delete"
                        onClick={e => {
                          e.stopPropagation();
                          deleteOption(index, optIndex);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-option-btn"
                    onClick={e => {
                      e.stopPropagation();
                      addOption(index);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />{' '}
                    <Translate contentKey="langleague.teacher.units.exercises.buttons.addOption">Add option</Translate>
                  </button>
                </div>
              )}

              {exercise.exerciseType === ExerciseType.FILL_IN_BLANK && (
                <div className="form-field">
                  <input
                    placeholder={translate('langleague.teacher.units.exercises.placeholders.correctAnswer')}
                    value={exercise.correctAnswerRaw || ''}
                    onChange={e => updateExercise(index, 'correctAnswerRaw', e.target.value)}
                    className="field-input"
                    onClick={e => e.stopPropagation()}
                  />
                  <div className="field-underline"></div>
                </div>
              )}

              <div className="form-row-2">
                <MediaUploadField
                  type="image"
                  label={translate('langleague.teacher.units.exercises.placeholders.imageUrl')}
                  value={exercise.imageUrl}
                  onChange={url => updateExercise(index, 'imageUrl', url)}
                  placeholder={translate('global.form.image.url.placeholder')}
                />
                <MediaUploadField
                  type="audio"
                  label={translate('langleague.teacher.units.exercises.placeholders.audioUrl')}
                  value={exercise.audioUrl}
                  onChange={url => updateExercise(index, 'audioUrl', url)}
                  placeholder={translate('global.form.audio.url.placeholder')}
                />
              </div>

              <div className="card-footer">
                <button
                  className="action-btn"
                  onClick={e => {
                    e.stopPropagation();
                    duplicateExercise(index);
                  }}
                  title={translate('langleague.teacher.units.form.actions.duplicate')}
                >
                  <FontAwesomeIcon icon={faCopy} /> {translate('langleague.teacher.units.form.actions.duplicate')}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="add-question-menu">
          <button className="add-section-btn" onClick={() => addExercise(ExerciseType.SINGLE_CHOICE)}>
            <FontAwesomeIcon icon={faPlus} />{' '}
            <Translate contentKey="langleague.teacher.units.exercises.menu.addExercise">Add Exercise</Translate>
          </button>
          <div className="question-type-buttons">
            <button onClick={() => addExercise(ExerciseType.SINGLE_CHOICE)} className="type-btn">
              <FontAwesomeIcon icon={faDotCircle} />{' '}
              <Translate contentKey="langleague.teacher.units.exercises.menu.singleChoice">Single Choice</Translate>
            </button>
            <button onClick={() => addExercise(ExerciseType.MULTI_CHOICE)} className="type-btn">
              <FontAwesomeIcon icon={faCheckSquare} />{' '}
              <Translate contentKey="langleague.teacher.units.exercises.menu.multiChoice">Multi Choice</Translate>
            </button>
            <button onClick={() => addExercise(ExerciseType.FILL_IN_BLANK)} className="type-btn">
              <FontAwesomeIcon icon={faSquare} />{' '}
              <Translate contentKey="langleague.teacher.units.exercises.menu.fillInBlank">Fill in Blank</Translate>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitUpdateV2;
