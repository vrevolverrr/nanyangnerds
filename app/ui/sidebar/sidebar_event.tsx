import { NewsEvent } from "@/app/lib/firebase"
import Spacer from "../common/spacer"
import { RISK_GREEN, RISK_RED, RISK_YELLOW } from "../common/colors"

const style: React.CSSProperties = {
    width: "100%",
    height: "fit-content",

    padding: "10px 14px 10px 14px",
    marginBottom: "30px",
    
    border: "1px solid #e3e3e3",
    borderRadius: "10px",

    backgroundColor: "#fdfdfd",
    color: "black",
}

interface SidebarEventProps {
    newsEvent: NewsEvent
}

export default function SidebarEvent(props: SidebarEventProps) {
    return (
        <div style={style}>
            <p style={{color: "black", fontWeight: "bold", fontSize: "18px"}}>{props.newsEvent.timestamp}</p>
            <p>
                {props.newsEvent.content} <span style={{color: "blue", textDecoration: "underline"}}><a href={props.newsEvent.url} target="_blank">Read more.</a></span>
            </p>
            <Spacer height={15.0}/>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "start"}}>
                <div>
                    <p style={{color: "#525252", fontWeight: "bold"}}>Risk Score</p>
                    <div style={{display: "flex", width: "62px", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <p style={{fontSize: "24px", fontWeight: "bold", paddingLeft: "2px"}}>
                            {props.newsEvent.risk.toFixed(2)}
                        </p>
                        <div style={{width: "10px", height: "10px", borderRadius: "20px", backgroundColor: props.newsEvent.risk >= 0.7 ? RISK_RED : props.newsEvent.risk >= 0.3 ? RISK_YELLOW : RISK_GREEN}}/>
                    </div>
                </div>
                <div style={{minWidth: "25px"}}/>
                <div>
                    <p style={{color: "#525252", fontWeight: "bold"}}>Location</p>
                    <p style={{fontSize: "18px", fontWeight: "bold"}}>
                        {props.newsEvent.city}
                    </p>
                </div>
            </div>
        </div>
    )
}