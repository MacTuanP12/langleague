import { notification } from 'antd';

/**
 * Feedback Component cho Exercise
 * Hiển thị phản hồi với animation và âm thanh khi trả lời đúng/sai
 * Note: Ant Design 6.x uses 'title' instead of 'message'
 */
export const showCorrectFeedback = (customTitle?: string, customDescription?: string) => {
  // Play success sound
  const audio = new Audio('data:audio/wav;base64,UklGRhgAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
  audio.play().catch(() => {
    // Ignore if audio fails to play
  });

  // Vibrate on mobile
  if (navigator.vibrate) {
    navigator.vibrate([50, 30, 50]);
  }

  notification.success({
    title: customTitle || '🎉 Chính xác!',
    description: customDescription || 'Bạn đã trả lời đúng! Tiếp tục phát huy!',
    placement: 'bottomRight',
    duration: 2,
  });
};

export const showIncorrectFeedback = (correctAnswer?: string, explanation?: string) => {
  // Play error sound
  const audio = new Audio('data:audio/wav;base64,UklGRhgAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
  audio.volume = 0.3;
  audio.play().catch(() => {
    // Ignore if audio fails to play
  });

  // Vibrate on mobile (longer for error)
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }

  let descriptionText = 'Đừng nản lòng! Hãy thử lại nhé 💪';
  if (correctAnswer) {
    descriptionText += `\n\nĐáp án đúng: ${correctAnswer}`;
  }
  if (explanation) {
    descriptionText += `\n\nGiải thích: ${explanation}`;
  }

  notification.error({
    title: '❌ Chưa đúng',
    description: descriptionText,
    placement: 'bottomRight',
    duration: 4,
  });
};

export const showSubmitFeedback = () => {
  notification.info({
    title: '📝 Đã gửi bài',
    description: 'Bài viết của bạn đã được gửi thành công!',
    placement: 'bottomRight',
    duration: 2,
  });
};
