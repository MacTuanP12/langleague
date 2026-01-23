import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/unit/unit.reducer';
import { IGrammar } from 'app/shared/model/grammar.model';
import ReactMarkdown from 'react-markdown';
import { Translate } from 'react-jhipster';
import AiGrammarTutorButton from './components/AiGrammarTutorButton';
import { LoadingSpinner } from 'app/shared/components';
import './unit-grammar.scss'; // Pure widget styling

interface UnitGrammarProps {
  data?: IGrammar[];
}

export const UnitGrammar: React.FC<UnitGrammarProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const { unitId } = useParams<'unitId'>();
  const unit = useAppSelector(state => state.unit.entity);
  const loading = useAppSelector(state => state.unit.loading);

  useEffect(() => {
    if (!data && unitId) {
      dispatch(getEntity(unitId));
    }
  }, [unitId, data, dispatch]);

  const grammarList: IGrammar[] = useMemo(() => data || unit?.grammars || [], [data, unit]);
  const [selectedGrammar, setSelectedGrammar] = useState<IGrammar | null>(null);

  useEffect(() => {
    if (grammarList.length > 0 && !selectedGrammar) {
      setSelectedGrammar(grammarList[0]);
    }
  }, [grammarList, selectedGrammar]);

  if (loading && !data) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner message="langleague.student.learning.exercise.loading" isI18nKey />
      </div>
    );
  }

  if (grammarList.length === 0) {
    return (
      <div className="grammar-empty">
        <Translate contentKey="langleague.student.learning.grammar.noGrammar">No grammar lessons available</Translate>
      </div>
    );
  }

  return (
    <div className="grammar-widget">
      {/* Grammar List Sidebar */}
      <div className="grammar-sidebar">
        {grammarList.map((grammar: IGrammar, index: number) => (
          <div
            key={grammar.id}
            className={`grammar-item ${selectedGrammar?.id === grammar.id ? 'active' : ''}`}
            onClick={() => setSelectedGrammar(grammar)}
          >
            <span className="grammar-number">{index + 1}</span>
            <span className="grammar-item-title">{grammar.title}</span>
          </div>
        ))}
      </div>

      {/* Grammar Content */}
      {selectedGrammar && (
        <div className="grammar-content-area">
          <div className="grammar-card">
            <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-2">
              <h4 className="grammar-title mb-0 border-0 pb-0">{selectedGrammar.title}</h4>
              <AiGrammarTutorButton
                grammarTitle={selectedGrammar.title || ''}
                grammarContent={selectedGrammar.contentMarkdown || ''}
                grammarExamples={selectedGrammar.exampleUsage || ''}
              />
            </div>

            <div className="grammar-content">
              <ReactMarkdown>{selectedGrammar.contentMarkdown || ''}</ReactMarkdown>
            </div>
            {selectedGrammar.exampleUsage && (
              <div className="grammar-example">
                <strong>
                  <Translate contentKey="langleague.student.learning.grammar.example">Example:</Translate>
                </strong>
                <p>{selectedGrammar.exampleUsage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitGrammar;
