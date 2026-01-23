import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { IGrammar } from 'app/shared/model/grammar.model';
import ReactMarkdown from 'react-markdown';
import { Translate } from 'react-jhipster';

interface GrammarDisplayCardProps {
  grammar: IGrammar;
  onDelete: () => void;
  onEdit: () => void;
}

export const GrammarDisplayCard: React.FC<GrammarDisplayCardProps> = ({ grammar, onDelete, onEdit }) => {
  return (
    <Card className="h-100">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="mb-0">{grammar.title}</h5>
          <div>
            <Button color="link" size="sm" onClick={onEdit} className="p-0 me-2">
              <i className="bi bi-pencil"></i>
            </Button>
            <Button color="link" size="sm" onClick={onDelete} className="p-0 text-danger">
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        </div>
        {grammar.contentMarkdown && (
          <div className="grammar-content mb-3">
            <ReactMarkdown>{grammar.contentMarkdown.substring(0, 200) + '...'}</ReactMarkdown>
          </div>
        )}
        {grammar.exampleUsage && (
          <div className="grammar-example small text-muted">
            <strong>
              <Translate contentKey="langleague.teacher.units.grammar.fields.example">Example</Translate>:
            </strong>
            <ReactMarkdown>{grammar.exampleUsage.substring(0, 150) + '...'}</ReactMarkdown>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
