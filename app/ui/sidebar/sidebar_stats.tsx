const style: React.CSSProperties = {
    width: "100%",
    height: "90px",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",

    borderRadius: "10px",
    border: "1px solid #e3e3e3",
    backgroundColor: "#fdfdfd",
    color: "black",

}

interface StatLabelProps {
    title: String,
    value: String
}

function StatLabel(props: StatLabelProps) {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <p style={{fontSize: "14px", fontWeight: "bold"}}>{props.title}</p>
            <p style={{fontSize: "28px", fontWeight: "bold"}}>{props.value}</p>
        </div>
    )
}

export default function SidebarStats() {
    return (
        <div style={style}>
            <StatLabel title="Risk Score" value="36.3%"/>

            <div style={{height: "80%", width: "1px", backgroundColor: "#c7c7c7", margin: "0 25px 0 25px"}} />

            <StatLabel title="Est. Disruption" value="--"/>
        </div>
    )
}