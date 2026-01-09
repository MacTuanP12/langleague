import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';
import { IUnit } from 'app/shared/model/unit.model';
import TeacherLayout from 'app/modules/teacher/layout/teacher-layout';
import './book-detail.scss';

export const BookDetail = () => {
  const [book, setBook] = useState<IBook | null>(null);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [draggedUnitIndex, setDraggedUnitIndex] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadBook();
      loadUnits();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      const response = await axios.get<IBook>(`/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error loading book:', error);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await axios.get<IUnit[]>(`/api/books/${id}/units`);
      setUnits(response.data);
    } catch (error) {
      console.error('Error loading units:', error);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedUnitIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedUnitIndex === null || draggedUnitIndex === index) return;

    const items = [...units];
    const draggedItem = items[draggedUnitIndex];
    items.splice(draggedUnitIndex, 1);
    items.splice(index, 0, draggedItem);

    setUnits(items);
    setDraggedUnitIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedUnitIndex(null);

    // Update orderIndex for all units
    const updatedUnits = units.map((unit, idx) => ({
      ...unit,
      orderIndex: idx + 1,
    }));

    setUnits(updatedUnits);

    // Save the new order to backend
    try {
      await axios.put(`/api/books/${id}/units/reorder`, {
        unitIds: updatedUnits.map(u => u.id),
      });
    } catch (error) {
      console.error('Error saving unit order:', error);
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await axios.delete(`/api/units/${unitId}`);
        loadUnits();
      } catch (error) {
        console.error('Error deleting unit:', error);
      }
    }
  };

  if (!book) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <TeacherLayout>
      <div className="teacher-book-detail">
        <div className="detail-header">
          <button onClick={() => navigate('/teacher/books')} className="back-btn">
            <i className="bi bi-arrow-left"></i> Back to Books
          </button>
          <div className="header-info">
            <h1>{book.title}</h1>
            <p>{book.description}</p>
          </div>
          <div className="header-actions">
            <Link to={`/teacher/books/${id}/edit`} className="btn-secondary">
              <i className="bi bi-pencil"></i> Edit Book
            </Link>
            <Link to={`/teacher/units/${id}/new`} className="btn-primary">
              <i className="bi bi-plus-circle"></i> Add Unit
            </Link>
          </div>
        </div>

        <div className="book-info-card">
          <img src={book.coverImageUrl || '/content/images/default-book.png'} alt={book.title} className="book-cover" />
          <div className="book-meta">
            <div className="meta-item">
              <span className="label">Total Units:</span>
              <span className="value">{units.length}</span>
            </div>
            <div className="meta-item">
              <span className="label">Created:</span>
              <span className="value">{book.createdDate ? new Date(book.createdDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="meta-item">
              <span className="label">Public:</span>
              <span className="value">{book.isPublic ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="units-section">
          <div className="section-header">
            <h2>
              <i className="bi bi-list-ol"></i> Units
            </h2>
            <p className="hint">
              <i className="bi bi-grip-vertical"></i> Drag and drop to reorder units
            </p>
          </div>

          <div className="units-list">
            {units.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-inbox"></i>
                <h3>No units yet</h3>
                <p>Start by adding your first unit to this book</p>
                <Link to={`/teacher/units/${id}/new`} className="btn-primary">
                  <i className="bi bi-plus-circle"></i> Add First Unit
                </Link>
              </div>
            ) : (
              units.map((unit, index) => (
                <div
                  key={unit.id}
                  className={`unit-card ${draggedUnitIndex === index ? 'dragging' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={e => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="drag-handle">
                    <i className="bi bi-grip-vertical"></i>
                  </div>
                  <div className="unit-number">{index + 1}</div>
                  <div className="unit-content">
                    <h3>{unit.title}</h3>
                    <p>{unit.summary}</p>
                    <div className="unit-stats">
                      <span>
                        <i className="bi bi-book"></i> Vocabulary: {unit.vocabularyCount || 0}
                      </span>
                      <span>
                        <i className="bi bi-journal-text"></i> Grammar: {unit.grammarCount || 0}
                      </span>
                      <span>
                        <i className="bi bi-question-circle"></i> Exercises: {unit.exerciseCount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="unit-actions">
                    <Link to={`/teacher/units/${unit.id}/edit`} className="btn-icon" title="Edit">
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button onClick={() => handleDeleteUnit(unit.id)} className="btn-icon btn-danger" title="Delete">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default BookDetail;
