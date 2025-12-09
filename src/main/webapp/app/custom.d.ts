/* Asset module declarations so TypeScript can import images */
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.css';

/* Global variables from webpack DefinePlugin */
declare const SERVER_API_URL: string;
declare const DEVELOPMENT: boolean;
declare const VERSION: string;
