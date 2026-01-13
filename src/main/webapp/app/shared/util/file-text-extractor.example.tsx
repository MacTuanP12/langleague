import React from 'react';
import { extractTextFromFile, isFileTypeSupported, getSupportedExtensions, getAcceptAttribute } from './file-text-extractor';

/**
 * Example usage of file-text-extractor utility
 */

// Example 1: Basic usage in a file input handler
export const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (!file) {
    console.error('No file selected');
    return;
  }

  // Check if file type is supported
  if (!isFileTypeSupported(file.name)) {
    console.error(`Unsupported file type: ${file.name}`);
    alert(`Unsupported file type. Please upload one of: ${getSupportedExtensions().join(', ')}`);
    return;
  }

  try {
    // Extract text from the file
    const extractedText = await extractTextFromFile(file);
    // Log for debugging during development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Extracted text:', extractedText);
    }

    // Do something with the extracted text
    // e.g., send to backend, display in UI, etc.
  } catch (error) {
    console.error('Failed to extract text:', error);
    alert(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Example 2: File input component with proper accept attribute
export const FileUploadComponent = () => {
  return (
    <div>
      <label htmlFor="file-upload">Upload a document:</label>
      <input id="file-upload" type="file" accept={getAcceptAttribute()} onChange={handleFileUpload} />
      <p>Supported formats: {getSupportedExtensions().join(', ')}</p>
    </div>
  );
};

// Example 3: Using with async/await in a function
export const processDocument = async (file: File): Promise<string | null> => {
  try {
    const text = await extractTextFromFile(file);

    // Process the extracted text
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    // Document word count: wordCount (can be logged in development mode if needed)

    return text;
  } catch (error) {
    console.error('Error processing document:', error);
    return null;
  }
};

// Example 4: Batch processing multiple files
export const processMultipleFiles = async (files: FileList): Promise<Map<string, string>> => {
  const results = new Map<string, string>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!isFileTypeSupported(file.name)) {
      console.warn(`Skipping unsupported file: ${file.name}`);
      continue;
    }

    try {
      const text = await extractTextFromFile(file);
      results.set(file.name, text);
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
    }
  }

  return results;
};
