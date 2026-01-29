import React, { useState, useRef, useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle,
  faChevronUp,
  faChevronDown,
  faBook,
  faBookOpen,
  faQuestionCircle,
  faChevronRight,
  faCircle,
  faCheckSquare,
  faPen,
  faRobot,
  faMagic,
} from '@fortawesome/free-solid-svg-icons';
import './AddContentMenu.scss';

export type AiImportContentType = 'EXERCISE' | 'VOCABULARY' | 'GRAMMAR';

interface AddContentMenuProps {
  onAddVocabulary?: () => void;
  onAddGrammar?: () => void;
  onAddExercise?: (type: string) => void;
  onAIImport?: (type: AiImportContentType) => void;
  showExerciseTypes?: boolean;
}

export const AddContentMenu: React.FC<AddContentMenuProps> = ({
  onAddVocabulary,
  onAddGrammar,
  onAddExercise,
  onAIImport,
  showExerciseTypes = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExerciseSubmenu, setShowExerciseSubmenu] = useState(false);
  const [showAISubmenu, setShowAISubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowExerciseSubmenu(false);
        setShowAISubmenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowExerciseSubmenu(false);
      setShowAISubmenu(false);
    }
  };

  const handleAddVocabulary = () => {
    onAddVocabulary?.();
    setIsOpen(false);
  };

  const handleAddGrammar = () => {
    onAddGrammar?.();
    setIsOpen(false);
  };

  const handleAddExercise = (type: string) => {
    onAddExercise?.(type);
    setIsOpen(false);
    setShowExerciseSubmenu(false);
  };

  const handleAIImport = (type: AiImportContentType) => {
    onAIImport?.(type);
    setIsOpen(false);
    setShowAISubmenu(false);
  };

  return (
    <div className="add-content-menu" ref={menuRef}>
      <button className="add-content-btn" onClick={handleToggle} type="button">
        <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
        <Translate contentKey="langleague.teacher.units.menu.addContent">Add Content</Translate>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="ms-2" />
      </button>

      {isOpen && (
        <div className="content-menu-dropdown">
          {onAddVocabulary && (
            <button className="menu-item" onClick={handleAddVocabulary} type="button">
              <div className="menu-item-icon vocabulary">
                <FontAwesomeIcon icon={faBook} />
              </div>
              <div className="menu-item-content">
                <div className="menu-item-title">
                  <Translate contentKey="langleague.teacher.units.menu.vocabulary">Vocabulary</Translate>
                </div>
                <div className="menu-item-description">
                  <Translate contentKey="langleague.teacher.units.menu.vocabularyDesc">Add words with meanings and examples</Translate>
                </div>
              </div>
            </button>
          )}

          {onAddGrammar && (
            <button className="menu-item" onClick={handleAddGrammar} type="button">
              <div className="menu-item-icon grammar">
                <FontAwesomeIcon icon={faBookOpen} />
              </div>
              <div className="menu-item-content">
                <div className="menu-item-title">
                  <Translate contentKey="langleague.teacher.units.menu.grammar">Grammar</Translate>
                </div>
                <div className="menu-item-description">
                  <Translate contentKey="langleague.teacher.units.menu.grammarDesc">Add grammar rules and explanations</Translate>
                </div>
              </div>
            </button>
          )}

          {onAddExercise && (
            <div className="menu-item-wrapper">
              <button
                className={`menu-item ${showExerciseSubmenu ? 'active' : ''}`}
                onClick={() => (showExerciseTypes ? setShowExerciseSubmenu(!showExerciseSubmenu) : handleAddExercise('SINGLE_CHOICE'))}
                type="button"
              >
                <div className="menu-item-icon exercise">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-title">
                    <Translate contentKey="langleague.teacher.units.menu.exercise">Exercise</Translate>
                  </div>
                  <div className="menu-item-description">
                    <Translate contentKey="langleague.teacher.units.menu.exerciseDesc">Create practice questions</Translate>
                  </div>
                </div>
                {showExerciseTypes && <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />}
              </button>

              {showExerciseTypes && showExerciseSubmenu && (
                <div className="submenu-dropdown">
                  <button className="submenu-item" onClick={() => handleAddExercise('SINGLE_CHOICE')} type="button">
                    <FontAwesomeIcon icon={faCircle} className="me-2" />
                    <Translate contentKey="langleague.teacher.units.menu.singleChoice">Single Choice</Translate>
                  </button>
                  <button className="submenu-item" onClick={() => handleAddExercise('MULTI_CHOICE')} type="button">
                    <FontAwesomeIcon icon={faCheckSquare} className="me-2" />
                    <Translate contentKey="langleague.teacher.units.menu.multiChoice">Multiple Choice</Translate>
                  </button>
                  <button className="submenu-item" onClick={() => handleAddExercise('FILL_IN_BLANK')} type="button">
                    <FontAwesomeIcon icon={faPen} className="me-2" />
                    <Translate contentKey="langleague.teacher.units.menu.fillInBlank">Fill in the Blank</Translate>
                  </button>
                </div>
              )}
            </div>
          )}

          {onAIImport && (
            <>
              <div className="menu-divider"></div>
              <div className="menu-item-wrapper">
                <button
                  className={`menu-item ${showAISubmenu ? 'active' : ''}`}
                  onClick={() => setShowAISubmenu(!showAISubmenu)}
                  type="button"
                >
                  <div className="menu-item-icon ai-import" style={{ backgroundColor: '#e3f2fd', color: '#0d47a1' }}>
                    <FontAwesomeIcon icon={faRobot} />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-title">AI Import Assistant</div>
                    <div className="menu-item-description">Generate content from text/files</div>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                </button>

                {showAISubmenu && (
                  <div className="submenu-dropdown">
                    <button className="submenu-item" onClick={() => handleAIImport('VOCABULARY')} type="button">
                      <FontAwesomeIcon icon={faBook} className="me-2" />
                      Vocabulary
                    </button>
                    <button className="submenu-item" onClick={() => handleAIImport('GRAMMAR')} type="button">
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      Grammar
                    </button>
                    <button className="submenu-item" onClick={() => handleAIImport('EXERCISE')} type="button">
                      <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                      Exercises
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AddContentMenu;
