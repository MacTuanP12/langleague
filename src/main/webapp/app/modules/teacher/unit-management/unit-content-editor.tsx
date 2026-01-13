import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane, Button, Row, Col, Card, CardBody } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId, deleteVocabulary } from 'app/shared/reducers/vocabulary.reducer';
import { fetchGrammarsByUnitId, deleteGrammar } from 'app/shared/reducers/grammar.reducer';
import { fetchExercisesByUnitId, deleteExercise } from 'app/shared/reducers/exercise.reducer';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import AIImportAssistant from 'app/modules/teacher/import/ai-import-assistant';
import { VocabularyDisplayCard } from './VocabularyDisplayCard';
import { GrammarDisplayCard } from './GrammarDisplayCard';
import { LoadingSpinner } from 'app/shared/components';
import { toast } from 'react-toastify';

export const UnitContentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('1');

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
    if (window.confirm('Are you sure you want to delete this vocabulary?')) {
      await dispatch(deleteVocabulary(vocabId));
      toast.success('Vocabulary deleted');
    }
  };

  const handleDeleteGrammar = async (grammarId: number) => {
    if (window.confirm('Are you sure you want to delete this grammar rule?')) {
      await dispatch(deleteGrammar(grammarId));
      toast.success('Grammar rule deleted');
    }
  };

  const handleDeleteExercise = async (exerciseId: number) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      await dispatch(deleteExercise(exerciseId));
      toast.success('Exercise deleted');
    }
  };

  if (!unit && loading) {
    return (
      <TeacherLayout>
        <LoadingSpinner message="Loading unit content..." />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="unit-content-editor">
        <div className="d-flex align-items-center mb-4">
          <Button color="link" className="p-0 me-3 text-decoration-none" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back
          </Button>
          <div>
            <h2 className="mb-0">{unit?.name || 'Unit Content'}</h2>
            <p className="text-muted mb-0">Manage vocabulary, grammar, and exercises</p>
          </div>
        </div>

        <Nav tabs className="mb-4">
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggle('1')} style={{ cursor: 'pointer' }}>
              Vocabulary ({vocabularies.length})
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggle('2')} style={{ cursor: 'pointer' }}>
              Grammar ({grammars.length})
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggle('3')} style={{ cursor: 'pointer' }}>
              Exercises ({exercises.length})
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          {/* VOCABULARY TAB */}
          <TabPane tabId="1">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Vocabulary List</h4>
              <div>
                <Button color="primary" outline className="me-2">
                  <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Word
                </Button>
                <AIImportAssistant unitId={id} onSuccess={loadContent} />
              </div>
            </div>

            {vocabularies.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded">
                <p>No vocabulary added yet.</p>
                <p>Use the AI Assistant to generate words from a topic!</p>
              </div>
            ) : (
              <Row>
                {vocabularies.map(vocab => (
                  <Col md={6} lg={4} key={vocab.id} className="mb-3">
                    <VocabularyDisplayCard
                      vocabulary={vocab}
                      onDelete={() => handleDeleteVocabulary(vocab.id)}
                      onEdit={() => {}} // Implement edit later
                    />
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>

          {/* GRAMMAR TAB */}
          <TabPane tabId="2">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Grammar Rules</h4>
              <div>
                <Button color="primary" outline className="me-2">
                  <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Rule
                </Button>
                <AIImportAssistant unitId={id} onSuccess={loadContent} />
              </div>
            </div>

            {grammars.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded">
                <p>No grammar rules added yet.</p>
              </div>
            ) : (
              <Row>
                {grammars.map(grammar => (
                  <Col md={12} key={grammar.id} className="mb-3">
                    <GrammarDisplayCard grammar={grammar} onDelete={() => handleDeleteGrammar(grammar.id)} onEdit={() => {}} />
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>

          {/* EXERCISES TAB */}
          <TabPane tabId="3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Exercises</h4>
              <div>
                <Button color="primary" outline className="me-2">
                  <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Question
                </Button>
                <AIImportAssistant unitId={id} onSuccess={loadContent} />
              </div>
            </div>

            {exercises.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded">
                <p>No exercises added yet.</p>
              </div>
            ) : (
              <div className="exercise-list">
                {exercises.map((exercise, index) => (
                  <Card key={exercise.id} className="mb-3">
                    <CardBody>
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title">Question {index + 1}</h5>
                        <Button size="sm" color="danger" outline onClick={() => handleDeleteExercise(exercise.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                      <p className="card-text">{exercise.question}</p>
                      {/* Render options if available in the model */}
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </TabPane>
        </TabContent>
      </div>
    </TeacherLayout>
  );
};

export default UnitContentEditor;
