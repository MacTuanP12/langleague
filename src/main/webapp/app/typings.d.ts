// CSS Module Type Definitions
declare module '*.module.css' {
  const styles: { readonly [key: string]: string };
  export default styles;
}

declare module '*.module.scss' {
  const styles: { readonly [key: string]: string };
  export default styles;
}

declare module '*.module.sass' {
  const styles: { readonly [key: string]: string };
  export default styles;
}

// Regular CSS/SCSS imports (global styles)
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
