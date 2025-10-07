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

export type InputProps<T extends Schema, K extends keyof T> = { field: K; props: T[K]; form: FormInstance<T>; error: string[] | undefined };

export type BaseField = {
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: ReactNode;
  information?: string;
  disabled?: boolean;
};

export type FieldSchema =
  | (BaseField & {
      component: "text";
      value: string;
      autoFill?: AutoFillField;
      min?: number;
      max?: number;
    })
  | (BaseField & {
      component: "email";
      value: string;
    })
  | (BaseField & {
      component: "search";
      value: string;
      autoFill?: AutoFillField;
    })
  | (BaseField & {
      component: "number";
      value: number;
      min?: number;
      max?: number;
      step?: number;
    })
  | (BaseField & {
      component: "password";
      value: string;
      min?: number;
      max?: number;
    })
  | (BaseField & {
      component: "date";
      value: string;
      min?: string;
      max?: string;
    })
  | (BaseField & {
      component: "datetime";
      value: string;
      min?: string;
      max?: string;
    })
  | (BaseField & {
      component: "time";
      value: string;
      min?: string;
      max?: string;
    })
  | (BaseField & {
      component: "week";
      value: number;
      min?: number;
      max?: number;
    })
  | (BaseField & {
      component: "month";
      value: number;
      min?: number;
      max?: number;
    })
  | (BaseField & {
      component: "datetime";
      value: number;
      min?: number;
      max?: number;
    })
  | (BaseField & {
      component: "telephone";
      value: number;
      min?: number;
      max?: number;
    })
  | (BaseField & {
      component: "textarea";
      value: string;
      min?: number;
      max?: number;
    })
  | (BaseField & {
      component: "checkbox";
      value: 0 | 1;
    })
  | (BaseField & {
      component: "radio";
      value: number;
    })
  | (BaseField & {
      component: "switch";
      value: number;
    })
  | (BaseField & {
      component: "range";
      value: number;
      min: number;
      max: number;
      step?: number;
    })
  | (BaseField & {
      component: "color";
      value: string;
    })
  | (BaseField & {
      component: "dropdown";
      value: string;
    })
  | (BaseField & {
      component: "val-dropdown";
      value: string;
    })
  | (BaseField & {
      component: "tags";
      value: string;
    })
  | (BaseField & {
      component: "multi-select";
      value: number;
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
  [K in keyof T]: T[K]["required"] extends true ? T[K]["value"] : T[K]["value"] | undefined;
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
    required: boolean;
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete: AutoFill | undefined;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  };
}
