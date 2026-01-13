import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { fetchGrammarsByUnitId } from 'app/shared/reducers/grammar.reducer';
import { IGrammar } from 'app/shared/model/grammar.model';
import ReactMarkdown from 'react-markdown';
import { Translate } from 'react-jhipster';

export const UnitGrammar = () => {
  const dispatch = useAppDispatch();
  const { selectedUnit } = useAppSelector(state => state.unit);
  const { grammars } = useAppSelector(state => state.grammar);
  const [selectedGrammar, setSelectedGrammar] = useState<IGrammar | null>(null);
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (unitId) {
      dispatch(fetchUnitById(unitId));
      dispatch(fetchGrammarsByUnitId(unitId));
    }
  }, [dispatch, unitId]);

  useEffect(() => {
    if (grammars.length > 0 && !selectedGrammar) {
      setSelectedGrammar(grammars[0]);
    }
  }, [grammars, selectedGrammar]);

  return (
    <div className="unit-grammar">
      <div className="grammar-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Book List
        </button>
        <div className="header-info">
          <div className="breadcrumb">
            <span>UNIT 1 - GRAMMAR</span>
          </div>
          <h2>{selectedUnit?.title || 'Grammar'}</h2>
        </div>
      </div>

      <div className="grammar-content">
        {selectedGrammar && (
          <div className="grammar-detail">
            <h3>{selectedGrammar.title}</h3>

            {selectedGrammar.contentMarkdown && (
              <div className="grammar-section">
                <div className="section-header">
                  <span className="section-icon">📖</span>
                  <h4>Content</h4>
                </div>
                <div className="markdown-content">
                  <ReactMarkdown>{selectedGrammar.contentMarkdown}</ReactMarkdown>
                </div>
              </div>
            )}

            {selectedGrammar.exampleUsage && (
              <div className="grammar-section">
                <div className="section-header">
                  <span className="section-icon">💡</span>
                  <h4>Examples</h4>
                </div>
                <div className="markdown-content">
                  <ReactMarkdown>{selectedGrammar.exampleUsage}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {(!grammars || grammars.length === 0) && (
          <div className="empty-state">
            <p>
              <Translate contentKey="langleague.student.learning.grammar.noGrammar">No grammar lessons added yet for this unit.</Translate>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitGrammar;
