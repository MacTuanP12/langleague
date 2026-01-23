import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities, createNote, updateNote, deleteNote } from 'app/shared/reducers/note.reducer';
import { Translate, translate } from 'react-jhipster';
import { INote } from 'app/shared/model/note.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button } from 'reactstrap';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import './unit-notes.scss';
import MarkdownNoteEditor from 'app/shared/components/markdown-editor/markdown-note-editor';
import { showToast } from 'app/shared/util/toast-utils';
import { MessageCode } from 'app/shared/constants/system-messages';

// Extended interface to handle the nested unit structure if not present in the model
interface INoteWithUnit extends INote {
  unit?: {
    id: number;
  };
}

interface IUnitNotesProps {
  unitId: number;
  onClose?: () => void;
}

export const UnitNotes = ({ unitId, onClose }: IUnitNotesProps) => {
  const dispatch = useAppDispatch();
  const { entities, loading, updating, errorMessage } = useAppSelector(state => state.note);
  const notes = (entities || []) as INoteWithUnit[];

  const [existingNote, setExistingNote] = useState<INote | null>(null);
  const [hasNote, setHasNote] = useState(false);
  const [content, setContent] = useState('');

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setExistingNote(null);
    setHasNote(false);
    setContent('');
    setIsEditing(false);

    const fetchNotes = async () => {
      if (unitId) {
        await dispatch(getEntities({ page: 0, size: 999, sort: 'id,desc' }));
      }
    };

    fetchNotes();
  }, [dispatch, unitId]);

  useEffect(() => {
    if (loading || updating) return;

    console.warn('🔍 Debug - Current unitId:', unitId);
    console.warn('🔍 Debug - Notes from Redux:', notes);
    console.warn('🔍 Debug - Loading:', loading, 'Updating:', updating);

    if (notes && notes.length > 0) {
      const currentUnitId = Number(unitId);
      const foundNote = notes.find((note: INoteWithUnit) => {
        const idFromFlat = note.unitId;
        const idFromNested = note.unit?.id;
        return Number(idFromFlat) === currentUnitId || Number(idFromNested) === currentUnitId;
      });

      console.warn('🔍 Debug - Current UnitId (Number):', currentUnitId);
      console.warn('🔍 Debug - Found Note:', foundNote);

      if (foundNote) {
        setExistingNote(foundNote);
        setHasNote(true);
        if (!isEditing) setContent(foundNote.content || '');
      } else {
        setExistingNote(null);
        setHasNote(false);
        if (!isEditing) setContent('');
      }
    } else if (!loading) {
      setExistingNote(null);
      setHasNote(false);
      if (!isEditing) setContent('');
    }
  }, [notes, loading, updating, unitId, isEditing]);

  const handleAddNote = () => {
    setIsEditing(true);
    setShowPreview(false);
    if (!hasNote) setContent('');
  };

  const handleEditNote = () => {
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowPreview(false);
    if (existingNote) {
      setContent(existingNote.content || '');
    } else {
      setContent('');
    }
  };

  const handleDelete = async () => {
    if (updating) return;
    if (existingNote && existingNote.id) {
      if (window.confirm(translate('langleague.student.learning.notes.deleteConfirm'))) {
        try {
          await dispatch(deleteNote({ id: existingNote.id, unitId }));
          setIsEditing(false);
          setExistingNote(null);
          setHasNote(false);
          setContent('');
          dispatch(
            getEntities({
              page: 0,
              size: 999,
              sort: 'id,desc',
            }),
          );
          showToast(MessageCode.MSG87);
        } catch (error) {
          showToast(MessageCode.MSG89);
        }
      }
    }
  };

  const handleSave = async (editorContent?: string) => {
    if (updating) return;

    const contentToSave = typeof editorContent === 'string' ? editorContent : content;
    const trimmedContent = contentToSave.trim();

    if (!trimmedContent) {
      if (existingNote?.id) await handleDelete();
      else {
        setContent('');
        setIsEditing(false);
      }
      return;
    }

    try {
      const isUpdate = !!existingNote?.id;
      const action = isUpdate ? updateNote : createNote;

      const notePayload: INote = isUpdate
        ? { ...existingNote, content: trimmedContent, updatedAt: dayjs().toISOString() }
        : { content: trimmedContent, unitId: Number(unitId), createdAt: dayjs().toISOString() };

      const result = await dispatch(action(notePayload));

      if (action.fulfilled.match(result)) {
        const savedEntity = result.payload.data as INoteWithUnit;

        const finalEntity = {
          ...savedEntity,
          unitId: savedEntity.unitId || Number(unitId),
        };

        setExistingNote(finalEntity);
        setHasNote(true);
        setContent(finalEntity.content || '');
        setIsEditing(false);

        showToast(MessageCode.MSG86);
        dispatch(getEntities({ page: 0, size: 999, sort: 'id,desc' }));
      }
    } catch (error) {
      showToast(MessageCode.MSG88);
    }
  };

  const togglePreview = () => setShowPreview(!showPreview);
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const isFetching = loading && !updating;

  return (
    <div className={`notes-widget-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="notes-header">
        <div className="header-title">
          <h3>
            <FontAwesomeIcon icon="sticky-note" className="me-2" />
            <Translate contentKey="langleague.student.learning.notes.title">My Personal Notes</Translate>
          </h3>
          {existingNote && existingNote.updatedAt && !isEditing && (
            <span className="last-updated">
              <FontAwesomeIcon icon="clock" className="me-1" />
              <Translate contentKey="langleague.student.learning.notes.lastUpdated">Last updated</Translate>:{' '}
              {dayjs(existingNote.updatedAt).format('DD/MM/YYYY HH:mm')}
            </span>
          )}
        </div>
        <div className="header-controls">
          {isEditing && (
            <button className="control-btn" onClick={togglePreview} title={showPreview ? 'Edit' : 'Preview'}>
              <FontAwesomeIcon icon={showPreview ? 'edit' : 'eye'} />
            </button>
          )}
          <button className="control-btn" onClick={toggleExpanded}>
            <FontAwesomeIcon icon={isExpanded ? 'compress-arrows-alt' : 'expand-arrows-alt'} />
          </button>
          {onClose && (
            <button className="control-btn close-btn" onClick={onClose}>
              <FontAwesomeIcon icon="times" />
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <Alert color="danger" className="m-3">
          <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
          {errorMessage}
        </Alert>
      )}

      <div className="notes-content-wrapper">
        {loading || isFetching ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : isEditing ? (
          <div className="note-edit-mode">
            <MarkdownNoteEditor
              value={content}
              onChange={setContent}
              onSave={() => handleSave(content)}
              onDelete={hasNote ? handleDelete : undefined}
              onCancel={handleCancelEdit}
              placeholder={translate('langleague.student.learning.notes.placeholder')}
              isUpdate={hasNote}
              readOnly={false}
              showPreview={showPreview}
              disabled={isFetching || updating}
            />
          </div>
        ) : hasNote ? (
          <div className="note-view-mode">
            <MarkdownNoteEditor
              initialValue={existingNote?.content || ''}
              onSave={handleSave}
              onDelete={handleDelete}
              placeholder={translate('langleague.student.learning.notes.placeholder')}
              isUpdate={true}
              readOnly={true}
              showEditButton={true}
              onEdit={handleEditNote}
              disabled={isFetching}
            />
          </div>
        ) : (
          <div className="empty-note-state">
            <div className="empty-icon">
              <FontAwesomeIcon icon="sticky-note" size="3x" />
            </div>
            <p className="empty-message">
              <Translate contentKey="langleague.student.learning.notes.empty">No notes for this unit yet.</Translate>
            </p>
            <Button color="primary" onClick={handleAddNote} disabled={isFetching}>
              <FontAwesomeIcon icon="plus" className="me-2" />
              <Translate contentKey="langleague.student.learning.notes.addButton">Add Note</Translate>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitNotes;
