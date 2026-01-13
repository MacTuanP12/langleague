import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getNotesByUnit, createNote, updateNote, deleteNote, reset } from 'app/shared/reducers/note.reducer';
import { Translate } from 'react-jhipster';
import { INote } from 'app/shared/model/note.model';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import styles from './unit-notes.module.scss';

interface IUnitNotesProps {
  unitId: number;
  hideTitle?: boolean;
}

export const UnitNotes = ({ unitId, hideTitle = false }: IUnitNotesProps) => {
  const dispatch = useAppDispatch();
  const { entities: notes, loading, updating, errorMessage, updateSuccess } = useAppSelector(state => state.note);

  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load notes when unit changes
  useEffect(() => {
    if (unitId) {
      dispatch(getNotesByUnit(unitId));
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, unitId]);

  // Reset form after successful update
  useEffect(() => {
    if (updateSuccess) {
      setContent('');
      setEditingId(null);
    }
  }, [updateSuccess]);

  const handleSubmit = useCallback(() => {
    const trimmedContent = content.trim();
    if (!trimmedContent || !unitId) {
      return;
    }

    if (editingId) {
      // Update existing note
      const existingNote = notes.find(n => n.id === editingId);
      if (existingNote) {
        const noteToUpdate: INote = {
          ...existingNote,
          content: trimmedContent,
          updatedAt: dayjs().toISOString(),
        };
        dispatch(updateNote(noteToUpdate));
      }
    } else {
      // Create new note
      const newNote: INote = {
        content: trimmedContent,
        unitId,
        createdAt: dayjs().toISOString(),
        // userProfileId will be set by backend based on current user
      };
      dispatch(createNote(newNote));
    }
  }, [content, unitId, editingId, notes, dispatch]);

  const handleEdit = useCallback((note: INote) => {
    if (note.content) {
      setContent(note.content);
      setEditingId(note.id || null);
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setContent('');
    setEditingId(null);
  }, []);

  const handleDelete = useCallback(
    (id?: number) => {
      if (!id || !unitId) return;

      if (window.confirm('Are you sure you want to delete this note?')) {
        dispatch(deleteNote({ id, unitId }));
      }
    },
    [dispatch, unitId],
  );

  return (
    <div className={styles?.notesContainer || 'notes-container'}>
      {!hideTitle && (
        <h3>
          <i className="bi bi-journal-text"></i>
          <Translate contentKey="langleague.student.learning.notes.title">My Notes</Translate>
        </h3>
      )}

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i> {errorMessage}
        </div>
      )}

      <div className={styles?.noteInputArea || 'note-input-area'}>
        <textarea
          placeholder="Take a note..."
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={updating || loading}
          rows={3}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={styles?.addButton || 'add-button'} onClick={handleSubmit} disabled={!content.trim() || updating || loading}>
            {updating ? (
              <i className="bi bi-hourglass-split"> {editingId ? 'Updating...' : 'Saving...'}</i>
            ) : (
              <>{editingId ? <i className="bi bi-check-lg"> Update Note</i> : <i className="bi bi-plus-lg"> Add Note</i>}</>
            )}
          </button>

          {editingId && (
            <button
              className={styles?.addButton || 'add-button'}
              style={{ backgroundColor: '#6c757d', width: 'auto' }}
              onClick={handleCancelEdit}
              disabled={updating}
            >
              <i className="bi bi-x-lg"> Cancel</i>
            </button>
          )}
        </div>
      </div>

      <div className={styles?.notesList || 'notes-list'}>
        {loading && (!notes || notes.length === 0) ? (
          <div className={styles?.loadingState || 'loading-state'}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading notes...</p>
          </div>
        ) : notes && notes.length > 0 ? (
          (notes || []).map(note => (
            <div key={note.id} className={styles?.noteItem || 'note-item'}>
              <div className={styles?.noteContent || 'note-content'}>{note.content}</div>
              <div className={styles?.noteFooter || 'note-footer'}>
                <span className={styles?.noteDate || 'note-date'}>
                  {note.updatedAt
                    ? `Updated: ${dayjs(note.updatedAt).format('DD/MM/YYYY HH:mm')}`
                    : `Created: ${dayjs(note.createdAt).format('DD/MM/YYYY HH:mm')}`}
                </span>
                <div className={styles?.noteActions || 'note-actions'}>
                  <button
                    className={styles?.editBtn || 'edit-btn'}
                    onClick={() => handleEdit(note)}
                    disabled={updating}
                    title="Edit"
                    aria-label="Edit note"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className={styles?.deleteBtn || 'delete-btn'}
                    onClick={() => handleDelete(note.id)}
                    disabled={updating}
                    title="Delete"
                    aria-label="Delete note"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles?.emptyState || 'empty-state'}>
            <i className="bi bi-journal-x"></i>
            <p>
              <Translate contentKey="langleague.student.learning.notes.empty">No notes yet for this unit.</Translate>
            </p>
            <small>Start taking notes to help you remember important points!</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitNotes;
