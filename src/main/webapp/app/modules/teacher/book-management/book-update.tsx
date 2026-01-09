import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchBookById, createBook, updateBook } from 'app/shared/reducers/book.reducer';
import { IBook, defaultBookValue } from 'app/shared/model/book.model';
import TeacherLayout from 'app/modules/teacher/layout/teacher-layout';
import './book-update.scss';
import {translate, Translate} from "react-jhipster";

export const BookUpdate = () => {
  const dispatch = useAppDispatch();
  const { selectedBook, updating } = useAppSelector(state => state.book);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IBook>({
    defaultValues: defaultBookValue,
    mode: 'onBlur',
  });

  const [coverPreview, setCoverPreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedBook && id) {
      setValue('id', selectedBook.id);
      setValue('title', selectedBook.title);
      setValue('description', selectedBook.description);
      setValue('coverImageUrl', selectedBook.coverImageUrl);
      setValue('isPublic', selectedBook.isPublic);
      setValue('uploadedBy', selectedBook.uploadedBy);
      setCoverPreview(selectedBook.coverImageUrl || '');
    }
  }, [selectedBook, id, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setCoverPreview(imageUrl);
        setValue('coverImageUrl', imageUrl, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setCoverPreview(imageUrl);
        setValue('coverImageUrl', imageUrl, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData: IBook) => {
    try {
      if (id) {
        await dispatch(updateBook(formData));
      } else {
        await dispatch(createBook(formData));
      }
      navigate('/teacher/books');
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <TeacherLayout>
      <div className="book-update">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{id ? 'Edit Book' : 'Add New Book'}</h3>
              <p>Enter the details below to {id ? 'update the' : 'catalog a new'} resource.</p>
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
                    <Translate contentKey={updating ? 'langleague.teacher.books.form.footer.saving' : 'langleague.teacher.books.form.footer.save'}>
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
