import userProfile from 'app/entities/user-profile/user-profile.reducer';
import book from 'app/entities/book/book.reducer';
import enrollment from 'app/entities/enrollment/enrollment.reducer';
import unit from 'app/entities/unit/unit.reducer';
import vocabulary from 'app/entities/vocabulary/vocabulary.reducer';
import grammar from 'app/entities/grammar/grammar.reducer';
import exercise from 'app/entities/exercise/exercise.reducer';
import exerciseOption from 'app/entities/exercise-option/exercise-option.reducer';
import progress from 'app/entities/progress/progress.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  userProfile,
  book,
  enrollment,
  unit,
  vocabulary,
  grammar,
  exercise,
  exerciseOption,
  progress,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
