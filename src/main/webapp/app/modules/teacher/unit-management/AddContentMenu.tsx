import React, { useState, useRef, useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AddContentMenu.scss';

interface AddContentMenuProps {
  onAddVocabulary?: () => void;
  onAddGrammar?: () => void;
  onAddExercise?: (type: string) => void;
  showExerciseTypes?: boolean;
}

export const AddContentMenu: React.FC<AddContentMenuProps> = ({
  onAddVocabulary,
  onAddGrammar,
  onAddExercise,
  showExerciseTypes = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExerciseSubmenu, setShowExerciseSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowExerciseSubmenu(false);
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

  return (
    <div className="add-content-menu" ref={menuRef}>
      <button className="add-content-btn" onClick={handleToggle} type="button">
        <FontAwesomeIcon icon="plus-circle" className="me-2" />
        <Translate contentKey="langleague.teacher.units.menu.addContent">Add Content</Translate>
        <FontAwesomeIcon icon={isOpen ? 'chevron-up' : 'chevron-down'} className="ms-2" />
      </button>

      {isOpen && (
        <div className="content-menu-dropdown">
          {onAddVocabulary && (
            <button className="menu-item" onClick={handleAddVocabulary} type="button">
              <div className="menu-item-icon vocabulary">
                <FontAwesomeIcon icon="book" />
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
                <FontAwesomeIcon icon="book-open" />
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
                  <FontAwesomeIcon icon="question-circle" />
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-title">
                    <Translate contentKey="langleague.teacher.units.menu.exercise">Exercise</Translate>
                  </div>
                  <div className="menu-item-description">
                    <Translate contentKey="langleague.teacher.units.menu.exerciseDesc">Create practice questions</Translate>
                  </div>
                </div>
                {showExerciseTypes && <FontAwesomeIcon icon="chevron-right" className="submenu-arrow" />}
              </button>

              {showExerciseTypes && showExerciseSubmenu && (
                <div className="submenu-dropdown">
                  <button className="submenu-item" onClick={() => handleAddExercise('SINGLE_CHOICE')} type="button">
                    <FontAwesomeIcon icon="circle" className="me-2" />
                    <Translate contentKey="langleague.teacher.units.menu.singleChoice">Single Choice</Translate>
                  </button>
                  <button className="submenu-item" onClick={() => handleAddExercise('MULTI_CHOICE')} type="button">
                    <FontAwesomeIcon icon="check-square" className="me-2" />
                    <Translate contentKey="langleague.teacher.units.menu.multiChoice">Multiple Choice</Translate>
                  </button>
                  <button className="submenu-item" onClick={() => handleAddExercise('FILL_IN_BLANK')} type="button">
                    <FontAwesomeIcon icon="pen" className="me-2" />
                    <Translate contentKey="langleague.teacher.units.menu.fillInBlank">Fill in the Blank</Translate>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddContentMenu;
