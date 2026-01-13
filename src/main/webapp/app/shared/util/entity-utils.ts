import pick from 'lodash/pick';
import { IPaginationBaseState, ISortBaseState } from 'react-jhipster';

/**
 * Standard API Error Interface
 * Use this for type-safe error handling in catch blocks
 *
 * @example
 * try {
 *   await apiCall();
 * } catch (error) {
 *   const apiError = error as IApiError;
 *   const message = apiError.response?.data?.detail || apiError.message || 'Unknown error';
 * }
 */
export interface IApiError {
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      title?: string;
      detail?: string;
      message?: string;
      fieldErrors?: Record<string, string>;
      violations?: Array<{
        field: string;
        message: string;
      }>;
    };
  };
  message?: string;
  code?: string;
  config?: unknown;
}

/**
 * Helper function to extract error message from API error
 * @param error - The error object from API call
 * @returns Human-readable error message
 */
export const getErrorMessage = (error: IApiError): string => {
  return (
    error.response?.data?.detail ||
    error.response?.data?.message ||
    error.response?.data?.title ||
    error.message ||
    'An unknown error occurred'
  );
};

/**
 * Helper function to extract field errors from API error
 * @param error - The error object from API call
 * @returns Record of field names to error messages
 */
export const getFieldErrors = (error: IApiError): Record<string, string> => {
  return error.response?.data?.fieldErrors || {};
};

/**
 * Removes fields with an 'id' field that equals ''.
 * This function was created to prevent entities to be sent to
 * the server with an empty id and thus resulting in a 500.
 *
 * @param entity Object to clean.
 */
export const cleanEntity = entity => {
  const keysToKeep = Object.keys(entity).filter(k => !(entity[k] instanceof Object) || (entity[k].id !== '' && entity[k].id !== -1));

  return pick(entity, keysToKeep);
};

/**
 * Simply map a list of element to a list a object with the element as id.
 *
 * @param idList Elements to map.
 * @returns The list of objects with mapped ids.
 */
export const mapIdList = (idList: ReadonlyArray<string | number>) => idList?.filter(id => id !== '').map(id => ({ id }));

export const overrideSortStateWithQueryParams = (paginationBaseState: ISortBaseState, locationSearch: string) => {
  const params = new URLSearchParams(locationSearch);
  const sort = params.get('sort');
  if (sort) {
    const sortSplit = sort.split(',');
    paginationBaseState.sort = sortSplit[0];
    paginationBaseState.order = sortSplit[1];
  }
  return paginationBaseState;
};

export const overridePaginationStateWithQueryParams = (paginationBaseState: IPaginationBaseState, locationSearch: string) => {
  const sortedPaginationState: IPaginationBaseState = <IPaginationBaseState>(
    overrideSortStateWithQueryParams(paginationBaseState, locationSearch)
  );
  const params = new URLSearchParams(locationSearch);
  const page = params.get('page');
  if (page) {
    sortedPaginationState.activePage = +page;
  }
  return sortedPaginationState;
};
