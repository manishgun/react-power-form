import Form from "../../react-power-form/src/index"

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <Form
        title={"Create Profile"}
        description="Please fill all the details."
        schema={{
          textField: {
            label: "Text Field",
            component: "text",
            value: "Sample text",
            placeholder: "Enter text",
            helperText: "Standard text input field",
            information: "Used for simple text input"
          },
          emailField: {
            label: "Email",
            component: "email",
            value: "user@example.com",
            placeholder: "Enter your email"
          },
          searchField: {
            label: "Search",
            component: "search",
            value: "query",
            placeholder: "Search term"
          },
          numberField: {
            label: "Number",
            component: "number",
            value: 42,
            min: 0,
            max: 100,
            step: 1,
            helperText: "Enter a number between 0–100"
          },
          passwordField: {
            label: "Password",
            component: "password",
            value: "secret123",
            min: 6,
            max: 20,
            helperText: "Password must be 6–20 characters"
          },
          dateField: {
            label: "Date",
            component: "date",
            value: "2025-10-08",
            min: "2020-01-01",
            max: "2030-01-01"
          },
          datetimeField: {
            label: "Date & Time",
            component: "datetime",
            value: "2025-10-08T12:00",
            min: "2020-01-01T00:00",
            max: "2030-01-01T00:00"
          },
          timeField: {
            label: "Time",
            component: "time",
            value: "12:30",
            min: "08:00",
            max: "18:00"
          },
          weekField: {
            label: "Week",
            component: "week",
            value: 202540, // year + week
            min: 202301,
            max: 202552
          },
          monthField: {
            label: "Month",
            component: "month",
            value: 202510,
            min: 202301,
            max: 202512
          },
          telephoneField: {
            label: "Telephone",
            component: "telephone",
            value: 1234567890,
            information: "Enter your phone number"
          },
          textareaField: {
            label: "Description",
            component: "textarea",
            value: "This is a sample textarea.",
            min: 0,
            max: 500,
            helperText: "Max 500 characters"
          },
          checkboxField: {
            label: "Accept Terms",
            component: "checkbox",
            value: 1 // 1 = checked, 0 = unchecked
          },
          radioField: {
            label: "Gender",
            component: "radio",
            value: 1 // e.g., 1 = Male, 2 = Female
          },
          switchField: {
            label: "Enable Notifications",
            component: "switch",
            value: 0 // off
          },
          rangeField: {
            label: "Volume",
            component: "range",
            value: 50,
            min: 0,
            max: 100,
            step: 1
          },
          colorField: {
            label: "Favorite Color",
            component: "color",
            value: "#ff0000"
          },
          dropdownField: {
            label: "Country",
            component: "dropdown",
            value: "USA"
          },
          valDropdownField: {
            label: "Currency",
            component: "val-dropdown",
            value: "USD"
          },
          tagsField: {
            label: "Tags",
            component: "tags",
            value: "react,typescript,frontend"
          },
          multiSelectField: {
            label: "Select Multiple IDs",
            component: "multi-select",
            value: 2
          }
        }}
        onSubmit={values => {
          console.log(values)
        }}
      />
    </div>
  )
}

export default App
