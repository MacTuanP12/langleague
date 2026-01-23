import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Table,
  Spinner,
} from 'reactstrap';
import { translate, Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createExercise, updateExercise, reset } from 'app/shared/reducers/exercise.reducer';
import { ExerciseType } from 'app/shared/model/enumerations/exercise-type.model';
import { toast } from 'react-toastify';
import { IExercise } from 'app/shared/model/exercise.model';
import { IExerciseOption } from 'app/shared/model/exercise-option.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { MediaUploadField } from 'app/shared/components/form/MediaUploadField';
import { extractTextFromImage, isImageFile, getAcceptAttributeWithImages } from 'app/shared/util/file-text-extractor';

interface ExerciseModalProps {
  isOpen: boolean;
  toggle: () => void;
  unitId: string;
  onSuccess: () => void;
  exerciseEntity?: IExercise | null;
}

export const ExerciseModal = ({ isOpen, toggle, unitId, onSuccess, exerciseEntity }: ExerciseModalProps) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.exercise.loading);
  const updateSuccess = useAppSelector(state => state.exercise.updateSuccess);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    exerciseText: '',
    exerciseType: ExerciseType.SINGLE_CHOICE,
    correctAnswerRaw: '',
    audioUrl: '',
    imageUrl: '',
    options: [] as IExerciseOption[],
  });

  const [errors, setErrors] = useState({
    exerciseText: false,
    exerciseType: false,
  });

  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(reset());
      if (exerciseEntity) {
        setFormData({
          exerciseText: exerciseEntity.exerciseText || '',
          exerciseType: exerciseEntity.exerciseType || ExerciseType.SINGLE_CHOICE,
          correctAnswerRaw: exerciseEntity.correctAnswerRaw || '',
          audioUrl: exerciseEntity.audioUrl || '',
          imageUrl: exerciseEntity.imageUrl || '',
          // Deep copy options to avoid mutating Redux state
          options: exerciseEntity.options ? exerciseEntity.options.map(opt => ({ ...opt })) : [],
        });
      } else {
        setFormData({
          exerciseText: '',
          exerciseType: ExerciseType.SINGLE_CHOICE,
          correctAnswerRaw: '',
          audioUrl: '',
          imageUrl: '',
          options: [
            { optionText: '', isCorrect: false, orderIndex: 0 },
            { optionText: '', isCorrect: false, orderIndex: 1 },
          ],
        });
      }
      setErrors({
        exerciseText: false,
        exerciseType: false,
      });
    }
  }, [isOpen, exerciseEntity]);

  useEffect(() => {
    if (updateSuccess) {
      onSuccess();
      toggle();
    }
  }, [updateSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'exerciseType' ? (value as ExerciseType) : value,
    }));
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleOptionChange = (index: number, field: keyof IExerciseOption, value: string | boolean | number) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleCorrectOptionChange = (index: number) => {
    const newOptions = [...formData.options];
    if (formData.exerciseType === ExerciseType.SINGLE_CHOICE) {
      // Reset all others by creating new objects
      newOptions.forEach((opt, i) => {
        newOptions[i] = { ...opt, isCorrect: i === index };
      });
    } else {
      // Toggle for Multi Choice by creating new object
      newOptions[index] = { ...newOptions[index], isCorrect: !newOptions[index].isCorrect };
    }
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { optionText: '', isCorrect: false, orderIndex: prev.options.length }],
    }));
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    // Re-index
    newOptions.forEach((opt, i) => (opt.orderIndex = i));
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!isImageFile(file.name)) {
        toast.error(translate('langleague.teacher.editor.exercises.ocr.invalidImage'));
        return;
      }

      setIsExtracting(true);
      try {
        const text = await extractTextFromImage(file);
        setFormData(prev => ({ ...prev, exerciseText: text }));
        toast.success(translate('langleague.teacher.editor.exercises.ocr.success'));
      } catch (error) {
        console.error('OCR Error:', error);
        toast.error(translate('langleague.teacher.editor.exercises.ocr.error'));
      } finally {
        setIsExtracting(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      exerciseText: !formData.exerciseText.trim(),
      exerciseType: !formData.exerciseType,
    };

    if (newErrors.exerciseText || newErrors.exerciseType) {
      setErrors(newErrors);
      return;
    }

    if (!unitId) {
      toast.error(translate('global.messages.error.missingUnitId'));
      return;
    }

    // Validation for options
    if (formData.exerciseType === ExerciseType.SINGLE_CHOICE || formData.exerciseType === ExerciseType.MULTI_CHOICE) {
      if (formData.options.length < 2) {
        toast.error(translate('langleague.teacher.editor.exercises.validation.minOptions'));
        return;
      }
      const hasCorrectAnswer = formData.options.some(opt => opt.isCorrect);
      if (!hasCorrectAnswer) {
        toast.error(translate('langleague.teacher.editor.exercises.validation.selectCorrect'));
        return;
      }
      const hasEmptyOption = formData.options.some(opt => !opt.optionText || !opt.optionText.trim());
      if (hasEmptyOption) {
        toast.error(translate('langleague.teacher.editor.exercises.validation.emptyOption'));
        return;
      }
    }

    const entity = {
      ...formData,
      orderIndex: exerciseEntity ? exerciseEntity.orderIndex : 0,
      unitId: Number(unitId),
      id: exerciseEntity ? exerciseEntity.id : undefined,
    };

    if (exerciseEntity) {
      dispatch(updateExercise(entity));
    } else {
      dispatch(createExercise(entity));
    }
  };

  const isChoiceType = formData.exerciseType === ExerciseType.SINGLE_CHOICE || formData.exerciseType === ExerciseType.MULTI_CHOICE;

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static" id="exercise-modal" autoFocus={false} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          {exerciseEntity
            ? translate('langleagueApp.exercise.home.createOrEditLabel')
            : translate('langleagueApp.exercise.home.createLabel')}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="exercise-exerciseText">
              {translate('langleagueApp.exercise.exerciseText')} <span className="text-danger">*</span>
            </Label>
            <div className="d-flex gap-2">
              <Input
                type="textarea"
                name="exerciseText"
                id="exercise-exerciseText"
                value={formData.exerciseText}
                onChange={handleChange}
                invalid={errors.exerciseText}
                style={{ minHeight: '100px' }}
              />
              <div className="d-flex flex-column justify-content-start">
                <Button
                  color="info"
                  outline
                  title={translate('langleague.teacher.editor.exercises.ocr.button')}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting}
                  style={{ height: 'fit-content' }}
                >
                  {isExtracting ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faCamera} />}
                </Button>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>
            <FormFeedback>{translate('entity.validation.required')}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="exercise-exerciseType">
              {translate('langleagueApp.exercise.exerciseType')} <span className="text-danger">*</span>
            </Label>
            <Input
              type="select"
              name="exerciseType"
              id="exercise-exerciseType"
              value={formData.exerciseType}
              onChange={handleChange}
              invalid={errors.exerciseType}
            >
              {Object.keys(ExerciseType).map(key => (
                <option value={key} key={key}>
                  {translate(`langleagueApp.ExerciseType.${key}`)}
                </option>
              ))}
            </Input>
            <FormFeedback>{translate('entity.validation.required')}</FormFeedback>
          </FormGroup>

          {isChoiceType ? (
            <FormGroup>
              <Label>
                <Translate contentKey="langleague.teacher.editor.exercises.form.options">Options</Translate>{' '}
                <span className="text-danger">*</span>
              </Label>
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }} className="text-center">
                      <Translate contentKey="langleague.teacher.editor.exercises.form.correct">Correct</Translate>
                    </th>
                    <th>
                      <Translate contentKey="langleague.teacher.editor.exercises.form.optionText">Option Text</Translate>
                    </th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.options.map((option, index) => (
                    <tr key={index}>
                      <td className="text-center align-middle">
                        <Input
                          type={formData.exerciseType === ExerciseType.SINGLE_CHOICE ? 'radio' : 'checkbox'}
                          name="correctOption"
                          checked={option.isCorrect || false}
                          onChange={() => handleCorrectOptionChange(index)}
                          style={{ margin: 0 }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          value={option.optionText || ''}
                          onChange={e => handleOptionChange(index, 'optionText', e.target.value)}
                          placeholder={translate('langleague.teacher.editor.exercises.form.optionPlaceholder', { index: index + 1 })}
                        />
                      </td>
                      <td className="text-center align-middle">
                        <Button color="danger" size="sm" outline onClick={() => removeOption(index)}>
                          <FontAwesomeIcon icon="trash" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button color="success" size="sm" outline onClick={addOption}>
                <FontAwesomeIcon icon="plus" />{' '}
                <Translate contentKey="langleague.teacher.editor.exercises.form.addOption">Add Option</Translate>
              </Button>
            </FormGroup>
          ) : (
            <FormGroup>
              <Label for="exercise-correctAnswerRaw">{translate('langleagueApp.exercise.correctAnswerRaw')}</Label>
              <Input
                type="textarea"
                name="correctAnswerRaw"
                id="exercise-correctAnswerRaw"
                value={formData.correctAnswerRaw}
                onChange={handleChange}
                placeholder={translate('langleague.teacher.editor.exercises.form.correctAnswerPlaceholder')}
              />
            </FormGroup>
          )}

          <MediaUploadField
            type="audio"
            label={translate('langleagueApp.exercise.audioUrl')}
            value={formData.audioUrl}
            onChange={url => setFormData(prev => ({ ...prev, audioUrl: url }))}
            placeholder={translate('global.form.audio.url.placeholder')}
          />

          <MediaUploadField
            type="image"
            label={translate('langleagueApp.exercise.imageUrl')}
            value={formData.imageUrl}
            onChange={url => setFormData(prev => ({ ...prev, imageUrl: url }))}
            placeholder={translate('global.form.image.url.placeholder')}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            {translate('entity.action.cancel')}
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {translate('entity.action.save')}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
