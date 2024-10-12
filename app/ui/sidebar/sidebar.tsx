import Spacer from "../common/spacer";
import SidebarStats from "./sidebar_stats";
import SidebarOverview from "./sidebar_overview";
import SidebarHeader from "./sidebar_header";

const style: React.CSSProperties = {
    display: "flex",
    alignItems: "start",
    flexDirection: "column",

    padding: "15px 20px 15px 20px",
    overflowY: "scroll",

    position: "relative",
    top: "20px",
    right: "calc(-100vw + 380px)",
    zIndex: "10",

    width: "350px",
    height: "90%",

    backgroundColor: "white", 
    borderRadius: "12px",
    border: "1px solid #d9d9d9",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px"
}

export default function Sidebar() {
    return (
        <div style={style}>
            <SidebarHeader />
            <Spacer height={10.0} />

            <SidebarStats />
            <Spacer height={20.0} />

            <SidebarOverview />
        </div>
    );
}