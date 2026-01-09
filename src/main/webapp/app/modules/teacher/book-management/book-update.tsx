import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IBook, defaultBookValue } from 'app/shared/model/book.model';
import TeacherLayout from 'app/modules/teacher/layout/teacher-layout';
import './book-update.scss';

export const BookUpdate = () => {
  const [book, setBook] = useState<IBook>(defaultBookValue);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data);
      setCoverPreview(response.data.coverImageUrl);
    } catch (error) {
      console.error('Error loading book:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
        setBook({ ...book, coverImageUrl: reader.result as string });
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
        setCoverPreview(reader.result as string);
        setBook({ ...book, coverImageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/api/books/${id}`, book);
      } else {
        await axios.post('/api/books', book);
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

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group cover-upload">
                  <label>Book Cover</label>
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
                        <p>Upload Cover</p>
                        <span>Drag and drop or click</span>
                        <span className="file-info">Supports: JPG, PNG (max. 2MB)</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Book Title</label>
                  <input
                    type="text"
                    placeholder="e.g. The Great Gatsby"
                    value={book.title}
                    onChange={e => setBook({ ...book, title: e.target.value })}
                    required
                  />

                  <label>Description</label>
                  <textarea
                    placeholder="Enter a brief summary of the book content..."
                    value={book.description}
                    onChange={e => setBook({ ...book, description: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-footer">
                <p className="info-text">All fields are auto-saved locally.</p>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => navigate('/teacher/books')}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Book
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
