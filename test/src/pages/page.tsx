import Form from "red-form"
import "red-form/dist/index.css"
function Page() {
  return (
    <Form
      title={"Create Survey"}
      description="Please fill all the details."
      schema={{
        avatar: {
          label: "avatar",
          component: "image",
          value: "",
          onSelect: async file => {
            return await new Promise((resolve, reject) => {
              const reader = new FileReader()

              reader.onload = () => resolve(reader.result as string) // this will be the data URL
              reader.onerror = reject

              reader.readAsDataURL(file)
            })
          },
          span: 2,
          required: true
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
          options: [
            {
              value: "1",
              label: "one"
            },
            {
              value: "2",
              label: "two"
            },
            {
              value: "3",
              label: "three"
            },
            {
              value: "4",
              label: "four"
            },
            {
              value: "5",
              label: "five"
            }
          ],
          value: [],
          information: "This is a multiple select input",
          span: 12,
          required: true
        },
        name: {
          label: `name`,
          component: "text",
          value: "",
          autoFill: "name",
          required: true,
          validate: ({ field, props, form }) => {
            const value = form.values[field] as string
            const errors: string[] = []
            if (!value.toLowerCase().startsWith("care-")) {
              errors.push(`${props.label} must start with "care-"`)
            }
            return errors
          }
        },
        group: {
          label: "group",
          component: "select",
          value: "",
          options: ["PRO", "CRO", "eCRF"],
          required: true
        },
        code: {
          label: "code",
          component: "text",
          value: "",
          required: true
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
          options: ["general"],
          required: true
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
          options: ["PRO", "CRO", "eCRF"],
          required: true
        },
        source: {
          label: "source",
          component: "text",
          value: "",
          required: true
        },
        branching: {
          label: "branching",
          component: "switch",
          value: false,
          required: true
        },
        priority: {
          label: "priority",
          component: "range",
          value: 0,
          min: 20,
          max: 100,
          required: true
        },
        color: {
          label: "color",
          component: "color",
          value: "#000000",
          required: true
        },
        start: {
          label: "start date",
          component: "date",
          // value: "2025-10-16",
          value: "",
          required: true
        },
        "start-time": {
          label: "start time",
          component: "time",
          value: "19:09",
          required: true
        },
        end: {
          label: "end time",
          component: "datetime",
          // value: "2025-10-17T19:09",
          value: "",

          required: true
        },
        week: {
          label: "week",
          component: "week",
          // value: "2025-W42",
          value: "",

          required: true
        },
        month: {
          label: "month",
          component: "month",
          // value: "2025-10",
          value: "",

          required: true
        },
        methods: {
          label: "methods (Multi Pick)",
          component: "checkbox",
          options: ["debit card", "credit card", "upi"],
          value: [],
          required: true
        },
        method: {
          label: "method (Single Pick)",
          component: "checkbox",
          options: ["debit card", "credit card", "upi"],
          value: "",
          required: true
        },

        gender: {
          label: "gender",
          component: "radio",
          options: ["Male", "Female", "Other"],
          value: "",
          required: true
        },
        comment: {
          label: "comment",
          component: "textarea",
          value: "",
          span: 12,
          required: true
        }
      }}
      onSubmit={values => {
        console.log(values)
      }}
    />
  )
}

export default Page
