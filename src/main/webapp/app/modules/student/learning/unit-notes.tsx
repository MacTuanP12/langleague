import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getNotesByUnit, createNote, updateNote, deleteNote, reset } from 'app/shared/reducers/note.reducer';
import { Translate } from 'react-jhipster';
import { INote } from 'app/shared/model/note.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import './unit-notes.scss';

interface IUnitNotesProps {
  unitId: number;
}

export const UnitNotes = ({ unitId }: IUnitNotesProps) => {
  const dispatch = useAppDispatch();
  const noteState = useAppSelector(state => state.note);

  const { entities: notes = [], loading = false, updating = false } = noteState || {};

  // Single note state
  const [noteContent, setNoteContent] = useState('');
  const [existingNote, setExistingNote] = useState<INote | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load notes when component mounts or unitId changes
  useEffect(() => {
    if (unitId) {
      dispatch(getNotesByUnit(unitId));
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, unitId]);

  // Update local state when notes are loaded
  useEffect(() => {
    if (notes && notes.length > 0) {
      // Take the first note (1-to-1 relationship)
      const note = notes[0];
      setExistingNote(note);
      setNoteContent(note.content || '');
    } else {
      setExistingNote(null);
      setNoteContent('');
    }
  }, [notes]);

  // Handle save button click
  const handleSave = async () => {
    const trimmedContent = noteContent.trim();

    if (!trimmedContent) {
      return;
    }

    setIsSaving(true);

    try {
      if (existingNote && existingNote.id) {
        // Update existing note
        const updatedNote: INote = {
          ...existingNote,
          content: trimmedContent,
          updatedAt: dayjs().toISOString(),
        };
        await dispatch(updateNote(updatedNote));
      } else {
        // Create new note
        const newNote: INote = {
          content: trimmedContent,
          unitId,
          createdAt: dayjs().toISOString(),
        };
        await dispatch(createNote(newNote));
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle clear/delete
  const handleClear = () => {
    if (existingNote && existingNote.id) {
      if (window.confirm('Are you sure you want to delete this note?')) {
        dispatch(deleteNote({ id: existingNote.id, unitId }));
        setNoteContent('');
      }
    } else {
      setNoteContent('');
    }
  };

  const hasChanges = existingNote ? noteContent.trim() !== (existingNote.content || '').trim() : noteContent.trim().length > 0;

  return (
    <div className="notes-widget-container">
      {/* Header */}
      <div className="notes-header">
        <h3>
          <FontAwesomeIcon icon="sticky-note" className="me-2" />
          <Translate contentKey="langleague.student.learning.notes.title">My Personal Notes</Translate>
        </h3>
        {existingNote && existingNote.updatedAt && (
          <span className="last-updated">
            <FontAwesomeIcon icon="clock" className="me-1" />
            <Translate contentKey="langleague.student.learning.notes.lastUpdated">Last updated</Translate>:{' '}
            {dayjs(existingNote.updatedAt).format('DD/MM/YYYY HH:mm')}
          </span>
        )}
      </div>

      {/* Editor Area */}
      <div className="notes-editor">
        {loading && !existingNote ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <textarea
            className="notes-textarea"
            placeholder="Start typing your notes here..."
            value={noteContent}
            onChange={e => setNoteContent(e.target.value)}
            disabled={updating || isSaving}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="notes-footer">
        <div className="footer-info">
          <span className="char-count">
            {noteContent.length} <Translate contentKey="langleague.student.learning.notes.characters">characters</Translate>
          </span>
        </div>
        <div className="footer-actions">
          {noteContent.trim().length > 0 && (
            <button className="btn-clear" onClick={handleClear} disabled={updating || isSaving} title="Clear note">
              <FontAwesomeIcon icon="eraser" className="me-1" />
              <Translate contentKey="langleague.student.learning.notes.clear">Clear</Translate>
            </button>
          )}
          <button className="btn-save" onClick={handleSave} disabled={!hasChanges || updating || isSaving}>
            {isSaving || updating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <Translate contentKey="langleague.student.learning.notes.saving">Saving...</Translate>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="save" className="me-1" />
                <Translate contentKey="langleague.student.learning.notes.save">Save</Translate>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitNotes;
