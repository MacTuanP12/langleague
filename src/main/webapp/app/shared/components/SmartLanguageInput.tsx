import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { AppstoreOutlined } from '@ant-design/icons';
import './SmartLanguageInput.css';

const { TextArea } = Input;

export interface SmartLanguageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  language?: 'korean' | 'japanese' | 'chinese' | 'english';
  type?: 'input' | 'textarea';
  autoSize?: { minRows?: number; maxRows?: number };
  style?: React.CSSProperties;
  className?: string;
  autoCorrect?: 'on' | 'off';
  autoCapitalize?: 'on' | 'off' | 'none';
}

/**
 * Smart Language Input Component with Virtual Keyboard Support
 * Optimized for desktop users learning Asian languages (Korean, Japanese, Chinese)
 * without needing to install system keyboards
 */
const SmartLanguageInput: React.FC<SmartLanguageInputProps> = ({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  language = 'korean',
  type = 'input',
  autoSize,
  style,
  className,
  autoCorrect = 'off',
  autoCapitalize = 'none',
}) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [layoutName, setLayoutName] = useState('default');
  const keyboardRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  // Korean keyboard layout
  const koreanLayout = {
    default: [
      '\u3142 \u3148 \u3137 \u3131 \u3145 \u315B \u3155 \u3151 \u3150 \u3154 {bksp}',
      '\u3141 \u3134 \u3147 \u3139 \u314E \u3157 \u3153 \u314F \u3152 \u3156',
      '{shift} \u3138 \u314A \u314B \u314C \u314D \u314F \u3160 \u315C {shift}',
      '{space}',
    ],
    shift: [
      '\u3143 \u3149 \u3138 \u3132 \u3146 \u315C \u3156 \u3152 \u3151 \u3155 {bksp}',
      '\u3142 \u3135 \u3148 \u313A \u314F \u3158 \u3154 \u3150 \u3153 \u3157',
      '{shift} \u3139 \u314B \u314C \u314D \u314E \u3150 \u3161 \u315D {shift}',
      '{space}',
    ],
  };

  // Japanese Hiragana keyboard layout
  const japaneseLayout = {
    default: [
      '\u3042 \u3044 \u3046 \u3048 \u304A \u304B \u304D \u304F \u3051 \u3053 {bksp}',
      '\u3055 \u3057 \u3059 \u305B \u305D \u305F \u3061 \u3064 \u3066 \u3068',
      '{shift} \u306A \u306B \u306C \u306D \u306E \u306F \u3072 \u3075 \u3078 \u307B {shift}',
      '\u307E \u307F \u3080 \u3081 \u3082 \u3084 \u3086 \u3088 \u3089 \u308A',
      '\u308B \u308C \u308D \u308F \u3092 \u3093 {space}',
    ],
    shift: [
      '\u30A2 \u30A4 \u30A6 \u30A8 \u30AA \u30AB \u30AD \u30AF \u30B1 \u30B3 {bksp}',
      '\u30B5 \u30B7 \u30B9 \u30BB \u30BD \u30BF \u30C1 \u30C4 \u30C6 \u30C8',
      '{shift} \u30CA \u30CB \u30CC \u30CD \u30CE \u30CF \u30D2 \u30D5 \u30D8 \u30DB {shift}',
      '\u30DE \u30DF \u30E0 \u30E1 \u30E2 \u30E4 \u30E6 \u30E8 \u30E9 \u30EA',
      '\u30EB \u30EC \u30ED \u30EF \u30F2 \u30F3 {space}',
    ],
  };

  // Chinese Pinyin keyboard layout (simplified)
  const chineseLayout = {
    default: ['q w e r t y u i o p {bksp}', 'a s d f g h j k l', '{shift} z x c v b n m {shift}', '{space}'],
    shift: ['Q W E R T Y U I O P {bksp}', 'A S D F G H J K L', '{shift} Z X C V B N M {shift}', '{space}'],
  };

  // English keyboard layout
  const englishLayout = {
    default: ['q w e r t y u i o p {bksp}', 'a s d f g h j k l', '{shift} z x c v b n m {shift}', '{space}'],
    shift: ['Q W E R T Y U I O P {bksp}', 'A S D F G H J K L', '{shift} Z X C V B N M {shift}', '{space}'],
  };

  const getKeyboardLayout = () => {
    switch (language) {
      case 'korean':
        return koreanLayout;
      case 'japanese':
        return japaneseLayout;
      case 'chinese':
        return chineseLayout;
      case 'english':
      default:
        return englishLayout;
    }
  };

  const onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') {
      setLayoutName(layoutName === 'default' ? 'shift' : 'default');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (keyboardRef.current) {
      keyboardRef.current.setInput(newValue);
    }
  };

  const handleKeyboardChange = (input: string) => {
    onChange(input);
  };

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
  };

  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setInput(value);
    }
  }, [value]);

  const commonInputProps = {
    value,
    onChange: handleInputChange,
    placeholder,
    disabled,
    autoCorrect,
    autoCapitalize,
    style: {
      ...style,
      fontFamily:
        language === 'korean'
          ? "'Noto Sans KR', sans-serif"
          : language === 'japanese'
            ? "'Noto Sans JP', sans-serif"
            : language === 'chinese'
              ? "'Noto Sans SC', sans-serif"
              : 'inherit',
    },
    className,
    ref: inputRef,
  };

  return (
    <div className="smart-language-input-container">
      <div style={{ position: 'relative' }}>
        {type === 'textarea' ? <TextArea {...commonInputProps} autoSize={autoSize} /> : <Input {...commonInputProps} />}

        {!disabled && (
          <button
            type="button"
            onClick={toggleKeyboard}
            className={`keyboard-toggle-btn ${showKeyboard ? 'active' : ''}`}
            title={showKeyboard ? 'Ẩn bàn phím' : 'Hiện bàn phím'}
            style={{
              position: 'absolute',
              right: '8px',
              top: type === 'textarea' ? '8px' : '50%',
              transform: type === 'textarea' ? 'none' : 'translateY(-50%)',
              border: 'none',
              background: showKeyboard ? '#1890ff' : '#f0f0f0',
              color: showKeyboard ? '#fff' : '#595959',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s',
              zIndex: 1,
            }}
          >
            <AppstoreOutlined style={{ fontSize: '16px' }} />
          </button>
        )}
      </div>

      {showKeyboard && !disabled && (
        <div className="virtual-keyboard-container" style={{ marginTop: '12px' }}>
          <Keyboard
            keyboardRef={(r: any) => (keyboardRef.current = r)}
            layoutName={layoutName}
            layout={getKeyboardLayout()}
            onChange={handleKeyboardChange}
            onKeyPress={onKeyPress}
            theme="hg-theme-default hg-layout-default"
            display={{
              '{bksp}': '⌫',
              '{shift}': '⇧',
              '{space}': '　　　　　',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SmartLanguageInput;
