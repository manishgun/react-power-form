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
export type Adorment = {
  start: ReactNode | undefined;
  end: ReactNode | undefined;
};

export type Option = string | { label: string; value: string };

export type InputProps<T extends Schema, K extends keyof T> = { field: string; props: T[K]; form: FormInstance<T>; error: string[] | undefined };

export type BaseField = {
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: ReactNode;
  information?: string;
  disabled?: boolean;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

export type TextFieldProps = BaseField & {
  component: "text";
  value: string;
  autoFill?: AutoFillField;
  min?: number;
  max?: number;
  adorment?: Adorment;
};

export type EmailFieldProps = BaseField & {
  component: "email";
  value: string;
  adorment?: Adorment;
};

export type SearchFieldProps = BaseField & {
  component: "search";
  value: string;
  autoFill?: AutoFillField;
  adorment?: Adorment;
};

export type NumberFieldProps = BaseField & {
  component: "number";
  value: number;
  min?: number;
  max?: number;
  step?: number;
  adorment?: Adorment;
};

export type PasswordFieldProps = BaseField & {
  component: "password";
  value: string;
  min?: number;
  max?: number;
  adorment?: Adorment;
};

export type DateFieldProps = BaseField & {
  component: "date";
  value: `${1 | 2}${number}${number}${number}-${0 | 1}${number}-${0 | 1 | 2 | 3}${number}` | "";
  min?: string;
  max?: string;
  adorment?: Adorment;
};

export type DateTimeFieldProps = BaseField & {
  component: "datetime";
  value: `${1 | 2}${number}${number}${number}-${0 | 1}${number}-${0 | 1 | 2 | 3}${number}T${0 | 1 | 2}${number}:${0 | 1 | 2 | 3 | 4 | 5 | 6}${number}` | "";
  min?: string;
  max?: string;
  adorment?: Adorment;
};

export type TimeFieldProps = BaseField & {
  component: "time";
  value: `${0 | 1 | 2}${number}:${0 | 1 | 2 | 3 | 4 | 5 | 6}${number}` | "";
  min?: string;
  max?: string;
  adorment?: Adorment;
};

export type WeekFieldProps = BaseField & {
  component: "week";
  value: `${number}${number}${number}${number}-W${number}${number}` | "";
  min?: number;
  max?: number;
  adorment?: Adorment;
};

export type MonthFieldProps = BaseField & {
  component: "month";
  value: `${1 | 2}${number}${number}${number}-${0 | 1}${number}` | "";
  min?: number;
  max?: number;
  adorment?: Adorment;
};

export type TelephoneFieldProps = BaseField & {
  component: "telephone";
  value: number;
  min?: number;
  max?: number;
  adorment?: Adorment;
};

export type TextAreaFieldProps = BaseField & {
  component: "textarea";
  value: string;
  min?: number;
  max?: number;
};

export type CheckboxFieldProps = BaseField & {
  component: "checkbox";
  value: string[] | string | undefined;
  direction?: "row" | "column";
  options: (string | { label: string; value: string })[];
};

export type RadioFieldProps = BaseField & {
  component: "radio";
  value: string;
  direction?: "row" | "column";
  options: Option[];
};

export type RangeFieldProps = BaseField & {
  component: "range";
  value: number;
  min: number;
  max: number;
  step?: number;
};

export type ColorFieldProps = BaseField & {
  component: "color";
  value: `#${string}`;
};

export type SwitchFieldProps = BaseField & {
  component: "switch";
  value: boolean;
};

export type SelectFieldProps = BaseField & {
  component: "select";
  value: string;
  options: Option[];
};

export type MultiSelectFieldProps = BaseField & {
  component: "multi-select";
  value: string[];
  options: Option[];
};

export type TagsFieldProps = BaseField & {
  component: "tags";
  value: string[];
};

export type ImageFieldProps = BaseField & {
  component: "image";
  value: string;
  onSelect: (file: File) => Promise<string>;
};

export type CustomFieldProps = BaseField & {
  component: "custom";
  value?: ReactNode;
  inputBase?: boolean;
  render: <T extends Schema, K extends keyof T>({ field, props, form }: InputProps<T, K>) => ReactNode;
};

export type FieldSchema =
  | TextFieldProps
  | EmailFieldProps
  | SearchFieldProps
  | PasswordFieldProps
  | NumberFieldProps
  | DateFieldProps
  | DateTimeFieldProps
  | TimeFieldProps
  | WeekFieldProps
  | MonthFieldProps
  | TimeFieldProps
  | TelephoneFieldProps
  | TextAreaFieldProps
  | CheckboxFieldProps
  | RadioFieldProps
  | SwitchFieldProps
  | RangeFieldProps
  | ColorFieldProps
  | SelectFieldProps
  | MultiSelectFieldProps
  | TagsFieldProps
  | ImageFieldProps
  | CustomFieldProps;

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
  onSubmit?: (values: Values<T>) => void | Promise<void>;
  onChange?: (values: Values<T>) => void;
  onError?: (values: Errors<T>) => void;
  onBlur?: (values: Touched<T>) => void;
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

  activeField: string | undefined;
  setFieldActive: <K extends keyof T>(field: K | undefined) => void;
  handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;

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
    // value: Values<T>[K];
    value: T[K]["value"] | undefined | any;
    id: K;
    required: boolean;
    disabled: boolean;
    ref: React.RefObject<HTMLInputElement | null> | undefined;
    placeholder: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    autoComplete: AutoFill | undefined;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onMouseDown: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };
}
