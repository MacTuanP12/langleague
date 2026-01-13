import React from 'react';
import { Translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { MessageCode } from 'app/shared/constants/system-messages';
import { getMessage, getValidationMessage, isToastMessage, getMessageType } from 'app/shared/util/message-utils';
import { MessageType } from 'app/shared/constants/system-messages';

/**
 * Example component demonstrating how to use system messages
 *
 * This component shows various ways to use the system message constants:
 * 1. Direct message retrieval with getMessage()
 * 2. Validation messages with getValidationMessage()
 * 3. Toast notifications based on message type
 * 4. Integration with react-jhipster's Translate component
 */
export const SystemMessageExample: React.FC = () => {
  // Example 1: Display a simple message
  const displaySimpleMessage = () => {
    const message = getMessage(MessageCode.MSG01); // "No search results."
    // Message can be displayed in UI
  };

  // Example 2: Display a message with parameters
  const displayParameterizedMessage = () => {
    const message = getMessage(MessageCode.MSG03, { max: '50' });
    // Message: "This field cannot be longer than 50 characters."
  };

  // Example 3: Show a toast notification
  const showToastNotification = (code: MessageCode) => {
    const message = getMessage(code);
    const type = getMessageType(code);

    switch (type) {
      case MessageType.TOAST_SUCCESS:
        toast.success(message);
        break;
      case MessageType.TOAST_ERROR:
        toast.error(message);
        break;
      case MessageType.TOAST_WARNING:
        toast.warning(message);
        break;
      case MessageType.TOAST_INFO:
        toast.info(message);
        break;
      default:
        toast(message);
    }
  };

  // Example 4: Validation message for form fields
  const getFieldValidationMessage = (fieldName: string) => {
    return getValidationMessage(fieldName, 'required');
  };

  // Example 5: Using with react-jhipster Translate component
  const TranslatedMessage = ({ code }: { code: MessageCode }) => {
    return <Translate contentKey={`systemMessages.${code}`}>{getMessage(code)}</Translate>;
  };

  // Example 6: Handling login success
  const handleLoginSuccess = () => {
    showToastNotification(MessageCode.MSG31);
  };

  // Example 7: Handling validation error
  const handleValidationError = (fieldName: string, min: number) => {
    const message = getMessage(MessageCode.MSG04, { min: min.toString() });
    toast.error(message);
  };

  // Example 8: Confirmation dialog
  const showDeleteConfirmation = () => {
    const message = getMessage(MessageCode.MSG129);
    if (window.confirm(message)) {
      // Proceed with delete
      showToastNotification(MessageCode.MSG56);
    }
  };

  return (
    <div className="system-message-examples">
      <h2>System Message Examples</h2>

      <section>
        <h3>1. Simple Message Display</h3>
        <button onClick={displaySimpleMessage}>Display Simple Message (Check Console)</button>
      </section>

      <section>
        <h3>2. Parameterized Message</h3>
        <button onClick={displayParameterizedMessage}>Display Message with Parameters (Check Console)</button>
      </section>

      <section>
        <h3>3. Toast Notifications</h3>
        <button onClick={handleLoginSuccess}>Show Login Success Toast</button>
        <button onClick={() => showToastNotification(MessageCode.MSG35)}>Show Profile Update Error Toast</button>
        <button onClick={() => showToastNotification(MessageCode.MSG42)}>Show Account Not Activated Warning</button>
      </section>

      <section>
        <h3>4. Validation Messages</h3>
        <p>Required field validation: {getFieldValidationMessage('Email')}</p>
        <button onClick={() => handleValidationError('Password', 8)}>Show Min Length Error</button>
      </section>

      <section>
        <h3>5. Using with Translate Component</h3>
        <TranslatedMessage code={MessageCode.MSG31} />
      </section>

      <section>
        <h3>6. Confirmation Dialogs</h3>
        <button onClick={showDeleteConfirmation}>Show Delete User Confirmation</button>
      </section>
    </div>
  );
};

export default SystemMessageExample;
