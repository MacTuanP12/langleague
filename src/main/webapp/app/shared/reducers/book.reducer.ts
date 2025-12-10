import { createAsyncThunk, createSlice, isFulfilled, isPending } from '@reduxjs/toolkit';
import { IBook, defaultValue } from 'src/main/webapp/app/shared/model/book.model';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'src/main/webapp/app/shared/reducers/reducer.utils';
import { getEntities, getEntity, createEntity, updateEntity, partialUpdateEntity, deleteEntity } from './book.service';

const initialState: EntityState<IBook> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: {
    next: 0,
  },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const-api-url = 'api/books';

export const BookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
  },
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
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = BookSlice.actions;

// Reducer
export default BookSlice.reducer;
