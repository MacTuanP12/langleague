# File Text Extractor Utility

A comprehensive client-side utility for extracting text content from various file formats in React/TypeScript applications.

## Features

- 📄 **PDF Support** - Extract text from PDF documents using `pdfjs-dist`
- 📝 **Word Support** - Extract text from DOCX files using `mammoth`
- 📊 **Excel Support** - Extract text from XLSX/XLS files using `xlsx`
- 📃 **Plain Text Support** - Read TXT files using FileReader API
- ✅ **Type-Safe** - Full TypeScript support with proper type definitions
- 🛡️ **Error Handling** - Clear error messages for unsupported formats and parsing failures
- 🔍 **File Validation** - Helper functions to check supported file types

## Installation

The required dependencies are already included in the project:

```json
{
  "dependencies": {
    "pdfjs-dist": "^5.4.530",
    "mammoth": "^1.11.0",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@types/pdfjs-dist": "^2.10.377"
  }
}
```

## Usage

### Basic Usage

```typescript
import { extractTextFromFile } from 'app/shared/util';

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (!file) return;

  try {
    const text = await extractTextFromFile(file);
    console.log('Extracted text:', text);
  } catch (error) {
    console.error('Failed to extract text:', error);
  }
};
```

### With File Type Validation

```typescript
import { extractTextFromFile, isFileTypeSupported, getSupportedExtensions } from 'app/shared/util';

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (!file) return;

  // Check if file type is supported
  if (!isFileTypeSupported(file.name)) {
    alert(`Unsupported file type. Supported formats: ${getSupportedExtensions().join(', ')}`);
    return;
  }

  try {
    const text = await extractTextFromFile(file);
    // Process the extracted text
  } catch (error) {
    console.error('Extraction failed:', error);
  }
};
```

### File Input Component

```typescript
import { getAcceptAttribute, getSupportedExtensions } from 'app/shared/util';

const FileUploadComponent = () => {
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const text = await extractTextFromFile(file);
      // Handle extracted text
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={getAcceptAttribute()}
        onChange={handleChange}
      />
      <p>Supported: {getSupportedExtensions().join(', ')}</p>
    </div>
  );
};
```

### Batch Processing

```typescript
import { extractTextFromFile, isFileTypeSupported } from 'app/shared/util';

const processMultipleFiles = async (files: FileList) => {
  const results = new Map<string, string>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!isFileTypeSupported(file.name)) {
      console.warn(`Skipping: ${file.name}`);
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
```

## API Reference

### `extractTextFromFile(file: File): Promise<string>`

Main function to extract text from supported file formats.

**Parameters:**

- `file: File` - The file to extract text from

**Returns:**

- `Promise<string>` - Extracted text content

**Throws:**

- `Error` - If file format is not supported or extraction fails

**Supported Formats:**

- `.pdf` - PDF documents
- `.docx` - Microsoft Word documents
- `.xlsx`, `.xls` - Microsoft Excel spreadsheets
- `.txt` - Plain text files

### `isFileTypeSupported(filename: string): boolean`

Check if a file type is supported for text extraction.

**Parameters:**

- `filename: string` - Name of the file to check

**Returns:**

- `boolean` - True if the file type is supported

**Example:**

```typescript
if (isFileTypeSupported('document.pdf')) {
  // Process the file
}
```

### `getSupportedExtensions(): string[]`

Get list of supported file extensions.

**Returns:**

- `string[]` - Array of supported extensions (e.g., `['.pdf', '.docx', '.xlsx', '.xls', '.txt']`)

**Example:**

```typescript
const extensions = getSupportedExtensions();
console.log(`Supported formats: ${extensions.join(', ')}`);
```

### `getAcceptAttribute(): string`

Get the accept attribute value for HTML file input elements.

**Returns:**

- `string` - Comma-separated list of file extensions (e.g., `'.pdf,.docx,.xlsx,.xls,.txt'`)

**Example:**

```typescript
<input type="file" accept={getAcceptAttribute()} />
```

## Implementation Details

### PDF Extraction

- Uses `pdfjs-dist` library
- Configured with CDN worker: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`
- Iterates through all pages and concatenates text content
- Handles multi-page documents automatically

### Word (DOCX) Extraction

- Uses `mammoth` library
- Extracts raw text without formatting
- Logs warnings if conversion issues occur
- Supports modern DOCX format only (not legacy DOC)

### Excel Extraction

- Uses `xlsx` library
- Extracts text from the first sheet only
- Converts to CSV format for easy text representation
- Supports both XLSX and XLS formats

### Plain Text Extraction

- Uses native FileReader API
- Reads file as UTF-8 text
- Fast and memory-efficient

## Error Handling

All functions provide clear error messages:

```typescript
try {
  const text = await extractTextFromFile(file);
} catch (error) {
  if (error instanceof Error) {
    // Possible error messages:
    // - "No file provided"
    // - "Unsupported file format: .xyz. Supported formats are: .pdf, .docx, .xlsx, .xls, .txt"
    // - "Failed to extract text from PDF: <specific error>"
    // - "Failed to extract text from DOCX: <specific error>"
    // - "Failed to extract text from XLSX: <specific error>"
    // - "Failed to read text file: <specific error>"
    console.error(error.message);
  }
}
```

## Configuration

### PDF.js Worker Configuration

The utility is pre-configured to use a CDN for the PDF.js worker:

```typescript
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

**Alternative: Local Worker**

If you prefer to use a local worker file:

1. Copy `pdf.worker.min.js` to your public directory
2. Update the worker source:

```typescript
// In file-text-extractor.ts
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
```

3. Copy the worker file during build:

```javascript
// In webpack config
new CopyWebpackPlugin({
  patterns: [
    {
      from: 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
      to: 'pdf.worker.min.js',
    },
  ],
});
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **File API**: Required (supported by all modern browsers)
- **ArrayBuffer**: Required (supported by all modern browsers)
- **Async/Await**: Required (or transpile with Babel)

## Performance Considerations

- **Large PDF Files**: Processing time increases with page count and file size
- **Memory Usage**: Large files are loaded into memory completely
- **Async Operations**: All extraction operations are asynchronous and non-blocking
- **Worker Threads**: PDF.js uses web workers for better performance

## Troubleshooting

### PDF.js Worker Error

**Error:** "Setting up fake worker failed"

**Solution:** Ensure the worker source is correctly configured. Try using the CDN version:

```typescript
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.530/pdf.worker.min.js`;
```

### CORS Issues

**Error:** "Failed to load PDF: CORS policy"

**Solution:** Ensure PDF files are served from the same origin or with proper CORS headers.

### Large File Issues

**Error:** Out of memory or browser freeze

**Solution:**

- Implement file size limits
- Show loading indicators for large files
- Consider server-side processing for very large files

## Examples

See `file-text-extractor.example.tsx` for complete working examples including:

- Basic file upload handler
- File input component
- Document processing with statistics
- Batch file processing

## Testing

To test the utility:

1. Create a test component with file input
2. Upload different file types
3. Check console for extracted text
4. Verify error handling with unsupported formats

```typescript
// Simple test component
const TestComponent = () => {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await extractTextFromFile(file);
        console.log('Success:', text.substring(0, 100) + '...');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return <input type="file" onChange={handleFile} />;
};
```

## License

This utility is part of the Langleague project and follows the project's licensing terms.
