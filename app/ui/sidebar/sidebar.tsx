import Spacer from "../common/spacer";
import SidebarStats from "./sidebar_stats";
import SidebarEvent from "./sidebar_event";
import SidebarHeader from "./sidebar_header";
import { NewsEvent } from "@/app/lib/firebase";
import { getAggregateRisk } from "@/app/lib/riskscorer";

const style: React.CSSProperties = {
    display: "flex",
    alignItems: "start",
    flexDirection: "column",

    padding: "12px 20px 15px 20px",
    overflowY: "scroll",

    position: "relative",
    top: "20px",
    right: "calc(-100vw + 380px)",
    zIndex: "10",

    width: "350px",
    height: "100%",
    maxHeight: "85vh",

    backgroundColor: "white", 
    borderRadius: "12px",
    border: "1px solid #d9d9d9",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
    scrollbarWidth: "none"
}

interface SidebarProps {
    segment: string
    newsEvents: NewsEvent[]
}

export default function Sidebar(props: SidebarProps) {
    return (
        <div style={style}>
            <SidebarHeader segment={props.segment}/>
            <Spacer height={10.0} />

            <SidebarStats riskScore={getAggregateRisk(props.segment, props.newsEvents)} numEvents={props.newsEvents.length}/>
            <Spacer height={15.0} />

            {props.newsEvents.length > 0 ? props.newsEvents.map((newsEvent, index) => 
                <SidebarEvent key={index} newsEvent={newsEvent}/>
            ) : <p style={{color: "black"}}>No critical events affecting this region.</p>}
        </div>
    );
}