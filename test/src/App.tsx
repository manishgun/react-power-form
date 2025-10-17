import Form from "../../react-power-form/src/index"

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <Form
        title={"Create Survey"}
        description="Please fill all the details."
        schema={{
          name: {
            label: "name",
            component: "text",
            value: ""
          },
          group: {
            label: "group",
            component: "select",
            value: "",
            options: ["PRO", "CRO", "eCRF"]
          },
          code: {
            label: "code",
            component: "text",
            value: ""
          },
          mesures: {
            label: "mesures",
            component: "text",
            value: ""
          },
          type: {
            label: "type",
            component: "select",
            value: "",
            options: ["general"]
          },
          category: {
            label: "category",
            component: "select",
            value: "",
            options: ["PRO", "CRO", "eCRF"]
          },
          area: {
            label: "theraputic area",
            component: "select",
            value: "",
            options: ["PRO", "CRO", "eCRF"]
          },
          source: {
            label: "source",
            component: "text",
            value: ""
          },
          branching: {
            label: "branching",
            component: "switch",
            value: false
          },
          priority: {
            label: "priority",
            component: "range",
            value: 0,
            min: 0,
            max: 100,
            step: 1
          },
          color: {
            label: "color",
            component: "color",
            value: "#000000"
          },
          start: {
            label: "start date",
            component: "date",
            value: ""
          },
          "start-time": {
            label: "start time",
            component: "time",
            value: ""
          },
          end: {
            label: "end time",
            component: "datetime",
            value: ""
          },
          week: {
            label: "week",
            component: "week",
            value: 42
          },
          month: {
            label: "month",
            component: "month",
            value: 4
          },
          methods: {
            label: "methods (Multi Pick)",
            component: "checkbox",
            options: ["debit card", "credit card", "upi"],
            value: []
          },
          method: {
            label: "method (Single Pick)",
            component: "checkbox",
            options: ["debit card", "credit card", "upi"],
            value: ""
          },
          tags: {
            label: "tags",
            component: "tags",
            value: ["red", "green", "blue", "yellow", "pink", "violate", "orange"],
            span: 12
          },
          skills: {
            label: "skills",
            component: "multi-select",
            options: ["red", "green", "blue", "yellow", "pink", "violate", "orange"],
            value: [],
            span: 12
          },
          comment: {
            label: "comment",
            component: "textarea",
            value: "",
            span: 12
          }
        }}
        // onSubmit={values => {
        //   // values.email.length
        //   console.log(values)
        // }}
      />
    </div>
  )
}

export default App
