# 🟥 red-form

**red-form** is a modern, schema-based, dialog-driven form library for React.  
It lets you declare forms as simple JSON-like objects and handles UI, validation, and state automatically — similar to Formik, but built for dynamic UI rendering and TypeScript-first projects.

---

## ✨ Features

- 🧱 **Schema-driven:** Define all fields via a single `schema` object.
- 🪄 **Dynamic rendering:** Renders inputs automatically based on component type.
- 🧩 **Dialog-based system:** Open forms anywhere in your app as modals.
- ⚙️ **Type-safe:** Each form is strongly typed, with automatic value inference.
- 💡 **Custom field renderers:** Create and inject your own React field types.
- 🪶 **Lightweight:** No external dependencies other than React.

---

## 📦 Installation

```bash
npm install red-form
# or
yarn add red-form
```

## 🧩 Basic Usage

```tsx
import { Form } from "red-form";

export default function ExampleForm() {
  return (
    <Form
      title="Create Survey"
      description="Please fill all the details."
      schema={{
        name: {
          label: "Name",
          component: "text",
          value: "",
          required: true
        },
        email: {
          label: "Email",
          component: "email",
          value: ""
        },
        gender: {
          label: "Gender",
          component: "radio",
          options: ["Male", "Female", "Other"],
          value: ""
        },
        comment: {
          label: "Comment",
          component: "textarea",
          value: "",
          span: 12
        }
      }}
      onSubmit={values => {
        console.log(values);
      }}
    />
  );
}
```

---

## ⚙️ Advanced Example

```tsx
<Form
  title="Create Survey"
  description="Please fill all the details."
  schema={{
    avatar: {
      label: "Avatar",
      component: "image",
      value: "",
      onSelect: async file => {
        const reader = new FileReader();
        return new Promise(resolve => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      },
      required: true
    },
    tags: {
      label: "Tags",
      component: "tags",
      value: ["react", "typescript"],
      span: 12
    },
    color: {
      label: "Color",
      component: "color",
      value: "#ff0000"
    },
    date: {
      label: "Start Date",
      component: "date",
      value: "2025-10-16"
    },
    range: {
      label: "Priority",
      component: "range",
      min: 0,
      max: 100,
      value: 20
    },
    customBlock: {
      label: "Custom",
      component: "custom",
      inputBase: false,
      render: () => <div style={{ background: "red", padding: 10 }}>Custom Field</div>,
      span: 12
    }
  }}
  onSubmit={values => console.log(values)}
/>
```

---

## 🧠 Types Overview

Every form schema is type-safe thanks to `Schema`, `Values<T>`, and `FormInstance<T>` types.

```ts
import type { Schema, Values, FormInstance } from "red-form";
```

---

## 🧩 Supported Components

| Component Type                                | Description                          |
| --------------------------------------------- | ------------------------------------ |
| `text`, `email`, `password`, `number`         | Standard input fields                |
| `date`, `datetime`, `time`, `week`, `month`   | Temporal inputs                      |
| `select`, `multi-select`                      | Dropdowns                            |
| `checkbox`, `radio`, `switch`                 | Choice-based fields                  |
| `color`, `range`, `image`, `tags`, `textarea` | Specialized inputs                   |
| `custom`                                      | Fully custom renderer with ReactNode |

---

## 🧰 API Overview

### `Form` Props

| Prop               | Type                          | Description                                     |
| ------------------ | ----------------------------- | ----------------------------------------------- |
| `schema`           | `Schema`                      | Defines fields and their behavior               |
| `title`            | `string \| ReactNode`         | Form title                                      |
| `description`      | `ReactNode`                   | Optional form description                       |
| `onSubmit(values)` | `(values: Values<T>) => void` | Called when the form is submitted               |
| `onError(errors)`  | `(errors: Errors<T>) => void` | Called when validation fails                    |
| `width` / `height` | `number`                      | Dialog size control                             |
| `open`             | `boolean`                     | Controls visibility (if not using FormProvider) |

---

## 🧑‍💻 Author

**Manish Gun**
💻 [GitHub](https://github.com/manishgun) • 🌐 [Website](https://manishgun.vercel.app) • ✉️ [mail.cto.manish@gmail.com](mailto:mail.cto.manish@gmail.com)

---

## 🪪 License

MIT © [Manish Gun](https://github.com/manishgun)
