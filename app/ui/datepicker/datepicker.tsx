import { useState } from "react";

interface DatePickerProps {
    onChangeHandler: (value: Date[]) => void
}

export default function DatePicker(props: DatePickerProps) {
  const [value, setValue] = useState<Date[]>([new Date(2024, 8, 30), new Date()])

  return (
    <div style={{width: "300px", display: "flex", flexDirection: "row", justifyContent: "space-between", zIndex: "10000", color: "black", position: "absolute", top: "10px", left: "calc(50vw - 150px)"}}>
      <input aria-label="Date from" defaultValue={value[0].toISOString().split('T')[0]} onChange={(e) => {
        const newValue = [new Date(e.target.value), value[1]]
        setValue(newValue)
        props.onChangeHandler(newValue)
      }} type="date" />
      <p>to</p>
      <input aria-label="Date from" defaultValue={value[1].toISOString().split('T')[0]} onChange={(e) => {
        const newValue = [value[0], new Date(e.target.value)]
        setValue(newValue)
        props.onChangeHandler(newValue)
      }} type="date" />
    </div>
  );
}