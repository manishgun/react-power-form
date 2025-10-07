import { Errors, FormContextProps, FormInstance, FormProps, InputProps, ModalProps, Schema, Touched, Values } from "./declarations";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

const FormContext = createContext<FormContextProps>({
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
      {formValues.map(([key, props]) => {
        const id = Number(key);
        return (
          <Modal
            key={id}
            isOpen={true}
            height={props.height}
            width={props.width}
            minHeight={props.minHeight}
            onClose={
              props.close !== false
                ? () => {
                    close(id);
                  }
                : undefined
            }
          >
            <Form schema={props.schema} onSubmit={props.onSubmit} title={props.title} description={props.description} />
          </Modal>
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

const Modal = (props: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [props.isOpen]);

  // Close on "Escape" key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && props.onClose) props.onClose();
    };
    if (props.isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [props.isOpen, props.onClose]);

  // Close when clicking outside
  const handleClickOutside = (event: React.MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      if (props.onClose) props.onClose();
    }
  };

  if (!props.isOpen) return null;

  return (
    <div onClick={handleClickOutside} className="red-form-modal-background">
      <div
        className="red-form-modal"
        ref={ref}
        style={{
          width: props.width,
          minHeight: props.minHeight,
          height: props.height
        }}
      >
        <div className="red-form-modal-header">
          <div className="red-form-modal-title">{props.title}</div>
          {props.onClose && (
            <button onClick={props.onClose} className="red-form-modal-close-button" aria-label="Close">
              ×
            </button>
          )}
        </div>
        <div style={{ flex: 1 }} className="red-form-modal-container">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export function useForm<T extends Schema>(schema: T, onSubmit: (values: Values<T>) => void): FormInstance<T> {
  const initialValues = useMemo(() => {
    const values = {} as Values<T>;
    (Object.entries(schema) as [keyof T, T[keyof T]][]).forEach(([key, field]) => {
      values[key] = field.value as Values<T>[keyof T];
    });
    return values;
  }, [schema]);

  const [values, setValues] = useState<Values<T>>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Touched<T>>({});
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

  const setFieldTouched = <K extends keyof T>(field: K, value: boolean) => {
    setTouched(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = <K extends keyof T>(event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.name) setTouched(prev => ({ ...prev, [event.target.name as K]: true }));
  };

  const handleChange = <K extends keyof T>(event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name) setFieldValue(event.target.name as K, event.target.value);
  };

  const getFieldProps = useCallback(
    <K extends keyof T>(key: K) => ({
      name: key,
      id: key,
      value: values[key],
      required: schema[key]["required"] ? true : false,
      disabled: schema[key]["disabled"] ? true : false,
      autoComplete: schema[key]["component"] === "text" ? (schema[key]["autoFill"] ? schema[key]["autoFill"] : undefined) : undefined,
      onChange: handleChange,
      onBlur: handleBlur
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

  useEffect(() => {
    validate();
  }, [values]);

  const submit = useCallback(() => {
    if (validate()) onSubmit(values);
  }, [validate, onSubmit, values]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      submit();
    },
    [submit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
  }, [initialValues]);

  return {
    submitting,
    setSubmitting,

    values,
    setFieldValue,
    setValues,

    errors,
    setFieldError,
    setErrors,

    touched,
    setFieldTouched,
    setTouched,
    handleBlur,

    handleChange,

    handleSubmit,
    resetForm,
    validate,
    getFieldProps,
    submit
  };
}

const Form = <T extends Schema>({ schema, title, description, onSubmit }: Omit<FormProps<T>, "open" | "close" | "minHeight" | "width" | "height" | "onClose">) => {
  const form = useForm(schema, values => {
    onSubmit(values);
  });

  const disable_submittion = useMemo(() => {
    return Object.keys(form.errors).length > 0 || form.submitting;
  }, [form.errors, form.submitting]);

  return (
    <div className="red-form-conteiner">
      {title && <div className="red-form-title">{title}</div>}
      {description && <p className="red-form-description">{description}</p>}
      <form className="red-form" onSubmit={form.handleSubmit}>
        {(Object.entries(schema) as [keyof T, T[keyof T]][]).map(([field, props]) => {
          return <InputContainer key={field as string} field={field} props={props} form={form} />;
        })}
        <div className="red-form-action-area">
          <button disabled={disable_submittion} className={disable_submittion ? "red-form-submit-button-disabled" : "red-form-submit-button"} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const InputContainer = <T extends Schema, K extends keyof T>({ field, props, form }: { field: K; props: T[K]; form: FormInstance<T> }) => {
  const error = form.errors[field];
  return (
    <div className="red-form-input-container">
      <div className="red-form-input-label-container">
        <label className="red-form-input-label" htmlFor={field as string} style={{ color: error ? "red" : undefined }}>
          {props.label} {props.required && "*"}
        </label>
        {props.information && (
          <div className="red-form-tooltip-wrapper">
            <div className="red-form-info-icon">i</div>
            <div className="red-form-tooltip">{props.information}</div>
          </div>
        )}
      </div>
      <InputBase field={field} props={props} form={form} error={error} />
      {error ? (
        <ul style={{ color: error ? "red" : undefined }}>
          {error.map(content => {
            return <li key={content}>{content}</li>;
          })}
        </ul>
      ) : (
        <>
          {props.helperText !== undefined && (
            <p className="red-form-helper-text" style={{ color: error ? "red" : undefined }}>
              {props.helperText}
            </p>
          )}
        </>
      )}
    </div>
  );
};

const InputBase = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  return (
    <div className="red-form-input-base" style={{ borderColor: error ? "red" : undefined }}>
      <Input field={field} props={props} form={form} error={error} />
    </div>
  );
};

const Input = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  // if (["text", "email", "tel", "password", "number", "date", "datetime-local"].includes(props.component))
  switch (props.component) {
    case "text":
      return <TextField field={field} props={props} form={form} error={error} />;
    case "search":
      return <SearchField field={field} props={props} form={form} error={error} />;
    case "email":
      return <EmailField field={field} props={props} form={form} error={error} />;
    case "telephone":
      return <TelephoneField field={field} props={props} form={form} error={error} />;
    case "password":
      return <PasswordField field={field} props={props} form={form} error={error} />;
    case "number":
      return <NumberField field={field} props={props} form={form} error={error} />;
    case "date":
      return <DateField field={field} props={props} form={form} error={error} />;
    case "datetime":
      return <DateTimeField field={field} props={props} form={form} error={error} />;
    case "time":
      return <TimeField field={field} props={props} form={form} error={error} />;
    case "month":
      return <MonthField field={field} props={props} form={form} error={error} />;
    case "week":
      return <WeekField field={field} props={props} form={form} error={error} />;
    case "range":
      return <RangeField field={field} props={props} form={form} error={error} />;

    default:
      return <div>Nothing To Render</div>;
  }
};

const TextField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "text") return null;
  return <input type="text" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />;
};

const SearchField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "search") return null;
  return <input type="search" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />;
};

const EmailField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "email") return null;
  return <input type="email" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />;
};

const TelephoneField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "telephone") return null;
  return <input type="tel" placeholder={props.placeholder} {...form.getFieldProps(field as string)} className="red-form-input" style={{ color: error ? "red" : undefined }} />;
};

const PasswordField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "password") return null;
  return <input type="password" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />;
};

const NumberField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "number") return null;
  return <input type="number" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />;
};

const DateField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "date") return null;
  return <input type="date" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />;
};

const TimeField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "time") return null;
  return <input type="time" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />;
};

const WeekField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "week") return null;
  return <input type="week" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />;
};
const MonthField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "month") return null;
  return <input type="month" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />;
};

const RangeField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "range") return null;
  return (
    <input type="range" placeholder={props.placeholder} min={props.min} max={props.max} step={props.step} className="red-form-input" {...form.getFieldProps(field as string)} />
  );
};

const DateTimeField = <T extends Schema, K extends keyof T>({ field, props, form, error }: InputProps<T, K>) => {
  if (props.component !== "datetime") return null;
  return (
    <input type="datetime-local" placeholder={props.placeholder} className="red-form-input" {...form.getFieldProps(field as string)} style={{ color: error ? "red" : undefined }} />
  );
};

export default Form;
