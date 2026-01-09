// Type augmentation to fix known issues with third-party libraries

declare module 'react' {
  // Fix for antd@6.x type definition bug
  // antd incorrectly uses React.ActionDispatch which doesn't exist in @types/react
  // This provides the missing type to prevent TS2694 errors
  export type ActionDispatch<T extends unknown[]> = Dispatch<SetStateAction<T>>;
}

// Ensure this file is treated as a module
export {};
