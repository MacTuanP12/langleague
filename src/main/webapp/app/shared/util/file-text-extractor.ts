import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { createWorker } from 'tesseract.js';

// Import types from pdfjs-dist (defined in typings.d.ts)
type TextItem = {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL?: boolean;
};

type TextMarkedContent = {
  type: 'beginMarkedContent' | 'beginMarkedContentProps' | 'endMarkedContent';
  id?: string;
};

// Type guard to check if item is TextItem
function isTextItem(item: TextItem | TextMarkedContent): item is TextItem {
  return 'str' in item;
}

// Configure PDF.js worker
// Using CDN for the worker file - this is the recommended approach for Webpack environments
// FIX: Use protocol-relative URL to avoid mixed content issues and ensure correct version matching
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract text content from PDF files
 * @param file - PDF file to extract text from
 * @returns Promise resolving to extracted text content
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);

    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    let fullText = '';

    // Iterate through all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Extract text items and join them
      const pageText = textContent.items
        .map(item => {
          // Use type guard to check if item is TextItem
          return isTextItem(item) ? item.str : '';
        })
        .join(' ');

      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text content from DOCX files
 * @param file - DOCX file to extract text from
 * @returns Promise resolving to extracted text content
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Use mammoth to extract raw text
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages.length > 0) {
      console.warn('Mammoth conversion warnings:', result.messages);
    }

    return result.value;
  } catch (error) {
    throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text content from Excel files
 * @param file - XLSX file to extract text from
 * @returns Promise resolving to extracted text content (CSV format)
 */
async function extractTextFromXLSX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Read workbook
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error('No sheets found in the Excel file');
    }

    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to CSV format for text extraction
    return XLSX.utils.sheet_to_csv(worksheet);
  } catch (error) {
    throw new Error(`Failed to extract text from XLSX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text content from plain text files
 * @param file - Text file to extract text from
 * @returns Promise resolving to extracted text content
 */
async function extractTextFromTXT(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        resolve(text);
      } else {
        reject(new Error('Failed to read text file: Result is not a string'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read text file: FileReader error'));
    };

    reader.readAsText(file);
  });
}

/**
 * Get file extension from filename
 * @param filename - Name of the file
 * @returns File extension in lowercase
 */
function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Extract text from various file types
 * Supports: PDF (.pdf), Word (.docx), Excel (.xlsx), and plain text (.txt)
 *
 * @param file - File to extract text from
 * @returns Promise resolving to extracted text content
 * @throws Error if file format is not supported or extraction fails
 *
 * @example
 * ```typescript
 * const file = event.target.files[0];
 * try {
 *   const text = await extractTextFromFile(file);
 *   console.log('Extracted text:', text);
 * } catch (error) {
 *   console.error('Extraction failed:', error);
 * }
 * ```
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error('No file provided');
  }

  const extension = getFileExtension(file.name);

  switch (extension) {
    case 'pdf':
      return extractTextFromPDF(file);

    case 'docx':
      return extractTextFromDOCX(file);

    case 'xlsx':
    case 'xls':
      return extractTextFromXLSX(file);

    case 'txt':
    case 'text':
      return extractTextFromTXT(file);

    default:
      throw new Error(`Unsupported file format: .${extension}. Supported formats are: .pdf, .docx, .xlsx, .xls, .txt`);
  }
};

/**
 * Check if a file type is supported for text extraction
 * @param filename - Name of the file to check
 * @returns True if the file type is supported
 */
export const isFileTypeSupported = (filename: string): boolean => {
  const extension = getFileExtension(filename);
  return ['pdf', 'docx', 'xlsx', 'xls', 'txt', 'text'].includes(extension);
};

/**
 * Get list of supported file extensions
 * @returns Array of supported file extensions
 */
export const getSupportedExtensions = (): string[] => {
  return ['.pdf', '.docx', '.xlsx', '.xls', '.txt'];
};

/**
 * Extract text from image files using OCR (Tesseract.js)
 * @param file - Image file to extract text from
 * @param lang - Language code for OCR (default: 'eng+vie' for English and Vietnamese)
 * @returns Promise resolving to extracted text content
 */
export const extractTextFromImage = async (file: File, lang: string = 'eng+vie'): Promise<string> => {
  try {
    const worker = await createWorker(lang, 1, {
      logger(m) {
        // Log OCR progress for debugging (disabled to comply with no-console rule)
        // Use console.warn if needed for important debugging
      },
    });

    const {
      data: { text },
    } = await worker.recognize(file);
    await worker.terminate();

    return text.trim();
  } catch (error) {
    throw new Error(`Failed to extract text from image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Check if a file is an image
 * @param filename - Name of the file to check
 * @returns True if the file is an image
 */
export const isImageFile = (filename: string): boolean => {
  const extension = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp'].includes(extension);
};

/**
 * Get accept attribute value for file input
 * @returns String value for HTML input accept attribute
 */
export const getAcceptAttribute = (): string => {
  return '.pdf,.docx,.xlsx,.xls,.txt';
};

/**
 * Get accept attribute value for file input including images
 * @returns String value for HTML input accept attribute with image formats
 */
export const getAcceptAttributeWithImages = (): string => {
  return '.pdf,.docx,.xlsx,.xls,.txt,.jpg,.jpeg,.png,.bmp,.gif,.tiff,.webp';
};
