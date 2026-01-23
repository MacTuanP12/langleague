import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { ASC } from 'app/shared/util/pagination.constants';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IEnrollment, defaultValue } from 'app/shared/model/enrollment.model';

const initialState: EntityState<IEnrollment> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
};

const apiUrl = 'api/enrollments';

// Actions

export const getEntities = createAsyncThunk(
  'enrollment/fetch_entity_list',
  async ({ sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}?${sort ? `sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<IEnrollment[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const fetchMyEnrollments = createAsyncThunk(
  'enrollment/fetch_my_enrollments',
  async () => {
    const requestUrl = `${apiUrl}?filter=my-books&cacheBuster=${new Date().getTime()}`;
    return axios.get<IEnrollment[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const fetchEnrollmentByBookId = createAsyncThunk(
  'enrollment/fetch_enrollment_by_book_id',
  async (bookId: number | string) => {
    const requestUrl = `${apiUrl}/book/${bookId}`;
    return axios.get<IEnrollment>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const enrollInBook = createAsyncThunk(
  'enrollment/enroll_in_book',
  async (bookId: number) => {
    const requestUrl = `${apiUrl}/enroll/${bookId}`;
    return axios.post<IEnrollment>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const countAllEnrollments = createAsyncThunk(
  'enrollment/count_all',
  async () => {
    const requestUrl = `${apiUrl}/count`;
    return axios.get<number>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'enrollment/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IEnrollment>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'enrollment/create_entity',
  async (entity: IEnrollment, thunkAPI) => {
    const result = await axios.post<IEnrollment>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'enrollment/update_entity',
  async (entity: IEnrollment, thunkAPI) => {
    const result = await axios.put<IEnrollment>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'enrollment/partial_update_entity',
  async (entity: IEnrollment, thunkAPI) => {
    const result = await axios.patch<IEnrollment>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'enrollment/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IEnrollment>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const EnrollmentSlice = createEntitySlice({
  name: 'enrollment',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(fetchEnrollmentByBookId.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(countAllEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.totalItems = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities, fetchMyEnrollments), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data.sort((a, b) => {
            const arg = action.meta.arg as IQueryParams | undefined;
            if (!arg?.sort) {
              return 1;
            }
            const order = arg.sort.split(',')[1];
            const predicate = arg.sort.split(',')[0];
            return order === ASC ? (a[predicate] < b[predicate] ? -1 : 1) : b[predicate] < a[predicate] ? -1 : 1;
          }),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity, enrollInBook), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity, countAllEnrollments, fetchMyEnrollments, fetchEnrollmentByBookId), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity, enrollInBook), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = EnrollmentSlice.actions;

// Reducer
export default EnrollmentSlice.reducer;
