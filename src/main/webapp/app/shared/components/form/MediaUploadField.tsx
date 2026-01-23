import React, { useState, useRef } from 'react';
import { FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMusic, faUpload, faTrash, faLink } from '@fortawesome/free-solid-svg-icons';
import { translate } from 'react-jhipster';
import axios from 'axios';
import { toast } from 'react-toastify';
import { processImageUrl } from 'app/shared/util/image-utils';

interface MediaUploadFieldProps {
  type: 'image' | 'audio';
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MediaUploadField: React.FC<MediaUploadFieldProps> = ({ type, label, value, onChange, placeholder, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the existing utility for both image and audio (Google Drive logic works for both)
  const processedUrl = value ? processImageUrl(value) : '';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (type === 'image' && !file.type.startsWith('image/')) {
      toast.error(translate('settings.messages.invalidImageType'));
      return;
    }
    if (type === 'audio' && !file.type.startsWith('audio/')) {
      toast.error(translate('media.invalidAudioType'));
      return;
    }

    // Validate size (max 10MB for audio, 5MB for image)
    const maxSize = type === 'audio' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(translate('settings.messages.imageTooLarge')); // Reusing existing key or add new one
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      // Determine endpoint based on type if needed, but currently backend uses generic /api/upload/image
      // Ideally backend should have /api/upload/file or similar, but /image endpoint likely handles generic files via FileStorageService
      const response = await axios.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onChange(response.data.fileUrl);
      toast.success(translate(type === 'image' ? 'media.imageUploaded' : 'media.audioUploaded'));
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(translate('langleague.teacher.books.form.messages.uploadFailed'));
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <FormGroup className="media-upload-field">
      {label && <Label>{label}</Label>}

      <div className="d-flex flex-column gap-2">
        {/* Preview Section */}
        {processedUrl && (
          <div className="media-preview mb-2 p-2 border rounded bg-light position-relative">
            {type === 'image' ? (
              <div className="text-center">
                <img
                  src={processedUrl}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                  onError={e => {
                    (e.target as HTMLImageElement).src = 'content/images/logo-jhipster.png'; // Fallback
                  }}
                />
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center p-2">
                <audio controls src={processedUrl} style={{ width: '100%' }}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <Button
              color="danger"
              size="sm"
              className="position-absolute top-0 end-0 m-1 rounded-circle"
              style={{ width: '24px', height: '24px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={handleClear}
              title={translate('media.remove')}
              disabled={disabled}
            >
              <FontAwesomeIcon icon={faTrash} size="xs" />
            </Button>
          </div>
        )}

        {/* Input Section */}
        <div className="d-flex gap-2">
          <div className="flex-grow-1 position-relative">
            <FontAwesomeIcon icon={faLink} className="position-absolute text-muted" style={{ left: '10px', top: '10px' }} />
            <Input
              type="text"
              value={value || ''}
              onChange={handleUrlChange}
              placeholder={placeholder || translate(type === 'image' ? 'form.image.url.placeholder' : 'form.audio.url.placeholder')}
              disabled={disabled || uploading}
              style={{ paddingLeft: '30px' }}
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept={type === 'image' ? 'image/*' : 'audio/*'}
            onChange={handleFileChange}
          />

          <Button
            color="secondary"
            outline
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            title={translate('media.uploadFromComputer')}
            style={{ whiteSpace: 'nowrap' }}
          >
            {uploading ? (
              <Spinner size="sm" />
            ) : (
              <>
                <FontAwesomeIcon icon={faUpload} className="me-1" /> {translate('media.upload')}
              </>
            )}
          </Button>
        </div>

        <small className="text-muted fst-italic" style={{ fontSize: '0.75rem' }}>
          {translate(type === 'image' ? 'media.imageSupport' : 'media.audioSupport')}
        </small>
      </div>
    </FormGroup>
  );
};
