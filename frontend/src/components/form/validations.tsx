import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useValueRef } from '../../hooks/use-value-ref';
import { z, ZodType } from 'zod';

interface DescriptionObj<T> {
  value: T;
  errorMessage?: string;
}

type Description<T> = T | DescriptionObj<T>;
type CustomValidator = (value: unknown) => string | undefined;
export type ContentType = string[] | 'image' | 'document' | 'attachment' | 'reportTemplate';

export interface Validation {
  required?: Description<boolean>;
  minValue?: Description<number | Date>;
  maxValue?: Description<number | Date>;
  minLength?: Description<number>;
  maxLength?: Description<number>;
  format?: Description<RegExp>;
  email?: Description<boolean>;
  contentType?: Description<ContentType>;
  custom?: CustomValidator;
}

export { useValidate };

function useValidate(validation: Validation | undefined) {
  const { t } = useTranslation();
  const validationRef = useValueRef(validation);

  return useCallback((value: any) => validate(value, validationRef.current, t), [validationRef, t]);
}

function validate(
  value: any,
  validation: Validation | undefined,
  t: TFunction,
): string | undefined {
  if (!validation) return undefined;

  for (const entry of Object.entries(validation)) {
    const key = entry[0] as keyof Validation;

    if (key === 'custom') {
      const validatorFn = entry[1] as CustomValidator;
      const error = validatorFn(value);

      return error;
    }

    const [arg, message] = parseDescription(entry[1] as Description<any>);

    switch (key) {
      case 'required': {
        const error = validateRequired(arg, { value, message, t });
        if (error) return error;
        break;
      }
      case 'minLength': {
        const error = validateMinLength(arg, { value, message, t });
        if (error) return error;
        break;
      }

      case 'maxLength': {
        const error = validateMaxLength(arg, { value, message, t });
        if (error) return error;
        break;
      }

      case 'minValue': {
        const error = validateMinValue(arg, { value, message, t });
        if (error) return error;
        break;
      }

      case 'maxValue': {
        const error = validateMaxValue(arg, { value, message, t });
        if (error) return error;
        break;
      }

      case 'format': {
        const error = validateFormat(arg, { value, message, t });
        if (error) return error;
        break;
      }

      case 'email': {
        const error = validateEmail(arg, { value, message, t });
        if (error) return error;
        break;
      }

      case 'contentType': {
        if (value instanceof File || (Array.isArray(value) && value[0] instanceof File)) {
          const types = arg as ContentType;
          const validator = createFileValidator(types, Array.isArray(value), t);
          const error = validator(value);
          if (error) {
            return message || error;
          }
        }
        break;
      }

      default:
        break;
    }
  }
  return undefined;
}

interface ValidatorContext {
  value: unknown;
  message: string | undefined;
  t: TFunction;
}

function validateRequired(
  enabled: boolean,
  { value, message, t }: ValidatorContext,
): string | undefined {
  if (
    enabled &&
    (value === null ||
      value === undefined ||
      ((isArray(value) || isString(value)) && value.length === 0))
  ) {
    return message || t('formValidationRequired', 'This field is required');
  }
  return undefined;
}

function validateMinLength(
  min: number,
  { value, message, t }: ValidatorContext,
): string | undefined {
  if ((isString(value) || isArray(value)) && value.length < min) {
    return message || t('formValidationMinLength', `Must be at least ${min} characters`);
  }
  return undefined;
}

function validateMaxLength(
  max: number,
  { value, message, t }: ValidatorContext,
): string | undefined {
  if ((isString(value) || isArray(value)) && value.length > max) {
    return message || t('formValidationMaxLength', `Must be no more than ${max} characters`);
  }
  return undefined;
}

function validateMinValue(
  min: number | Date,
  { value, message, t }: ValidatorContext,
): string | undefined {
  if ((isNumber(value) || isDate(value)) && value < min) {
    return message || t('formValidationMinValue', `Must be at least ${min}`);
  }
  return undefined;
}

function validateMaxValue(
  max: number | Date,
  { value, message, t }: ValidatorContext,
): string | undefined {
  if ((isNumber(value) || isDate(value)) && value > max) {
    return message || t('formValidationMaxValue', `Must be no more than ${max}`);
  }
  return undefined;
}

function validateFormat(
  regex: RegExp,
  { value, message, t }: ValidatorContext,
): string | undefined {
  if ((isString(value) || isNumber(value)) && !regex.test(String(value))) {
    return message || t('formValidationFormat', 'Invalid format');
  }
  return undefined;
}

function validateEmail(
  enabled: boolean,
  { value, message, t }: ValidatorContext,
): string | undefined {
  if (enabled && isString(value) && value !== '') {
    const regex = /^[\w\-.]+@(?:[\w-]+\.)+[\w-]{2,}$/;
    if (!regex.test(String(value))) {
      return message || t('formValidationEmail', 'Invalid email address');
    }
  }
  return undefined;
}

export function createFileValidator(
  contentType: ContentType,
  multiple: boolean = false,
  t: TFunction,
) {
  return (value: unknown): string | undefined => {
    if (value === null || value === undefined) {
      return undefined;
    }

    try {
      const schema = getFilesSchema(contentType, multiple, t);
      const result = schema.safeParse(value);

      if (!result.success) {
        return result.error.errors[0]?.message || 'Invalid file';
      }
      return undefined;
    } catch (e) {
      return 'File validation error';
    }
  };
}

function parseDescription(arg: Description<any>): [any, string | undefined] {
  if (isDescriptionObject(arg)) {
    return [arg.value, arg.errorMessage];
  } else {
    return [arg, undefined];
  }
}

export function isDescriptionObject<T>(arg: Description<T>): arg is DescriptionObj<T> {
  return arg !== null && typeof arg === 'object' && 'value' in arg;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function fileSchema(contentType: ContentType, t: TFunction): ZodType<File | File[]> {
  let types: string[];
  if (contentType === 'image') types = imageExtensions;
  else if (contentType === 'document') types = documentExtensions;
  else if (contentType === 'reportTemplate') types = reportTemplateExtensions;
  else if (contentType === 'attachment')
    types = [...imageExtensions, ...documentExtensions, ...videoExtensions];
  else types = contentType.map((e) => e.toLowerCase());

  return (
    z
      .instanceof(File)
      // validate file size
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: t('uploadInvalidSize', { maxSize: MAX_FILE_SIZE / (1024 * 1024) }),
      })
      // validate file extension and MIME type
      .refine(
        (file) => {
          const name = file.name.toLowerCase();
          const ext = name.slice(name.lastIndexOf('.'));
          if (!types.includes(ext)) return false;

          const key = ext.replace('.', '');
          const pattern = fileTypeMimeMap[key];
          return pattern ? pattern.test(file.type) : true;
        },
        {
          message: t('uploadInvalidContentType', { types: types.join(', ') }),
        },
      )
  );
}

export function getFilesSchema(contentType: ContentType, multiple: boolean = false, t: TFunction) {
  if (multiple) {
    return z.array(fileSchema(contentType, t));
  } else {
    return fileSchema(contentType, t);
  }
}

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const reportTemplateExtensions = ['.tlf'];

export const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.tiff', '.bmp', '.webp'];

export const documentExtensions = [
  '.txt',
  '.csv',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.odp',
  '.ods',
  '.odt',
];

export const videoExtensions = ['.mp4'];

export const fileTypeMimeMap: Record<string, RegExp> = {
  tlf: /^$/,
  png: /^image\/png$/,
  jpg: /^image\/jpe?g$/,
  jpeg: /^image\/jpe?g$/,
  gif: /^image\/gif$/,
  tiff: /^image\/tiff$/,
  tif: /^image\/tiff$/,
  bmp: /^image\/bmp$/,
  webp: /^image\/webp$/,
  txt: /^text\/plain$/,
  csv: /^text\/csv$/,
  pdf: /^application\/pdf$/,
  doc: /^application\/msword$/,
  docx: /^application\/vnd.openxmlformats-officedocument.wordprocessingml.document$/,
  xls: /^application\/vnd.ms-excel$/,
  xlsx: /^application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet$/,
  ppt: /^application\/vnd.ms-powerpoint$/,
  pptx: /^application\/vnd.openxmlformats-officedocument.presentationml.presentation$/,
  odp: /^application\/vnd.oasis.opendocument.presentation$/,
  ods: /^application\/vnd.oasis.opendocument.spreadsheet$/,
  odt: /^application\/vnd.oasis.opendocument.text$/,
  mp4: /^video\/mp4$/,
  mov: /^video\/quicktime$/,
};
