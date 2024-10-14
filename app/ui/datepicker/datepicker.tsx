
interface DatePickerProps {
    onChangeHandler: (index: number, value: Date) => void
}

export default function DatePicker(props: DatePickerProps) {
  return (
    <div style={{width: "300px", display: "flex", flexDirection: "row", justifyContent: "space-between", zIndex: "10000", color: "black", position: "absolute", top: "10px", left: "calc(50vw - 150px)"}}>
      <input aria-label="Date from" defaultValue={new Date(2024, 8, 30).toISOString().split('T')[0]} onChange={(e) => {
        props.onChangeHandler(0, new Date(e.target.value))
      }} type="date"/>

      <p>to</p>
      
      <input aria-label="Date to" defaultValue={new Date(2024, 9, 13).toISOString().split('T')[0]} onChange={(e) => {
        props.onChangeHandler(1, new Date(e.target.value))
      }} type="date"/>
    </div>
  );
}