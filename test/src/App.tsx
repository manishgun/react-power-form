import "./App.css"
import { Form } from "../../react-power-form/src/index"

function App() {
  // const { close, open } = useModalForm(
  //   {
  //     name: { label: "Name", required: true, type: "text", initial: "" },
  //     number: { label: "Number", required: false, type: "number", initial: 0 }
  //   },
  //   {
  //     title: "Sign In",
  //     description: "This is sign In form",
  //     onSubmit: async values => {
  //       console.log(values)
  //     }
  //   }
  // )
  return (
    <div>
      <Form
        schema={{
          name: { label: "Name", required: true, type: "text", initial: "", autoFill: "name" },
          phone: { label: "phone", required: true, type: "text", initial: "", autoFill: "mobile tel" },
          number: { label: "Number", required: false, type: "number", initial: 0 }
        }}
        onSubmit={values => {}}
      />
    </div>
  )
}

export default App
