import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { ASC } from 'app/shared/util/pagination.constants';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IProgress, defaultValue } from 'app/shared/model/progress.model';

const initialState: EntityState<IProgress> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

const apiUrl = 'api/progresses';

// Actions

/**
 * Get all progresses for the current user (secure endpoint)
 * This should be used by normal users to fetch their own progresses
 */
export const getMyProgresses = createAsyncThunk(
  'progress/fetch_my_progresses',
  async () => {
    const requestUrl = `${apiUrl}/my-progresses`;
    return axios.get<IProgress[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

/**
 * Mark a unit as completed for the current user
 * This creates or updates the progress record and sets isCompleted to true
 */
export const completeUnit = createAsyncThunk(
  'progress/complete_unit',
  async (unitId: number) => {
    const requestUrl = `${apiUrl}/complete-unit/${unitId}`;
    return axios.post<IProgress>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

/**
 * @deprecated For normal users, use getMyProgresses() instead
 * This endpoint fetches ALL progresses and should only be used by admins
 */
export const getEntities = createAsyncThunk(
  'progress/fetch_entity_list',
  async ({ sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}?${sort ? `sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<IProgress[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'progress/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IProgress>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'progress/create_entity',
  async (entity: IProgress, thunkAPI) => {
    const result = await axios.post<IProgress>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'progress/update_entity',
  async (entity: IProgress, thunkAPI) => {
    const result = await axios.put<IProgress>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'progress/partial_update_entity',
  async (entity: IProgress, thunkAPI) => {
    const result = await axios.patch<IProgress>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'progress/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IProgress>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const ProgressSlice = createEntitySlice({
  name: 'progress',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addCase(completeUnit.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        // Update the specific progress in entities array
        const index = state.entities.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.entities[index] = action.payload.data;
        } else {
          state.entities.push(action.payload.data);
        }
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(getEntities, getMyProgresses), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data.sort((a, b) => {
            const sortParam = action.meta?.arg && 'sort' in action.meta.arg ? action.meta.arg.sort : null;
            if (!sortParam) {
              return 1;
            }
            const order = sortParam.split(',')[1];
            const predicate = sortParam.split(',')[0];
            return order === ASC ? (a[predicate] < b[predicate] ? -1 : 1) : b[predicate] < a[predicate] ? -1 : 1;
          }),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity, getMyProgresses), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity, completeUnit), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = ProgressSlice.actions;

// Reducer
export default ProgressSlice.reducer;
