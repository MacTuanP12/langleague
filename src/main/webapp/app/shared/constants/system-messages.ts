/**
 * System Message Constants
 * Generated from system_message.csv
 */

export enum MessageCode {
  // Search and Display
  MSG01 = 'MSG01', // No search results

  // Validation Messages - Input
  MSG02 = 'MSG02', // This field is required
  MSG03 = 'MSG03', // Max length exceeded
  MSG04 = 'MSG04', // Min length not met
  MSG05 = 'MSG05', // Field cannot be empty
  MSG06 = 'MSG06', // Email format invalid
  MSG07 = 'MSG07', // Password too short
  MSG08 = 'MSG08', // Password too long
  MSG09 = 'MSG09', // Passwords do not match
  MSG10 = 'MSG10', // Username already exists
  MSG11 = 'MSG11', // Email already in use
  MSG12 = 'MSG12', // Invalid captcha code
  MSG13 = 'MSG13', // Username too short
  MSG14 = 'MSG14', // Invalid username format
  MSG15 = 'MSG15', // Password validation error
  MSG16 = 'MSG16', // Name field required
  MSG17 = 'MSG17', // Email field required
  MSG18 = 'MSG18', // Email valid format required
  MSG19 = 'MSG19', // Password field required
  MSG20 = 'MSG20', // Password min length register
  MSG21 = 'MSG21', // Password min length settings
  MSG22 = 'MSG22', // Confirm password required
  MSG23 = 'MSG23', // Current password required
  MSG24 = 'MSG24', // Chapter name required
  MSG25 = 'MSG25', // File size exceeds limit
  MSG26 = 'MSG26', // Invalid file type
  MSG27 = 'MSG27', // First name required
  MSG28 = 'MSG28', // Last name required
  MSG29 = 'MSG29', // Role selection required

  // Authentication Messages - Toast
  MSG30 = 'MSG30', // Auth wrong credentials
  MSG31 = 'MSG31', // Auth login successful
  MSG32 = 'MSG32', // Auth registration successful
  MSG33 = 'MSG33', // Auth registration failed

  // Profile Messages - Toast
  MSG34 = 'MSG34', // Profile update successful
  MSG35 = 'MSG35', // Profile update failed
  MSG36 = 'MSG36', // Avatar upload successful
  MSG37 = 'MSG37', // Avatar upload failed
  MSG38 = 'MSG38', // Password change successful
  MSG39 = 'MSG39', // Password change failed
  MSG40 = 'MSG40', // User not found
  MSG41 = 'MSG41', // Email not found
  MSG42 = 'MSG42', // Account not activated
  MSG43 = 'MSG43', // Account locked
  MSG44 = 'MSG44', // Invalid activation key
  MSG45 = 'MSG45', // Invalid reset key
  MSG46 = 'MSG46', // Reset key expired
  MSG47 = 'MSG47', // Session expired
  MSG48 = 'MSG48', // No permission access
  MSG49 = 'MSG49', // No permission delete
  MSG50 = 'MSG50', // Item not found
  MSG51 = 'MSG51', // Data load failed
  MSG52 = 'MSG52', // Network error
  MSG53 = 'MSG53', // Validation error

  // Admin User Management - Toast
  MSG54 = 'MSG54', // User created admin
  MSG55 = 'MSG55', // User updated admin
  MSG56 = 'MSG56', // User deleted admin
  MSG57 = 'MSG57', // User create failed
  MSG58 = 'MSG58', // User update failed
  MSG59 = 'MSG59', // User delete failed
  MSG60 = 'MSG60', // User load failed

  // Book Management - Toast
  MSG61 = 'MSG61', // Book created
  MSG62 = 'MSG62', // Book updated
  MSG63 = 'MSG63', // Book deleted
  MSG64 = 'MSG64', // Book create failed
  MSG65 = 'MSG65', // Book update failed
  MSG66 = 'MSG66', // Book delete failed
  MSG67 = 'MSG67', // Book load failed
  MSG68 = 'MSG68', // Book removed library
  MSG69 = 'MSG69', // Book remove failed
  MSG70 = 'MSG70', // Book processing ai
  MSG71 = 'MSG71', // Book process ai failed

  // Chapter Management - Toast
  MSG72 = 'MSG72', // Chapter created
  MSG73 = 'MSG73', // Chapter updated
  MSG74 = 'MSG74', // Chapter deleted
  MSG75 = 'MSG75', // Chapter delete failed
  MSG76 = 'MSG76', // Chapter saved library
  MSG77 = 'MSG77', // Chapter removed library

  // Content Management - Toast
  MSG78 = 'MSG78', // Content saved
  MSG79 = 'MSG79', // Content save failed
  MSG80 = 'MSG80', // File uploaded
  MSG81 = 'MSG81', // File upload failed

  // Flashcard Management - Toast
  MSG82 = 'MSG82', // Flashcard added
  MSG83 = 'MSG83', // Flashcard add failed
  MSG84 = 'MSG84', // Flashcard deleted
  MSG85 = 'MSG85', // Flashcard delete failed

  // Note Management - Toast
  MSG86 = 'MSG86', // Note saved
  MSG87 = 'MSG87', // Note deleted
  MSG88 = 'MSG88', // Note save failed
  MSG89 = 'MSG89', // Note delete failed
  MSG90 = 'MSG90', // Note load failed

  // Comment Management - Toast
  MSG91 = 'MSG91', // Comment posted
  MSG92 = 'MSG92', // Comment post failed
  MSG93 = 'MSG93', // Reply posted
  MSG94 = 'MSG94', // Reply post failed
  MSG95 = 'MSG95', // Comment updated
  MSG96 = 'MSG96', // Comment update failed
  MSG97 = 'MSG97', // Comment deleted
  MSG98 = 'MSG98', // Comment delete failed
  MSG99 = 'MSG99', // Comment empty

  // Review Management - Toast
  MSG100 = 'MSG100', // Review submitted
  MSG101 = 'MSG101', // Review submit failed
  MSG102 = 'MSG102', // Review liked
  MSG103 = 'MSG103', // Review like failed
  MSG104 = 'MSG104', // Review deleted
  MSG105 = 'MSG105', // Review delete failed

  // Favorites - Toast
  MSG106 = 'MSG106', // Added favorites
  MSG107 = 'MSG107', // Removed favorites
  MSG108 = 'MSG108', // Favorites update failed

  // Progress - Toast
  MSG109 = 'MSG109', // Progress updated
  MSG110 = 'MSG110', // Progress update failed

  // Achievements - Toast
  MSG111 = 'MSG111', // Achievement unlocked

  // Settings - Toast
  MSG112 = 'MSG112', // Notification settings saved
  MSG113 = 'MSG113', // Notification settings failed
  MSG114 = 'MSG114', // Account settings saved
  MSG115 = 'MSG115', // Account settings failed
  MSG116 = 'MSG116', // Password updated
  MSG117 = 'MSG117', // Password change error

  // Course Management - Toast
  MSG118 = 'MSG118', // Course created
  MSG119 = 'MSG119', // Course updated
  MSG120 = 'MSG120', // Course deleted
  MSG121 = 'MSG121', // Course delete failed
  MSG122 = 'MSG122', // Course load failed

  // In-line Messages
  MSG123 = 'MSG123', // Book selection required
  MSG124 = 'MSG124', // Chapter selection required
  MSG125 = 'MSG125', // No data available
  MSG126 = 'MSG126', // Loading
  MSG127 = 'MSG127', // Login required
  MSG128 = 'MSG128', // Invalid note

  // Confirmation Dialogs
  MSG129 = 'MSG129', // Delete user confirmation
  MSG130 = 'MSG130', // Delete book confirmation
  MSG131 = 'MSG131', // Delete chapter confirmation
  MSG132 = 'MSG132', // Delete course confirmation
  MSG133 = 'MSG133', // Remove book from library

  // Email Notifications
  MSG134 = 'MSG134', // Account activation
  MSG135 = 'MSG135', // Password reset request
  MSG136 = 'MSG136', // Password changed
  MSG137 = 'MSG137', // Account locked
  MSG138 = 'MSG138', // Password reset sent

  // Contact & Analytics
  MSG139 = 'MSG139', // Contact message sent
  MSG140 = 'MSG140', // Contact send failed
  MSG141 = 'MSG141', // Analytics load failed

  // Exercise Messages
  MSG142 = 'MSG142', // Exercise load failed
  MSG143 = 'MSG143', // Exercise correct answer
  MSG144 = 'MSG144', // Exercise incorrect answer
  MSG145 = 'MSG145', // Recording stopped
  MSG146 = 'MSG146', // Exercise submitted

  // Error Pages
  MSG147 = 'MSG147', // Bad request 400
  MSG148 = 'MSG148', // Forbidden 403
  MSG149 = 'MSG149', // Not found 404
  MSG150 = 'MSG150', // Method not allowed 405
  MSG151 = 'MSG151', // Internal server error 500
  MSG152 = 'MSG152', // Server not reachable
  MSG153 = 'MSG153', // Concurrency failure
}

export enum MessageType {
  IN_LINE = 'IN_LINE',
  IN_RED = 'IN_RED',
  TOAST = 'TOAST',
  TOAST_SUCCESS = 'TOAST_SUCCESS',
  TOAST_ERROR = 'TOAST_ERROR',
  TOAST_WARNING = 'TOAST_WARNING',
  TOAST_INFO = 'TOAST_INFO',
  CONFIRM_DIALOG = 'CONFIRM_DIALOG',
  EMAIL_NOTIFICATION = 'EMAIL_NOTIFICATION',
  ERROR_PAGE = 'ERROR_PAGE',
}

export interface SystemMessage {
  code: MessageCode;
  type: MessageType;
  context: string;
  content: string;
}

export const SYSTEM_MESSAGES: Record<MessageCode, SystemMessage> = {
  [MessageCode.MSG01]: { code: MessageCode.MSG01, type: MessageType.IN_LINE, context: 'Search no results', content: 'No search results.' },
  [MessageCode.MSG02]: { code: MessageCode.MSG02, type: MessageType.IN_RED, context: 'Input required', content: 'This field is required.' },
  [MessageCode.MSG03]: {
    code: MessageCode.MSG03,
    type: MessageType.IN_RED,
    context: 'Max length exceeded',
    content: 'This field cannot be longer than {max} characters.',
  },
  [MessageCode.MSG04]: {
    code: MessageCode.MSG04,
    type: MessageType.IN_RED,
    context: 'Min length not met',
    content: 'This field is required to be at least {min} characters.',
  },
  [MessageCode.MSG05]: {
    code: MessageCode.MSG05,
    type: MessageType.IN_RED,
    context: 'Field cannot be empty',
    content: '{fieldName} cannot be empty!',
  },
  [MessageCode.MSG06]: {
    code: MessageCode.MSG06,
    type: MessageType.IN_RED,
    context: 'Email format invalid',
    content: 'Your email is invalid.',
  },
  [MessageCode.MSG07]: {
    code: MessageCode.MSG07,
    type: MessageType.IN_RED,
    context: 'Password too short',
    content: 'Your password is required to be at least 4 characters.',
  },
  [MessageCode.MSG08]: {
    code: MessageCode.MSG08,
    type: MessageType.IN_RED,
    context: 'Password too long',
    content: 'Your password cannot be longer than 50 characters.',
  },
  [MessageCode.MSG09]: {
    code: MessageCode.MSG09,
    type: MessageType.IN_RED,
    context: 'Passwords do not match',
    content: 'The password and its confirmation do not match!',
  },
  [MessageCode.MSG10]: {
    code: MessageCode.MSG10,
    type: MessageType.IN_RED,
    context: 'Username already exists',
    content: 'Username already exists! Please choose a different name.',
  },
  [MessageCode.MSG11]: {
    code: MessageCode.MSG11,
    type: MessageType.IN_RED,
    context: 'Email already in use',
    content: 'Email is already in use! Please use a different email or login.',
  },
  [MessageCode.MSG12]: {
    code: MessageCode.MSG12,
    type: MessageType.IN_RED,
    context: 'Invalid captcha code',
    content: 'Invalid captcha code',
  },
  [MessageCode.MSG13]: {
    code: MessageCode.MSG13,
    type: MessageType.IN_RED,
    context: 'Username too short',
    content: 'Username must be at least 3 characters',
  },
  [MessageCode.MSG14]: {
    code: MessageCode.MSG14,
    type: MessageType.IN_RED,
    context: 'Invalid username format',
    content: 'Username can only contain lowercase letters, numbers, underscore and hyphen',
  },
  [MessageCode.MSG15]: {
    code: MessageCode.MSG15,
    type: MessageType.IN_RED,
    context: 'Password validation error',
    content: 'Invalid password! Password must be between 4 and 100 characters.',
  },
  [MessageCode.MSG16]: {
    code: MessageCode.MSG16,
    type: MessageType.IN_RED,
    context: 'Name field required',
    content: 'Please enter your name',
  },
  [MessageCode.MSG17]: {
    code: MessageCode.MSG17,
    type: MessageType.IN_RED,
    context: 'Email field required',
    content: 'Please enter your email',
  },
  [MessageCode.MSG18]: {
    code: MessageCode.MSG18,
    type: MessageType.IN_RED,
    context: 'Email valid format required',
    content: 'Please enter a valid email',
  },
  [MessageCode.MSG19]: {
    code: MessageCode.MSG19,
    type: MessageType.IN_RED,
    context: 'Password field required',
    content: 'Please enter your password',
  },
  [MessageCode.MSG20]: {
    code: MessageCode.MSG20,
    type: MessageType.IN_RED,
    context: 'Password min length register',
    content: 'Password must be at least 8 characters register',
  },
  [MessageCode.MSG21]: {
    code: MessageCode.MSG21,
    type: MessageType.IN_RED,
    context: 'Password min length settings',
    content: 'Password must be at least 6 characters settings',
  },
  [MessageCode.MSG22]: {
    code: MessageCode.MSG22,
    type: MessageType.IN_RED,
    context: 'Confirm password required',
    content: 'Please confirm your password',
  },
  [MessageCode.MSG23]: {
    code: MessageCode.MSG23,
    type: MessageType.IN_RED,
    context: 'Current password required',
    content: 'Please enter your current password',
  },
  [MessageCode.MSG24]: {
    code: MessageCode.MSG24,
    type: MessageType.IN_RED,
    context: 'Chapter name required',
    content: 'Please enter chapter name',
  },
  [MessageCode.MSG25]: {
    code: MessageCode.MSG25,
    type: MessageType.IN_RED,
    context: 'File size exceeds limit',
    content: 'Image must be smaller than 2MB',
  },
  [MessageCode.MSG26]: {
    code: MessageCode.MSG26,
    type: MessageType.IN_RED,
    context: 'Invalid file type',
    content: 'Only image files are allowed',
  },
  [MessageCode.MSG27]: {
    code: MessageCode.MSG27,
    type: MessageType.IN_RED,
    context: 'First name required',
    content: 'Please enter first name',
  },
  [MessageCode.MSG28]: {
    code: MessageCode.MSG28,
    type: MessageType.IN_RED,
    context: 'Last name required',
    content: 'Please enter last name',
  },
  [MessageCode.MSG29]: {
    code: MessageCode.MSG29,
    type: MessageType.IN_RED,
    context: 'Role selection required',
    content: 'Please select a role',
  },
  [MessageCode.MSG30]: {
    code: MessageCode.MSG30,
    type: MessageType.TOAST,
    context: 'Auth wrong credentials',
    content: 'Username or password is not correct',
  },
  [MessageCode.MSG31]: {
    code: MessageCode.MSG31,
    type: MessageType.TOAST_SUCCESS,
    context: 'Auth login successful',
    content: 'Login successful! Welcome back.',
  },
  [MessageCode.MSG32]: {
    code: MessageCode.MSG32,
    type: MessageType.TOAST_SUCCESS,
    context: 'Auth registration successful',
    content: 'Registration successful! Please check your email to activate your account.',
  },
  [MessageCode.MSG33]: {
    code: MessageCode.MSG33,
    type: MessageType.TOAST_ERROR,
    context: 'Auth registration failed',
    content: 'Registration failed. Please try again.',
  },
  [MessageCode.MSG34]: {
    code: MessageCode.MSG34,
    type: MessageType.TOAST_SUCCESS,
    context: 'Profile update successful',
    content: 'Profile updated successfully!',
  },
  [MessageCode.MSG35]: {
    code: MessageCode.MSG35,
    type: MessageType.TOAST_ERROR,
    context: 'Profile update failed',
    content: 'Failed to update profile',
  },
  [MessageCode.MSG36]: {
    code: MessageCode.MSG36,
    type: MessageType.TOAST_SUCCESS,
    context: 'Avatar upload successful',
    content: 'Avatar uploaded successfully!',
  },
  [MessageCode.MSG37]: {
    code: MessageCode.MSG37,
    type: MessageType.TOAST_ERROR,
    context: 'Avatar upload failed',
    content: 'Failed to upload avatar',
  },
  [MessageCode.MSG38]: {
    code: MessageCode.MSG38,
    type: MessageType.TOAST_SUCCESS,
    context: 'Password change successful',
    content: 'Password changed successfully',
  },
  [MessageCode.MSG39]: {
    code: MessageCode.MSG39,
    type: MessageType.TOAST_ERROR,
    context: 'Password change failed',
    content: 'Failed to change password',
  },
  [MessageCode.MSG40]: { code: MessageCode.MSG40, type: MessageType.TOAST_ERROR, context: 'User not found', content: 'User not found' },
  [MessageCode.MSG41]: {
    code: MessageCode.MSG41,
    type: MessageType.TOAST_ERROR,
    context: 'Email not found',
    content: 'Email address not found',
  },
  [MessageCode.MSG42]: {
    code: MessageCode.MSG42,
    type: MessageType.TOAST_WARNING,
    context: 'Account not activated',
    content: 'Account has not been activated. Please check your email to activate your account.',
  },
  [MessageCode.MSG43]: {
    code: MessageCode.MSG43,
    type: MessageType.TOAST_WARNING,
    context: 'Account locked',
    content: 'Your account has been locked. Please contact support.',
  },
  [MessageCode.MSG44]: {
    code: MessageCode.MSG44,
    type: MessageType.TOAST_ERROR,
    context: 'Invalid activation key',
    content: 'Invalid activation key',
  },
  [MessageCode.MSG45]: {
    code: MessageCode.MSG45,
    type: MessageType.TOAST_ERROR,
    context: 'Invalid reset key',
    content: 'Invalid reset key',
  },
  [MessageCode.MSG46]: {
    code: MessageCode.MSG46,
    type: MessageType.TOAST_ERROR,
    context: 'Reset key expired',
    content: 'Reset key has expired',
  },
  [MessageCode.MSG47]: {
    code: MessageCode.MSG47,
    type: MessageType.TOAST_WARNING,
    context: 'Session expired',
    content: 'Session expired. Please login again',
  },
  [MessageCode.MSG48]: {
    code: MessageCode.MSG48,
    type: MessageType.TOAST_ERROR,
    context: 'No permission access',
    content: 'You do not have permission to access this function',
  },
  [MessageCode.MSG49]: {
    code: MessageCode.MSG49,
    type: MessageType.TOAST_ERROR,
    context: 'No permission delete',
    content: 'You do not have permission to delete this item',
  },
  [MessageCode.MSG50]: { code: MessageCode.MSG50, type: MessageType.TOAST_ERROR, context: 'Item not found', content: 'Item not found' },
  [MessageCode.MSG51]: {
    code: MessageCode.MSG51,
    type: MessageType.TOAST_ERROR,
    context: 'Data load failed',
    content: 'Failed to load data',
  },
  [MessageCode.MSG52]: {
    code: MessageCode.MSG52,
    type: MessageType.TOAST_ERROR,
    context: 'Network error',
    content: 'Cannot connect to server. Please check if backend is running',
  },
  [MessageCode.MSG53]: { code: MessageCode.MSG53, type: MessageType.TOAST_ERROR, context: 'Validation error', content: 'Validation error' },
  [MessageCode.MSG54]: {
    code: MessageCode.MSG54,
    type: MessageType.TOAST_SUCCESS,
    context: 'User created admin',
    content: 'User created successfully',
  },
  [MessageCode.MSG55]: {
    code: MessageCode.MSG55,
    type: MessageType.TOAST_SUCCESS,
    context: 'User updated admin',
    content: 'User updated successfully',
  },
  [MessageCode.MSG56]: {
    code: MessageCode.MSG56,
    type: MessageType.TOAST_SUCCESS,
    context: 'User deleted admin',
    content: 'User deleted successfully',
  },
  [MessageCode.MSG57]: {
    code: MessageCode.MSG57,
    type: MessageType.TOAST_ERROR,
    context: 'User create failed',
    content: 'Failed to create user',
  },
  [MessageCode.MSG58]: {
    code: MessageCode.MSG58,
    type: MessageType.TOAST_ERROR,
    context: 'User update failed',
    content: 'Failed to update user',
  },
  [MessageCode.MSG59]: {
    code: MessageCode.MSG59,
    type: MessageType.TOAST_ERROR,
    context: 'User delete failed',
    content: 'Failed to delete user',
  },
  [MessageCode.MSG60]: {
    code: MessageCode.MSG60,
    type: MessageType.TOAST_ERROR,
    context: 'User load failed',
    content: 'Failed to load users',
  },
  [MessageCode.MSG61]: {
    code: MessageCode.MSG61,
    type: MessageType.TOAST_SUCCESS,
    context: 'Book created',
    content: 'Book created successfully',
  },
  [MessageCode.MSG62]: {
    code: MessageCode.MSG62,
    type: MessageType.TOAST_SUCCESS,
    context: 'Book updated',
    content: 'Book updated successfully',
  },
  [MessageCode.MSG63]: {
    code: MessageCode.MSG63,
    type: MessageType.TOAST_SUCCESS,
    context: 'Book deleted',
    content: 'Book deleted successfully',
  },
  [MessageCode.MSG64]: {
    code: MessageCode.MSG64,
    type: MessageType.TOAST_ERROR,
    context: 'Book create failed',
    content: 'Failed to create book',
  },
  [MessageCode.MSG65]: {
    code: MessageCode.MSG65,
    type: MessageType.TOAST_ERROR,
    context: 'Book update failed',
    content: 'Failed to update book',
  },
  [MessageCode.MSG66]: {
    code: MessageCode.MSG66,
    type: MessageType.TOAST_ERROR,
    context: 'Book delete failed',
    content: 'Failed to delete book',
  },
  [MessageCode.MSG67]: {
    code: MessageCode.MSG67,
    type: MessageType.TOAST_ERROR,
    context: 'Book load failed',
    content: 'Failed to load books',
  },
  [MessageCode.MSG68]: {
    code: MessageCode.MSG68,
    type: MessageType.TOAST_SUCCESS,
    context: 'Book removed library',
    content: 'Book removed from library',
  },
  [MessageCode.MSG69]: {
    code: MessageCode.MSG69,
    type: MessageType.TOAST_ERROR,
    context: 'Book remove failed',
    content: 'Failed to remove book',
  },
  [MessageCode.MSG70]: {
    code: MessageCode.MSG70,
    type: MessageType.TOAST_INFO,
    context: 'Book processing ai',
    content: 'Book is being processed with AI',
  },
  [MessageCode.MSG71]: {
    code: MessageCode.MSG71,
    type: MessageType.TOAST_ERROR,
    context: 'Book process ai failed',
    content: 'Failed to process book with AI',
  },
  [MessageCode.MSG72]: {
    code: MessageCode.MSG72,
    type: MessageType.TOAST_SUCCESS,
    context: 'Chapter created',
    content: 'Chapter created successfully',
  },
  [MessageCode.MSG73]: {
    code: MessageCode.MSG73,
    type: MessageType.TOAST_SUCCESS,
    context: 'Chapter updated',
    content: 'Chapter updated successfully',
  },
  [MessageCode.MSG74]: {
    code: MessageCode.MSG74,
    type: MessageType.TOAST_SUCCESS,
    context: 'Chapter deleted',
    content: 'Chapter deleted successfully',
  },
  [MessageCode.MSG75]: {
    code: MessageCode.MSG75,
    type: MessageType.TOAST_ERROR,
    context: 'Chapter delete failed',
    content: 'Failed to delete chapter',
  },
  [MessageCode.MSG76]: {
    code: MessageCode.MSG76,
    type: MessageType.TOAST_SUCCESS,
    context: 'Chapter saved library',
    content: 'Chapter has been saved to your library',
  },
  [MessageCode.MSG77]: {
    code: MessageCode.MSG77,
    type: MessageType.TOAST_SUCCESS,
    context: 'Chapter removed library',
    content: 'Chapter has been removed from your library',
  },
  [MessageCode.MSG78]: {
    code: MessageCode.MSG78,
    type: MessageType.TOAST_SUCCESS,
    context: 'Content saved',
    content: 'Content saved successfully',
  },
  [MessageCode.MSG79]: {
    code: MessageCode.MSG79,
    type: MessageType.TOAST_ERROR,
    context: 'Content save failed',
    content: 'Failed to save content',
  },
  [MessageCode.MSG80]: {
    code: MessageCode.MSG80,
    type: MessageType.TOAST_SUCCESS,
    context: 'File uploaded',
    content: 'File uploaded successfully',
  },
  [MessageCode.MSG81]: {
    code: MessageCode.MSG81,
    type: MessageType.TOAST_ERROR,
    context: 'File upload failed',
    content: 'Failed to upload file',
  },
  [MessageCode.MSG82]: {
    code: MessageCode.MSG82,
    type: MessageType.TOAST_SUCCESS,
    context: 'Flashcard added',
    content: 'Added to flashcards successfully',
  },
  [MessageCode.MSG83]: {
    code: MessageCode.MSG83,
    type: MessageType.TOAST_ERROR,
    context: 'Flashcard add failed',
    content: 'Failed to add to flashcards',
  },
  [MessageCode.MSG84]: {
    code: MessageCode.MSG84,
    type: MessageType.TOAST_SUCCESS,
    context: 'Flashcard deleted',
    content: 'Flashcard deleted successfully',
  },
  [MessageCode.MSG85]: {
    code: MessageCode.MSG85,
    type: MessageType.TOAST_ERROR,
    context: 'Flashcard delete failed',
    content: 'Failed to delete flashcard',
  },
  [MessageCode.MSG86]: {
    code: MessageCode.MSG86,
    type: MessageType.TOAST_SUCCESS,
    context: 'Note saved',
    content: 'Notes updated successfully',
  },
  [MessageCode.MSG87]: {
    code: MessageCode.MSG87,
    type: MessageType.TOAST_SUCCESS,
    context: 'Note deleted',
    content: 'Note deleted successfully',
  },
  [MessageCode.MSG88]: {
    code: MessageCode.MSG88,
    type: MessageType.TOAST_ERROR,
    context: 'Note save failed',
    content: 'Failed to save note',
  },
  [MessageCode.MSG89]: {
    code: MessageCode.MSG89,
    type: MessageType.TOAST_ERROR,
    context: 'Note delete failed',
    content: 'Failed to delete note',
  },
  [MessageCode.MSG90]: {
    code: MessageCode.MSG90,
    type: MessageType.TOAST_ERROR,
    context: 'Note load failed',
    content: 'Failed to load notes',
  },
  [MessageCode.MSG91]: {
    code: MessageCode.MSG91,
    type: MessageType.TOAST_SUCCESS,
    context: 'Comment posted',
    content: 'Comment posted successfully',
  },
  [MessageCode.MSG92]: {
    code: MessageCode.MSG92,
    type: MessageType.TOAST_ERROR,
    context: 'Comment post failed',
    content: 'Failed to post comment',
  },
  [MessageCode.MSG93]: {
    code: MessageCode.MSG93,
    type: MessageType.TOAST_SUCCESS,
    context: 'Reply posted',
    content: 'Reply posted successfully',
  },
  [MessageCode.MSG94]: {
    code: MessageCode.MSG94,
    type: MessageType.TOAST_ERROR,
    context: 'Reply post failed',
    content: 'Failed to post reply',
  },
  [MessageCode.MSG95]: {
    code: MessageCode.MSG95,
    type: MessageType.TOAST_SUCCESS,
    context: 'Comment updated',
    content: 'Comment updated successfully',
  },
  [MessageCode.MSG96]: {
    code: MessageCode.MSG96,
    type: MessageType.TOAST_ERROR,
    context: 'Comment update failed',
    content: 'Failed to update comment',
  },
  [MessageCode.MSG97]: {
    code: MessageCode.MSG97,
    type: MessageType.TOAST_SUCCESS,
    context: 'Comment deleted',
    content: 'Comment deleted successfully',
  },
  [MessageCode.MSG98]: {
    code: MessageCode.MSG98,
    type: MessageType.TOAST_ERROR,
    context: 'Comment delete failed',
    content: 'Failed to delete comment',
  },
  [MessageCode.MSG99]: { code: MessageCode.MSG99, type: MessageType.IN_LINE, context: 'Comment empty', content: 'Comment cannot be empty' },
  [MessageCode.MSG100]: {
    code: MessageCode.MSG100,
    type: MessageType.TOAST_SUCCESS,
    context: 'Review submitted',
    content: 'Review submitted successfully',
  },
  [MessageCode.MSG101]: {
    code: MessageCode.MSG101,
    type: MessageType.TOAST_ERROR,
    context: 'Review submit failed',
    content: 'Failed to submit review',
  },
  [MessageCode.MSG102]: {
    code: MessageCode.MSG102,
    type: MessageType.TOAST_SUCCESS,
    context: 'Review liked',
    content: 'Review liked successfully',
  },
  [MessageCode.MSG103]: {
    code: MessageCode.MSG103,
    type: MessageType.TOAST_ERROR,
    context: 'Review like failed',
    content: 'Failed to like review',
  },
  [MessageCode.MSG104]: {
    code: MessageCode.MSG104,
    type: MessageType.TOAST_SUCCESS,
    context: 'Review deleted',
    content: 'Review deleted successfully',
  },
  [MessageCode.MSG105]: {
    code: MessageCode.MSG105,
    type: MessageType.TOAST_ERROR,
    context: 'Review delete failed',
    content: 'Failed to delete review',
  },
  [MessageCode.MSG106]: {
    code: MessageCode.MSG106,
    type: MessageType.TOAST_SUCCESS,
    context: 'Added favorites',
    content: 'Added to favorites',
  },
  [MessageCode.MSG107]: {
    code: MessageCode.MSG107,
    type: MessageType.TOAST_SUCCESS,
    context: 'Removed favorites',
    content: 'Removed from favorites',
  },
  [MessageCode.MSG108]: {
    code: MessageCode.MSG108,
    type: MessageType.TOAST_ERROR,
    context: 'Favorites update failed',
    content: 'Failed to update favorites',
  },
  [MessageCode.MSG109]: {
    code: MessageCode.MSG109,
    type: MessageType.TOAST_SUCCESS,
    context: 'Progress updated',
    content: 'Progress updated successfully',
  },
  [MessageCode.MSG110]: {
    code: MessageCode.MSG110,
    type: MessageType.TOAST_ERROR,
    context: 'Progress update failed',
    content: 'Failed to update progress',
  },
  [MessageCode.MSG111]: {
    code: MessageCode.MSG111,
    type: MessageType.TOAST_SUCCESS,
    context: 'Achievement unlocked',
    content: "Congratulations! You've unlocked a new achievement!",
  },
  [MessageCode.MSG112]: {
    code: MessageCode.MSG112,
    type: MessageType.TOAST_SUCCESS,
    context: 'Notification settings saved',
    content: 'Notification settings saved',
  },
  [MessageCode.MSG113]: {
    code: MessageCode.MSG113,
    type: MessageType.TOAST_ERROR,
    context: 'Notification settings failed',
    content: 'Failed to save notification settings',
  },
  [MessageCode.MSG114]: {
    code: MessageCode.MSG114,
    type: MessageType.TOAST_SUCCESS,
    context: 'Account settings saved',
    content: 'Account settings saved successfully!',
  },
  [MessageCode.MSG115]: {
    code: MessageCode.MSG115,
    type: MessageType.TOAST_ERROR,
    context: 'Account settings failed',
    content: 'Failed to save account settings',
  },
  [MessageCode.MSG116]: {
    code: MessageCode.MSG116,
    type: MessageType.TOAST_SUCCESS,
    context: 'Password updated',
    content: 'Password updated successfully!',
  },
  [MessageCode.MSG117]: {
    code: MessageCode.MSG117,
    type: MessageType.TOAST_ERROR,
    context: 'Password change error',
    content: 'Failed to change password. Please check your current password.',
  },
  [MessageCode.MSG118]: {
    code: MessageCode.MSG118,
    type: MessageType.TOAST_SUCCESS,
    context: 'Course created',
    content: 'Course created successfully',
  },
  [MessageCode.MSG119]: {
    code: MessageCode.MSG119,
    type: MessageType.TOAST_SUCCESS,
    context: 'Course updated',
    content: 'Course updated successfully',
  },
  [MessageCode.MSG120]: {
    code: MessageCode.MSG120,
    type: MessageType.TOAST_SUCCESS,
    context: 'Course deleted',
    content: 'Course deleted successfully',
  },
  [MessageCode.MSG121]: {
    code: MessageCode.MSG121,
    type: MessageType.TOAST_ERROR,
    context: 'Course delete failed',
    content: 'Failed to delete course',
  },
  [MessageCode.MSG122]: {
    code: MessageCode.MSG122,
    type: MessageType.TOAST_ERROR,
    context: 'Course load failed',
    content: 'Failed to load courses',
  },
  [MessageCode.MSG123]: {
    code: MessageCode.MSG123,
    type: MessageType.IN_LINE,
    context: 'Book selection required',
    content: 'Please select a book first',
  },
  [MessageCode.MSG124]: {
    code: MessageCode.MSG124,
    type: MessageType.IN_LINE,
    context: 'Chapter selection required',
    content: 'Please select a chapter first',
  },
  [MessageCode.MSG125]: { code: MessageCode.MSG125, type: MessageType.IN_LINE, context: 'No data available', content: 'No data available' },
  [MessageCode.MSG126]: { code: MessageCode.MSG126, type: MessageType.IN_LINE, context: 'Loading', content: 'Loading...' },
  [MessageCode.MSG127]: { code: MessageCode.MSG127, type: MessageType.IN_LINE, context: 'Login required', content: 'Login required' },
  [MessageCode.MSG128]: { code: MessageCode.MSG128, type: MessageType.IN_LINE, context: 'Invalid note', content: 'Invalid note' },
  [MessageCode.MSG129]: {
    code: MessageCode.MSG129,
    type: MessageType.CONFIRM_DIALOG,
    context: 'Delete user confirmation',
    content: 'Are you sure you want to delete this user? This action cannot be undone.',
  },
  [MessageCode.MSG130]: {
    code: MessageCode.MSG130,
    type: MessageType.CONFIRM_DIALOG,
    context: 'Delete book confirmation',
    content: 'Are you sure you want to delete this book? All chapters will be removed.',
  },
  [MessageCode.MSG131]: {
    code: MessageCode.MSG131,
    type: MessageType.CONFIRM_DIALOG,
    context: 'Delete chapter confirmation',
    content: 'Are you sure you want to delete this chapter? All content will be removed.',
  },
  [MessageCode.MSG132]: {
    code: MessageCode.MSG132,
    type: MessageType.CONFIRM_DIALOG,
    context: 'Delete course confirmation',
    content: 'Are you sure you want to delete this course? This action cannot be undone.',
  },
  [MessageCode.MSG133]: {
    code: MessageCode.MSG133,
    type: MessageType.CONFIRM_DIALOG,
    context: 'Remove book from library',
    content: 'Are you sure you want to remove this book from your library?',
  },
  [MessageCode.MSG134]: {
    code: MessageCode.MSG134,
    type: MessageType.EMAIL_NOTIFICATION,
    context: 'Account activation',
    content: 'Your account has been successfully activated. Welcome to our learning community!',
  },
  [MessageCode.MSG135]: {
    code: MessageCode.MSG135,
    type: MessageType.EMAIL_NOTIFICATION,
    context: 'Password reset request',
    content: 'We received a request to reset your password. Click the link to proceed.',
  },
  [MessageCode.MSG136]: {
    code: MessageCode.MSG136,
    type: MessageType.EMAIL_NOTIFICATION,
    context: 'Password changed',
    content: 'Your password has been successfully changed.',
  },
  [MessageCode.MSG137]: {
    code: MessageCode.MSG137,
    type: MessageType.EMAIL_NOTIFICATION,
    context: 'Account locked',
    content: 'Your account has been locked due to multiple failed login attempts.',
  },
  [MessageCode.MSG138]: {
    code: MessageCode.MSG138,
    type: MessageType.TOAST,
    context: 'Password reset sent',
    content: 'Password reset link has been sent to your email.',
  },
  [MessageCode.MSG139]: {
    code: MessageCode.MSG139,
    type: MessageType.TOAST_SUCCESS,
    context: 'Contact message sent',
    content: 'Message sent successfully!',
  },
  [MessageCode.MSG140]: {
    code: MessageCode.MSG140,
    type: MessageType.TOAST_ERROR,
    context: 'Contact send failed',
    content: 'Failed to send message',
  },
  [MessageCode.MSG141]: {
    code: MessageCode.MSG141,
    type: MessageType.TOAST_ERROR,
    context: 'Analytics load failed',
    content: 'Failed to load analytics',
  },
  [MessageCode.MSG142]: {
    code: MessageCode.MSG142,
    type: MessageType.TOAST_ERROR,
    context: 'Exercise load failed',
    content: 'Failed to load exercise',
  },
  [MessageCode.MSG143]: {
    code: MessageCode.MSG143,
    type: MessageType.TOAST_SUCCESS,
    context: 'Exercise correct answer',
    content: 'Correct! Your answer is right!',
  },
  [MessageCode.MSG144]: {
    code: MessageCode.MSG144,
    type: MessageType.TOAST_WARNING,
    context: 'Exercise incorrect answer',
    content: 'Incorrect. Please try again!',
  },
  [MessageCode.MSG145]: {
    code: MessageCode.MSG145,
    type: MessageType.TOAST_INFO,
    context: 'Recording stopped',
    content: 'Recording has been stopped.',
  },
  [MessageCode.MSG146]: {
    code: MessageCode.MSG146,
    type: MessageType.TOAST_SUCCESS,
    context: 'Exercise submitted',
    content: 'Exercise has been submitted!',
  },
  [MessageCode.MSG147]: {
    code: MessageCode.MSG147,
    type: MessageType.ERROR_PAGE,
    context: 'Bad request 400',
    content: 'Bad request. The request could not be understood by the server.',
  },
  [MessageCode.MSG148]: {
    code: MessageCode.MSG148,
    type: MessageType.ERROR_PAGE,
    context: 'Forbidden 403',
    content: 'You are not authorized to access this page.',
  },
  [MessageCode.MSG149]: {
    code: MessageCode.MSG149,
    type: MessageType.ERROR_PAGE,
    context: 'Not found 404',
    content: 'The page you are looking for does not exist.',
  },
  [MessageCode.MSG150]: {
    code: MessageCode.MSG150,
    type: MessageType.ERROR_PAGE,
    context: 'Method not allowed 405',
    content: 'The HTTP method you used is not supported for this URL.',
  },
  [MessageCode.MSG151]: {
    code: MessageCode.MSG151,
    type: MessageType.ERROR_PAGE,
    context: 'Internal server error 500',
    content: 'Internal server error. Please try again later.',
  },
  [MessageCode.MSG152]: {
    code: MessageCode.MSG152,
    type: MessageType.ERROR_PAGE,
    context: 'Server not reachable',
    content: 'Server is not reachable. Please check your connection.',
  },
  [MessageCode.MSG153]: {
    code: MessageCode.MSG153,
    type: MessageType.ERROR_PAGE,
    context: 'Concurrency failure',
    content: 'Another user modified this data. Your changes were rejected.',
  },
};
