import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
interface VocabularyDisplayCardProps {
  vocabulary: IVocabulary;
  onDelete: () => void;
  onEdit: () => void;
}
export const VocabularyDisplayCard: React.FC<VocabularyDisplayCardProps> = ({ vocabulary, onDelete, onEdit }) => {
  return (
    <Card className="h-100">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="mb-0">{vocabulary.word}</h5>
          <div>
            <Button color="link" size="sm" onClick={onEdit} className="p-0 me-2">
              <i className="bi bi-pencil"></i>
            </Button>
            <Button color="link" size="sm" onClick={onDelete} className="p-0 text-danger">
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        </div>
        {vocabulary.phonetic && <p className="text-muted small mb-2">/{vocabulary.phonetic}/</p>}
        <p className="mb-2">{vocabulary.meaning}</p>
        {vocabulary.example && <p className="small text-muted fst-italic">{vocabulary.example}</p>}
        {vocabulary.imageUrl && (
          <img src={vocabulary.imageUrl} alt={vocabulary.word} className="img-fluid rounded mt-2" style={{ maxHeight: '150px' }} />
        )}
      </CardBody>
    </Card>
  );
};
