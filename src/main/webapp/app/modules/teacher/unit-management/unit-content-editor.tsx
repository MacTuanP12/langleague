import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane, Button, Row, Col, Card, CardBody, Container } from 'reactstrap';
import classnames from 'classnames';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId, deleteVocabulary } from 'app/shared/reducers/vocabulary.reducer';
import { fetchGrammarsByUnitId, deleteGrammar } from 'app/shared/reducers/grammar.reducer';
import { fetchExercisesByUnitId, deleteExercise } from 'app/shared/reducers/exercise.reducer';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import { VocabularyDisplayCard } from './VocabularyDisplayCard';
import { GrammarDisplayCard } from './GrammarDisplayCard';
import { LoadingSpinner } from 'app/shared/components';
import { toast } from 'react-toastify';
import '../teacher.scss';
import { VocabularyModal } from './VocabularyModal';
import { GrammarModal } from './GrammarModal';
import { ExerciseModal } from './ExerciseModal';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
import { IGrammar } from 'app/shared/model/grammar.model';
import { IExercise } from 'app/shared/model/exercise.model';

export const UnitContentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('1');

  const [vocabModalOpen, setVocabModalOpen] = useState(false);
  const [grammarModalOpen, setGrammarModalOpen] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);

  const [selectedVocabulary, setSelectedVocabulary] = useState<IVocabulary | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<IGrammar | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<IExercise | null>(null);

  const unit = useAppSelector(state => state.unit.selectedUnit);
  const vocabularies = useAppSelector(state => state.vocabulary.vocabularies);
  const grammars = useAppSelector(state => state.grammar.grammars);
  const exercises = useAppSelector(state => state.exercise.exercises);
  const loading = useAppSelector(
    state => state.unit.loading || state.vocabulary.loading || state.grammar.loading || state.exercise.loading,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchUnitById(id));
      loadContent();
    }
  }, [id, dispatch]);

  const loadContent = () => {
    if (id) {
      dispatch(fetchVocabulariesByUnitId(id));
      dispatch(fetchGrammarsByUnitId(id));
      dispatch(fetchExercisesByUnitId(id));
    }
  };

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleDeleteVocabulary = async (vocabId: number) => {
    if (window.confirm(translate('langleague.teacher.editor.confirmDelete.vocabulary'))) {
      await dispatch(deleteVocabulary(vocabId));
      toast.success(translate('langleague.teacher.editor.success.vocabularyDeleted'));
      loadContent();
    }
  };

  const handleEditVocabulary = (vocab: IVocabulary) => {
    setSelectedVocabulary(vocab);
    setVocabModalOpen(true);
  };

  const handleDeleteGrammar = async (grammarId: number) => {
    if (window.confirm(translate('langleague.teacher.editor.confirmDelete.grammar'))) {
      await dispatch(deleteGrammar(grammarId));
      toast.success(translate('langleague.teacher.editor.success.grammarDeleted'));
      loadContent();
    }
  };

  const handleEditGrammar = (grammar: IGrammar) => {
    setSelectedGrammar(grammar);
    setGrammarModalOpen(true);
  };

  const handleDeleteExercise = async (exerciseId: number) => {
    if (window.confirm(translate('langleague.teacher.editor.confirmDelete.exercise'))) {
      await dispatch(deleteExercise(exerciseId));
      toast.success(translate('langleague.teacher.editor.success.exerciseDeleted'));
      loadContent();
    }
  };

  const handleEditExercise = (exercise: IExercise) => {
    setSelectedExercise(exercise);
    setExerciseModalOpen(true);
  };

  if (!unit && loading) {
    return (
      <TeacherLayout>
        <LoadingSpinner message="langleague.teacher.editor.loading" isI18nKey />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout
      title={unit?.title || 'Unit Content'}
      subtitle={<Translate contentKey="langleague.teacher.editor.subtitle">Manage vocabulary, grammar, and exercises</Translate>}
      showBackButton={false}
    >
      <Container fluid className="teacher-page-container">
        {/* Header with Back Button */}
        <div className="mb-4">
          <Button color="link" className="p-0 text-decoration-none" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon="arrow-left" className="me-2" />
            <Translate contentKey="langleague.teacher.editor.backToBook">Back to Book</Translate>
          </Button>
        </div>

        {/* Tabs Navigation */}
        <Nav tabs className="mb-4">
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggle('1')} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon="book" className="me-2" />
              <Translate contentKey="langleague.teacher.editor.tabs.vocabulary">Vocabulary</Translate> ({vocabularies.length})
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggle('2')} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon="book-open" className="me-2" />
              <Translate contentKey="langleague.teacher.editor.tabs.grammar">Grammar</Translate> ({grammars.length})
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggle('3')} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon="question-circle" className="me-2" />
              <Translate contentKey="langleague.teacher.editor.tabs.exercises">Exercises</Translate> ({exercises.length})
            </NavLink>
          </NavItem>
        </Nav>

        {/* Tab Content */}
        <TabContent activeTab={activeTab}>
          {/* VOCABULARY TAB */}
          <TabPane tabId="1">
            <Card className="stat-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">
                    <Translate contentKey="langleague.teacher.editor.vocabulary.title">Vocabulary List</Translate>
                  </h4>
                  <div className="d-flex gap-2">
                    <Button
                      color="primary"
                      outline
                      onClick={() => {
                        setSelectedVocabulary(null);
                        setVocabModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon="plus" className="me-2" />
                      <Translate contentKey="langleague.teacher.editor.vocabulary.addWord">Add Word</Translate>
                    </Button>
                  </div>
                </div>

                {vocabularies.length === 0 ? (
                  <div className="text-center py-5">
                    <FontAwesomeIcon icon="inbox" size="3x" className="text-muted mb-3" />
                    <p className="text-muted">
                      <Translate contentKey="langleague.teacher.editor.vocabulary.empty">No vocabulary added yet.</Translate>
                    </p>
                  </div>
                ) : (
                  <Row>
                    {vocabularies.map(vocab => (
                      <Col md={6} lg={4} key={vocab.id} className="mb-3">
                        <VocabularyDisplayCard
                          vocabulary={vocab}
                          onDelete={() => handleDeleteVocabulary(vocab.id)}
                          onEdit={() => handleEditVocabulary(vocab)}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </CardBody>
            </Card>
          </TabPane>

          {/* GRAMMAR TAB */}
          <TabPane tabId="2">
            <Card className="stat-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">
                    <Translate contentKey="langleague.teacher.editor.grammar.title">Grammar Rules</Translate>
                  </h4>
                  <div className="d-flex gap-2">
                    <Button
                      color="primary"
                      outline
                      onClick={() => {
                        setSelectedGrammar(null);
                        setGrammarModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon="plus" className="me-2" />
                      <Translate contentKey="langleague.teacher.editor.grammar.addRule">Add Rule</Translate>
                    </Button>
                  </div>
                </div>

                {grammars.length === 0 ? (
                  <div className="text-center py-5">
                    <FontAwesomeIcon icon="inbox" size="3x" className="text-muted mb-3" />
                    <p className="text-muted">
                      <Translate contentKey="langleague.teacher.editor.grammar.empty">No grammar rules added yet.</Translate>
                    </p>
                  </div>
                ) : (
                  <Row>
                    {grammars.map(grammar => (
                      <Col md={12} key={grammar.id} className="mb-3">
                        <GrammarDisplayCard
                          grammar={grammar}
                          onDelete={() => handleDeleteGrammar(grammar.id)}
                          onEdit={() => handleEditGrammar(grammar)}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </CardBody>
            </Card>
          </TabPane>

          {/* EXERCISES TAB */}
          <TabPane tabId="3">
            <Card className="stat-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">
                    <Translate contentKey="langleague.teacher.editor.exercises.title">Exercises</Translate>
                  </h4>
                  <div className="d-flex gap-2">
                    <Button
                      color="primary"
                      outline
                      onClick={() => {
                        setSelectedExercise(null);
                        setExerciseModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon="plus" className="me-2" />
                      <Translate contentKey="langleague.teacher.editor.exercises.addQuestion">Add Question</Translate>
                    </Button>
                  </div>
                </div>

                {exercises.length === 0 ? (
                  <div className="text-center py-5">
                    <FontAwesomeIcon icon="inbox" size="3x" className="text-muted mb-3" />
                    <p className="text-muted">
                      <Translate contentKey="langleague.teacher.editor.exercises.empty">No exercises added yet.</Translate>
                    </p>
                  </div>
                ) : (
                  <div className="exercise-list">
                    {exercises.map((exercise, index) => (
                      <Card key={exercise.id} className="mb-3">
                        <CardBody>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h5 className="card-title">
                                <Translate contentKey="langleague.teacher.editor.exercises.question">Question</Translate> {index + 1}
                              </h5>
                              <p className="card-text">{exercise.exerciseText}</p>
                            </div>
                            <div className="d-flex gap-2">
                              <Button size="sm" color="info" outline onClick={() => handleEditExercise(exercise)}>
                                <FontAwesomeIcon icon="pencil-alt" />
                              </Button>
                              <Button size="sm" color="danger" outline onClick={() => handleDeleteExercise(exercise.id)}>
                                <FontAwesomeIcon icon="trash" />
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>

        {/* Manual Creation/Edit Modals */}
        <VocabularyModal
          isOpen={vocabModalOpen}
          toggle={() => {
            setVocabModalOpen(!vocabModalOpen);
            if (vocabModalOpen) setSelectedVocabulary(null);
          }}
          unitId={id}
          onSuccess={loadContent}
          vocabularyEntity={selectedVocabulary}
        />
        <GrammarModal
          isOpen={grammarModalOpen}
          toggle={() => {
            setGrammarModalOpen(!grammarModalOpen);
            if (grammarModalOpen) setSelectedGrammar(null);
          }}
          unitId={id}
          onSuccess={loadContent}
          grammarEntity={selectedGrammar}
        />
        <ExerciseModal
          isOpen={exerciseModalOpen}
          toggle={() => {
            setExerciseModalOpen(!exerciseModalOpen);
            if (exerciseModalOpen) setSelectedExercise(null);
          }}
          unitId={id}
          onSuccess={loadContent}
          exerciseEntity={selectedExercise}
        />
      </Container>
    </TeacherLayout>
  );
};

export default UnitContentEditor;
