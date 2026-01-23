/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Type definitions for third-party libraries
 * Note: 'any' is used here as these are external library type definitions
 */

// / <reference types="node" />
// / <reference types="webpack-env" />

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

// Fix for react-simplemde-editor type issues
declare module 'react-simplemde-editor' {
  import { Component } from 'react';

  export interface SimpleMDEEditorOptions {
    autofocus?: boolean;
    autosave?: {
      enabled?: boolean;
      delay?: number;
      uniqueId: string;
    };
    placeholder?: string;
    spellChecker?: boolean;
    status?: boolean | Array<string | { className: string; defaultValue: (el: HTMLElement) => void; onUpdate: (el: HTMLElement) => void }>;
    toolbar?: boolean | Array<string | { name: string; action: string | ((editor: any) => void); className: string; title: string }>;
    toolbarTips?: boolean;
    [key: string]: any;
  }

  export interface SimpleMDEReactProps {
    id?: string;
    value?: string;
    extraKeys?: Record<string, string | ((cm: any) => void)>;
    options?: SimpleMDEEditorOptions;
    events?: Record<string, (e: any) => void>;
    onChange?: (value: string) => void;
    className?: string;
    textareaProps?: Record<string, any>;
    getCodemirrorInstance?: () => any;
    getMdeInstance?: (instance: any) => void;
  }

  export default class SimpleMDEReact extends Component<SimpleMDEReactProps> {}
}

// Fix for pdfjs-dist types - use module augmentation instead of outdated @types
declare module 'pdfjs-dist' {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    fingerprints?: string[];
  }

  export interface PDFPageProxy {
    pageNumber: number;
    rotate: number;
    view: number[];
    getTextContent(params?: { normalizeWhitespace?: boolean; disableCombineTextItems?: boolean }): Promise<TextContent>;
    getViewport(params: { scale: number; rotation?: number }): PageViewport;
  }

  export interface PageViewport {
    width: number;
    height: number;
    scale: number;
    rotation: number;
    transform: number[];
  }

  export interface TextContent {
    items: Array<TextItem | TextMarkedContent>;
    styles: Record<string, any>;
  }

  export interface TextItem {
    str: string;
    dir: string;
    width: number;
    height: number;
    transform: number[];
    fontName: string;
    hasEOL?: boolean;
  }

  export interface TextMarkedContent {
    type: 'beginMarkedContent' | 'beginMarkedContentProps' | 'endMarkedContent';
    id?: string;
  }

  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export const version: string;

  export function getDocument(src: { data: Uint8Array | ArrayBuffer } | string | URL): PDFDocumentLoadingTask;

  export interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
    onPassword?: (callback: (updatePassword: (password: string) => void, reason: number) => void) => void;
    onProgress?: (progressData: { loaded: number; total: number }) => void;
    destroy(): void;
  }
}
