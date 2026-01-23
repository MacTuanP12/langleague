import React from 'react';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface NoteErrorBoundaryProps {
  children: React.ReactNode;
}

class NoteErrorBoundary extends React.Component<NoteErrorBoundaryProps> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Note component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert color="danger">
          <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
          Something went wrong with the notes. Please refresh the page.
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default NoteErrorBoundary;
