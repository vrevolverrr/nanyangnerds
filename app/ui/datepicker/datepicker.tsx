import { useState } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface DatePickerProps {
    onChangeHandler: (value: Value) => void
}

export default function DatePicker(props: DatePickerProps) {
  const [value, setValue] = useState<Value>([new Date(2024, 8, 30), new Date()]);

  return (
    <div style={{zIndex: "10000", color: "black", position: "absolute", top: "10px", left: "calc(50vw - 150px)"}}>
      <DateRangePicker format={"dd-MM-y"} onChange={(value) => {
        setValue(value)
        props.onChangeHandler(value)
      }} value={value} />
    </div>
  );
}