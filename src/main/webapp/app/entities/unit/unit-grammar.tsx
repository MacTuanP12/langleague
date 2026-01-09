import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { IUnit } from 'app/shared/model/unit.model';
import { IGrammar, IGrammarExample } from 'app/shared/model/grammar.model';

export const UnitGrammar = () => {
  const [unit, setUnit] = useState<IUnit | null>(null);
  const [grammars, setGrammars] = useState<IGrammar[]>([]);
  const [selectedGrammar, setSelectedGrammar] = useState<IGrammar | null>(null);
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (unitId) {
      loadUnit();
      loadGrammars();
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

  const loadGrammars = async () => {
    try {
      const response = await axios.get(`/api/units/${unitId}/grammars`);
      setGrammars(response.data);
      if (response.data.length > 0) {
        setSelectedGrammar(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading grammars:', error);
    }
  };

  const parseExamples = (examplesJson: string) => {
    try {
      return JSON.parse(examplesJson || '[]');
    } catch (e) {
      return [];
    }
  };

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
          <h2>{unit?.title || 'Grammar'}</h2>
        </div>
      </div>

      <div className="grammar-content">
        {selectedGrammar && (
          <div className="grammar-detail">
            <h3>{selectedGrammar.title}</h3>
            <div className="grammar-subtitle">{selectedGrammar.title === 'Present Perfect Tense' && 'Thì hiện tại hoàn thành'}</div>

            {selectedGrammar.contentMarkdown && (
              <div className="grammar-section">
                <div className="section-header">
                  <span className="section-icon">📋</span>
                  <h4>Structure</h4>
                </div>
                <div className="structure-list">
                  {selectedGrammar.contentMarkdown.split('\n').map((struct, idx) => (
                    <div key={idx} className="structure-item">
                      <span className="structure-badge">{struct.includes('(+)') ? '(+)' : struct.includes('(-)') ? '(-)' : '(?)'}</span>
                      <span className="structure-formula">{struct}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedGrammar.contentMarkdown && (
              <div className="grammar-section">
                <div className="section-header">
                  <span className="section-icon">📖</span>
                  <h4>Definition</h4>
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
                  <h4>예문 (Examples)</h4>
                </div>
                <div className="examples-list">
                  {parseExamples(selectedGrammar.exampleUsage).map((example: IGrammarExample, idx: number) => (
                    <div key={idx} className="example-item">
                      <p className="example-english">&quot;{example.en}&quot;</p>
                      <p className="example-translation">{example.ko}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {grammars.length === 0 && (
          <div className="empty-state">
            <p>No grammar lessons added yet for this unit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitGrammar;
