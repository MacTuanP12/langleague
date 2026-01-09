import * as React from 'react';
import { TranslatorContext } from 'react-jhipster';
import dayjs from 'dayjs';

export interface IDurationFormat {
  value: string | number;
  blankOnInvalid?: boolean;
  locale?: string;
}

export const DurationFormat = ({ value, blankOnInvalid, locale }: IDurationFormat) => {
  if (blankOnInvalid && !value) {
    return null;
  }

  if (!locale) {
    locale = TranslatorContext.context.locale;
  }

  const valueString = typeof value === 'number' ? value.toString() : value;
  const durationValue = typeof value === 'number' ? value : parseInt(value, 10);

  return (
    <span title={valueString}>
      {dayjs
        .duration(durationValue)
        .locale(locale || 'en')
        .humanize()}
    </span>
  );
};
