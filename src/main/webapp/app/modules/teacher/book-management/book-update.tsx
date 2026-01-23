import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useBooks } from 'app/shared/reducers/hooks';
import { IBook, defaultBookValue } from 'app/shared/model/book.model';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import './book-update.scss';
import { translate, Translate } from 'react-jhipster';
import axios from 'axios';
import { toast } from 'react-toastify';
import { processImageUrl } from 'app/shared/util/image-utils';

export const BookUpdate = () => {
  const { selectedBook, loadBook, addBook, editBook } = useBooks();
  const [updating, setUpdating] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IBook>({
    defaultValues: defaultBookValue,
    mode: 'onBlur',
  });

  const coverImageUrl = watch('coverImageUrl');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadBook(Number(id));
    }
  }, [id, loadBook]);

  useEffect(() => {
    if (selectedBook && id) {
      setValue('id', selectedBook.id);
      setValue('title', selectedBook.title);
      setValue('description', selectedBook.description);
      setValue('coverImageUrl', selectedBook.coverImageUrl);
      setValue('isPublic', selectedBook.isPublic);
      setCoverPreview(selectedBook.coverImageUrl || '');
    }
  }, [selectedBook, id, setValue]);

  useEffect(() => {
    if (coverImageUrl) {
      setCoverPreview(processImageUrl(coverImageUrl));
    } else {
      setCoverPreview('');
    }
  }, [coverImageUrl]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = response.data.fileUrl;
      setValue('coverImageUrl', imageUrl, { shouldDirty: true });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(translate('langleague.teacher.books.form.messages.uploadFailed'));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file);
    }
  };

  const onSubmit = async (formData: IBook) => {
    try {
      setUpdating(true);
      // Ensure isPublic is always a boolean (required by backend validation)
      const bookData = {
        ...formData,
        coverImageUrl: processImageUrl(formData.coverImageUrl || ''),
        isPublic: formData.isPublic ?? false,
      };
      if (id) {
        await editBook(bookData);
      } else {
        await addBook(bookData);
      }
      navigate('/teacher/books');
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="book-update">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <Translate contentKey={id ? 'langleague.teacher.books.form.header.edit' : 'langleague.teacher.books.form.header.add'}>
                  {id ? 'Edit Book' : 'Add New Book'}
                </Translate>
              </h3>
              <p>
                <Translate
                  contentKey={
                    id ? 'langleague.teacher.books.form.header.descriptionEdit' : 'langleague.teacher.books.form.header.descriptionAdd'
                  }
                >
                  Enter the details below to {id ? 'update the' : 'catalog a new'} resource.
                </Translate>
              </p>
              <button className="close-btn" onClick={() => navigate('/teacher/books')}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row">
                <div className="form-group cover-upload">
                  <label>
                    <Translate contentKey="langleague.teacher.books.form.fields.coverLabel">Book Cover</Translate>
                  </label>
                  <div
                    className={`upload-area ${isDragging ? 'dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover preview" className="cover-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <i className="fa fa-upload"></i>
                        <p>
                          <Translate contentKey="langleague.teacher.books.form.fields.uploadPlaceholder">Upload Cover</Translate>
                        </p>
                        <span>
                          <Translate contentKey="langleague.teacher.books.form.fields.uploadHint">Drag and drop or click</Translate>
                        </span>
                        <span className="file-info">
                          <Translate contentKey="langleague.teacher.books.form.fields.fileInfo">Supports: JPG, PNG (max. 2MB)</Translate>
                        </span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                  </div>
                  <Controller
                    name="coverImageUrl"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder={translate('global.form.image.url.placeholder')}
                        className="url-input mt-2"
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    )}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Translate contentKey="langleague.teacher.books.form.fields.titleLabel">Book Title</Translate>
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    rules={{
                      required: translate('langleague.teacher.books.form.fields.titleRequired'),
                      minLength: { value: 2, message: translate('langleague.teacher.books.form.fields.titleMinLength') },
                    }}
                    render={({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="text"
                          placeholder={translate('langleague.teacher.books.form.fields.titlePlaceholder')}
                          className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <span className="error-text">{errors.title.message}</span>}
                      </div>
                    )}
                  />

                  <label>
                    <Translate contentKey="langleague.teacher.books.form.fields.descriptionLabel">Description</Translate>
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder={translate('langleague.teacher.books.form.fields.descriptionPlaceholder')}
                        rows={4}
                      />
                    )}
                  />

                  <div className="form-group-inline">
                    <label>
                      <Translate contentKey="langleague.teacher.books.form.fields.isPublicLabel">Make Public</Translate>
                    </label>
                    <Controller
                      name="isPublic"
                      control={control}
                      render={({ field }) => (
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            id="isPublic"
                            checked={field.value ?? false}
                            onChange={e => field.onChange(e.target.checked)}
                          />
                          <label htmlFor="isPublic" className="toggle-label">
                            <span className="toggle-slider"></span>
                          </label>
                          <span className="toggle-text">
                            {field.value ? (
                              <Translate contentKey="langleague.teacher.books.form.fields.publicStatus">Public</Translate>
                            ) : (
                              <Translate contentKey="langleague.teacher.books.form.fields.privateStatus">Private</Translate>
                            )}
                          </span>
                        </div>
                      )}
                    />
                    <p className="field-hint">
                      <Translate contentKey="langleague.teacher.books.form.fields.isPublicHint">
                        Public books can be discovered and enrolled by all students
                      </Translate>
                    </p>
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <p className="info-text">
                  <Translate contentKey="langleague.teacher.books.form.footer.infoText">All fields are auto-saved locally.</Translate>
                </p>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => navigate('/teacher/books')}>
                    <Translate contentKey="langleague.teacher.books.form.footer.cancel">Cancel</Translate>
                  </button>
                  <button type="submit" className="btn-primary" disabled={updating}>
                    <Translate
                      contentKey={updating ? 'langleague.teacher.books.form.footer.saving' : 'langleague.teacher.books.form.footer.save'}
                    >
                      {updating ? 'Saving...' : 'Save Book'}
                    </Translate>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default BookUpdate;
