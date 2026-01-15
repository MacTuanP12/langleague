import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { IUnit } from 'app/shared/model/unit.model';
import { ProgressBar } from 'app/shared/components/progress';
import { UnitContentCard } from './UnitContentCard';
import '../book-learn.scss';

interface BookLearnContentProps {
  selectedUnit: IUnit | null;
}

export const BookLearnContent: React.FC<BookLearnContentProps> = ({ selectedUnit }) => {
  if (!selectedUnit) {
    return (
      <div className="learn-main">
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>Ready to learn?</h3>
          <p>Select a unit from the sidebar to start learning.</p>
          <p>Your progress will be saved automatically.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="learn-main">
      <div className="unit-content">
        <div className="unit-header-info">
          <h2>{selectedUnit.title}</h2>
          <p className="unit-summary">{selectedUnit.summary}</p>
        </div>

        <div className="content-sections">
          <UnitContentCard
            icon="bi-book"
            title="Vocabulary"
            titleKey="langleague.student.learning.vocabulary.title"
            description="Learn new words and their meanings"
            itemCount={translate('langleague.student.learning.itemCount.words', { count: selectedUnit.vocabularies?.length || 0 })}
            linkTo={`/student/learn/unit/${selectedUnit.id}/vocabulary`}
            variant="vocabulary"
          />

          <UnitContentCard
            icon="bi-journal-text"
            title="Grammar"
            titleKey="langleague.student.learning.grammar.title"
            description="Master grammar rules and structures"
            itemCount={translate('langleague.student.learning.itemCount.topics', { count: selectedUnit.grammars?.length || 0 })}
            linkTo={`/student/learn/unit/${selectedUnit.id}/grammar`}
            variant="grammar"
          />

          <UnitContentCard
            icon="bi-pencil-square"
            title="Exercise"
            titleKey="langleague.student.learning.exercise.title"
            description="Practice what you've learned"
            itemCount={translate('langleague.student.learning.itemCount.questions', { count: selectedUnit.exercises?.length || 0 })}
            linkTo={`/student/learn/unit/${selectedUnit.id}/exercise`}
            variant="exercise"
          />

          <UnitContentCard
            icon="bi-card-text"
            title="Flashcard"
            titleKey="langleague.student.learning.flashcard.title"
            description="Review vocabulary with flashcards"
            itemCount={translate('langleague.student.learning.itemCount.interactive')}
            linkTo={`/student/learn/unit/${selectedUnit.id}/flashcard`}
            variant="flashcard"
          />
        </div>

        <div className="unit-progress">
          <h4>
            <Translate contentKey="langleague.student.learning.bookLearn.progress">Your Progress</Translate>
          </h4>
          <ProgressBar progress={0} height="medium" color="gradient" ariaLabel="Unit progress" />
        </div>
      </div>
    </div>
  );
};
