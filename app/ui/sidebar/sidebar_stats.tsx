import { RISK_GREEN, RISK_RED, RISK_YELLOW } from "../common/colors"

const style: React.CSSProperties = {
    width: "100%",
    height: "90px",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: "10px",

    borderRadius: "10px",
    border: "1px solid #e3e3e3",
    backgroundColor: "#fdfdfd",
    color: "black",

}

interface StatLabelProps {
    title: string
    value: string
    labelType: number
}

function StatLabel(props: StatLabelProps) {
    const style: React.CSSProperties = {
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
    }

    const riskStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5px",
        
        width: "100px",
        height: "40px",

        backgroundColor: parseFloat(props.value) >= (props.labelType == 0 ? 0.7 : 5) ? RISK_RED : parseFloat(props.value) >= (props.labelType == 0 ? 0.7 : 3) ? RISK_YELLOW : RISK_GREEN,
        borderRadius: "30px"
    }

    return (
        <div style={style}>
            <p style={{fontSize: "14px", fontWeight: "bold"}}>{props.title}</p>
            <div style={riskStyle}>
                <p style={{fontSize: "24px", fontWeight: "bold", transform: "translate(-1px, 0.5px)"}}>{props.value}</p>
            </div>
        </div>
    )
}

interface SidebarStatsProps {
    riskScore: number
    numEvents: number
}

export default function SidebarStats(props: SidebarStatsProps) {
    return (
        <div style={style}>
            <StatLabel labelType={0} title="Risk Score" value={props.riskScore.toString()}/>

            <div style={{height: "80%", width: "1px", backgroundColor: "#c7c7c7", margin: "0 15px 0 15px"}} />

            <StatLabel labelType={1} title="Risk Events" value={props.numEvents.toString()}/>
        </div>
    )
}