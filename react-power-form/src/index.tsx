import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type FieldType = "text" | "number";

type BaseField = {
  label: string;
  required?: boolean;
};

type FieldSchema =
  | (BaseField & {
      type: "text";
      initial: string;
      autoFill?: AutoFillField;
      min?: number;
      max?: number;
    })
  | (BaseField & {
      type: "number";
      initial: number;
      min?: number;
      max?: number;
    });

type Schema = Record<string, FieldSchema>;

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

type Values<T extends Schema> = {
  [K in keyof T]: T[K]["required"] extends true ? T[K]["initial"] : T[K]["initial"] | undefined;
};

type FormProps<T extends Schema> = {
  // FORM FIELDS
  title?: string | ReactNode;
  description?: ReactNode;
  onSubmit: (values: Values<T>) => void | Promise<void>;
  schema: T;
  // DIALOG FIELDS
  open?: boolean;
  close?: boolean;
  width?: number;
  minHeight?: number;
  onClose: () => void;
};

export type Errors<T extends Schema> = Partial<Record<keyof T, string[]>>;
// export type Touched<T extends Schema> = Partial<Record<keyof T, boolean>>;

export interface FormInstance<T extends Schema> {
  submitting: boolean;
  values: Values<T>;
  errors: Errors<T>;
  // touched: Touched<T>;
  setValues: React.Dispatch<React.SetStateAction<Values<T>>>;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setFieldValue: <K extends keyof T>(field: K, value: Values<T>[K]) => void;
  setFieldError: <K extends keyof T>(field: K, message: string) => void;
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
    // onBlur: () => void;
  };
}

const FormContext = createContext<{
  open: <T extends Schema>(props: FormProps<T>) => number;
  close: (index: number) => void;
}>({
  open: () => 0,
  close: () => {}
});

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [forms, setForms] = useState<Record<number, FormProps<any>>>({});

  const formValues = useMemo(() => Object.entries(forms), [forms]);

  const open = <T extends Schema>(props: FormProps<T>) => {
    const id = Date.now();
    setForms(prev => ({ ...prev, [id]: props }));
    return id;
  };

  const close = (id: number) => {
    setForms(prev => {
      const updated = { ...prev };
      const onClose = updated[id].onClose;
      setTimeout(() => {
        onClose();
      }, 50);
      delete updated[id];
      return updated;
    });
  };

  return (
    <FormContext.Provider value={{ open, close }}>
      {formValues.map(([key, form]) => {
        const id = Number(key);
        return (
          <Dialog
            key={id}
            isOpen={true}
            onClose={
              form.close !== false
                ? () => {
                    close(id);
                  }
                : undefined
            }
          >
            {form.title && <h1 style={{ margin: 0 }}>{form.title}</h1>}
            {form.description && <p>{form.description}</p>}
          </Dialog>
        );
      })}
      {children}
    </FormContext.Provider>
  );
};

export const useModalForm = <T extends Schema>(schema: T, options: Omit<FormProps<T>, "schema" | "onClose">) => {
  const [remember, setRemember] = useState<{ id?: number; props?: FormProps<T> }>({});
  const { open, close } = useContext(FormContext);

  const utils = {
    open: () => {
      if (!remember.id) {
        const value = {
          ...options,
          schema,
          onClose: () => {
            setRemember({});
          }
        };
        const id = open(value);
        setRemember({ id, props: value });
      }
    },
    close: () => {
      if (remember.id && options.close !== false) {
        close(remember.id);
        setRemember({});
      }
    }
  };

  useEffect(() => {
    if (options.open && JSON.stringify(remember.props) !== JSON.stringify(options)) utils.open();
  }, []);

  return utils;
};

const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  width = 1152,
  minHeight = 300
}: {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
  minHeight?: number;
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on "Escape" key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close when clicking outside
  const handleClickOutside = (event: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
      if (onClose) onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClickOutside}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(2px)",
        zIndex: 150,
        padding: "0 16px"
      }}
    >
      <div
        ref={dialogRef}
        style={{
          width: width,
          minHeight: minHeight,
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          padding: "24px",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "18px", fontWeight: 600 }}>{title}</div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "26px",
                cursor: "pointer",
                lineHeight: 1
              }}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

export function useForm<T extends Schema>(schema: T, onSubmit: (values: Values<T>) => void): FormInstance<T> {
  const initialValues = useMemo(() => {
    const values = {} as Values<T>;
    (Object.entries(schema) as [keyof T, T[keyof T]][]).forEach(([key, field]) => {
      values[key] = field.initial as Values<T>[keyof T];
    });
    return values;
  }, [schema]);

  const [values, setValues] = useState<Values<T>>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  // const [touched, setTouched] = useState<Touched<T>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const setFieldValue = <K extends keyof T>(field: K, value: Values<T>[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const setFieldError = <K extends keyof T>(field: K, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), message]
    }));
  };

  // const handleBlur = <K extends keyof T>(field: K) => {
  //   setTouched(prev => ({ ...prev, [field]: true }));
  // };

  // const handleChange = <K extends keyof T>(field: K, value: Values<T>[K]) => {
  //   setFieldValue(field, value);
  // };

  const getFieldProps = useCallback(
    <K extends keyof T>(key: K) => ({
      name: key,
      id: key,
      value: values[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value as Values<T>[K];
        setFieldValue(key, val);
      },
      autoComplete: schema[key]["type"] === "text" ? (schema[key]["autoFill"] ? schema[key]["autoFill"] : undefined) : undefined
    }),
    [values]
  );

  const validate = useCallback(() => {
    const newErrors: Errors<T> = {};
    (Object.entries(schema) as [keyof T, T[keyof T]][]).forEach(([key, field]) => {
      const value = values[key];
      const fieldErrors: string[] = [];

      if (field.required && (value === undefined || value === "")) {
        fieldErrors.push(`${String(field.label)} is required`);
      }

      if (fieldErrors.length > 0) newErrors[key] = fieldErrors;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, schema]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) onSubmit(values);
    },
    [validate, onSubmit, values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    // setTouched({});
    setErrors({});
  }, [initialValues]);

  const submit = useCallback(() => {
    setValues(initialValues);
    // setTouched({});
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    submitting,
    // touched,
    setValues,
    setFieldValue,
    setFieldError,
    setSubmitting,
    // handleChange,
    // handleBlur,
    handleSubmit,
    resetForm,
    validate,
    getFieldProps,
    submit
  };
}

export const Form = <T extends Schema>({ schema, title, description, onSubmit }: Omit<FormProps<T>, "open" | "close" | "minHeight" | "width" | "onClose">) => {
  const form = useForm(schema, async values => {});

  return (
    <div>
      {title && <h1>{title}</h1>}
      {description && <p>{description}</p>}
      <form onSubmit={form.handleSubmit} style={{ display: "grid", gridTemplateColumns: `repeat(12, minmax(0, 1fr))`, rowGap: 4, columnGap: "20px", width: "100%" }}>
        {(Object.entries(schema) as [keyof T, T[keyof T]][]).map(([field, props]) => {
          return <InputContainer key={field as string} field={field} props={props} form={form} />;
        })}
      </form>
    </div>
  );
};

const InputContainer = <T extends Schema, K extends keyof T>({ field, props, form }: { field: K; props: T[K]; form: FormInstance<T> }) => {
  return (
    <div style={{ width: "100%", gridColumn: `span ${4}` }}>
      <label style={{ display: "block", width: "100%" }} htmlFor={field as string}>
        {props.label}
      </label>
      <Input field={field} props={props} form={form} />
    </div>
  );
};

const Input = <T extends Schema, K extends keyof T>({ field, props, form }: { field: K; props: T[K]; form: FormInstance<T> }) => {
  return <input style={{ display: "block", width: "100%" }} {...form.getFieldProps(field as string)} />;
};
