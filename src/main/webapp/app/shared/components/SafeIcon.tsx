import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

/**
 * Safe wrapper for FontAwesomeIcon to prevent "Could not find icon Object" errors.
 * It validates the icon prop at runtime and logs errors if an invalid object is passed.
 */
export const SafeIcon: React.FC<FontAwesomeIconProps> = props => {
  const { icon, ...rest } = props;

  // 1. Check if icon is null or undefined
  if (!icon) {
    console.warn('SafeIcon: Icon prop is null or undefined');
    return null;
  }

  // 2. Check if icon is a valid string (e.g., "user", "home")
  if (typeof icon === 'string') {
    return <FontAwesomeIcon icon={icon as IconProp} {...rest} />;
  }

  // 3. Check if icon is a valid array (e.g., ["fas", "user"])
  if (Array.isArray(icon)) {
    if (icon.length > 0 && typeof icon[0] === 'string') {
      return <FontAwesomeIcon icon={icon as IconProp} {...rest} />;
    }
  }

  // 4. Check if icon is a valid IconDefinition object (has prefix and iconName)
  // FontAwesome IconDefinition looks like: { prefix: 'fas', iconName: 'user', icon: [...] }
  if (typeof icon === 'object') {
    const iconObj = icon as unknown as Record<string, unknown>;
    if (iconObj.prefix && iconObj.iconName && Array.isArray(iconObj.icon)) {
      return <FontAwesomeIcon icon={icon as IconProp} {...rest} />;
    }

    // 5. ERROR CASE: It's an object but NOT a valid icon definition
    // This catches the "Could not find icon Object" scenario
    console.error('SafeIcon Error: Invalid icon object detected!', icon);

    // Render a fallback UI (Red warning icon) to make it visible on screen
    return (
      <span title="Invalid Icon" style={{ color: 'red', border: '1px dashed red', padding: '2px', display: 'inline-block' }}>
        ⚠️
      </span>
    );
  }

  // Fallback for other cases
  return <FontAwesomeIcon icon={icon} {...rest} />;
};

export default SafeIcon;
