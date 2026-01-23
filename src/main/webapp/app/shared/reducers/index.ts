import { ReducersMapObject } from '@reduxjs/toolkit';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import userManagement from 'app/modules/admin/user-management/user-management.reducer';
import register from 'app/modules/account/register/register.reducer';
import activate from 'app/modules/account/activate/activate.reducer';
import password from 'app/modules/account/password/password.reducer';
import settings from 'app/modules/account/settings/settings.reducer';
import passwordReset from 'app/modules/account/password-reset/password-reset.reducer';
import applicationProfile from './application-profile';
import authentication from './authentication';
import locale from './locale';
import book from 'app/entities/book/book.reducer';
import unit from './unit.reducer';
import vocabulary from './vocabulary.reducer';
import grammar from './grammar.reducer';
import exercise from './exercise.reducer';
import enrollment from 'app/entities/enrollment/enrollment.reducer';
import userProfile from './user-profile.reducer';
import progress from './progress.reducer';
import exerciseOption from './exercise-option.reducer';
import teacher from './teacher.reducer';
import adminDashboard from 'app/modules/admin/dashboard/admin-dashboard.reducer';
import ai from './ai.reducer';
import note from './note.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const rootReducer: ReducersMapObject = {
  authentication,
  locale,
  applicationProfile,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  loadingBar,
  book,
  unit,
  vocabulary,
  grammar,
  exercise,
  enrollment,
  userProfile,
  progress,
  exerciseOption,
  teacher,
  adminDashboard,
  ai,
  note,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default rootReducer;
