import { AxiosError } from 'axios';

export const serializeAxiosError = (error: AxiosError): any => {
  return {
    message: error.message,
    name: error.name,
    code: error.code,
    status: error.response?.status,
    data: error.response?.data,
  };
};
