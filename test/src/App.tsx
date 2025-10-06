import Form from "../../react-power-form/src/index"

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <Form
        title={"Create Profile"}
        description="Please fill all the details."
        schema={{
          name: {
            label: "name",
            required: true,
            component: "text",
            initial: "",
            autoFill: "name",
            helperText: "Enter your full name",
            placeholder: "Your Name here.",
            information: "This will name will be used as your profile name."
          },
          phone: { label: "phone", required: true, component: "text", initial: "", autoFill: "mobile tel", information: "This phone number will be used to verify your identity." },
          email: { label: "email", required: false, component: "text", initial: "", autoFill: "email" },
          address: { label: "address", required: true, component: "text", initial: "", autoFill: "address-line1" }
        }}
        onSubmit={values => {
          console.log(values)
        }}
      />
    </div>
  )
}

export default App
