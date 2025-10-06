import { Dispatch, ReactNode, SetStateAction } from "react";

export type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  minHeight?: number;
};

export type BaseField = {
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: ReactNode;
  information?: string;
};

export type FieldSchema =
  | (BaseField & {
      component: "text";
      initial: string;
      autoFill?: AutoFillField;
      min?: number;
      max?: number;
    })
  | (BaseField & {
      component: "number";
      initial: number;
      min?: number;
      max?: number;
    });

export type Schema = Record<string, FieldSchema>;

// type Values<T extends Schema> = {
//   [K in keyof T]: T[K]["type"] extends "number"
//     ? T[K]["required"] extends true
//       ? number
//       : number | undefined
//     : T[K]["type"] extends "text"
//     ? T[K]["required"] extends true
//       ? string
//       : string | undefined
//     : unknown;
// };

export type Values<T extends Schema> = {
  [K in keyof T]: T[K]["required"] extends true ? T[K]["initial"] : T[K]["initial"] | undefined;
};

export type FormProps<T extends Schema> = {
  // FORM FIELDS
  title?: string | ReactNode;
  description?: ReactNode;
  onSubmit: (values: Values<T>) => void | Promise<void>;
  schema: T;
  // DIALOG FIELDS
  open?: boolean;
  close?: boolean;
  width?: number;
  height?: number;
  minHeight?: number;
  onClose: () => void;
};

export type Errors<T extends Schema> = Partial<Record<keyof T, string[] | undefined>>;
export type Touched<T extends Schema> = Partial<Record<keyof T, boolean>>;

export type FormContextProps = {
  open: <T extends Schema>(props: FormProps<T>) => number;
  close: (index: number) => void;
};

export interface FormInstance<T extends Schema> {
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;

  values: Values<T>;
  setFieldValue: <K extends keyof T>(field: K, value: Values<T>[K]) => void;
  setValues: React.Dispatch<React.SetStateAction<Values<T>>>;

  errors: Errors<T>;
  setFieldError: <K extends keyof T>(field: K, message: string) => void;
  setErrors: Dispatch<SetStateAction<Partial<Record<keyof T, string[]>>>>;

  touched: Touched<T>;
  setFieldTouched: <K extends keyof T>(field: K, value: boolean) => void;
  setTouched: Dispatch<SetStateAction<Partial<Record<keyof T, boolean>>>>;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;

  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  handleSubmit: (e: React.FormEvent) => void;
  validate: () => boolean;
  resetForm: () => void;
  submit: () => void;

  // handleChange: <K extends keyof T>(field: K, value: Values<T>[K]) => void;
  // handleBlur: <K extends keyof T>(field: K) => void;
  getFieldProps: <K extends keyof T>(
    field: K
  ) => {
    name: K;
    value: Values<T>[K];
    id: K;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete: AutoFill | undefined;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  };
}
