import { routes, RouteSegment } from "@/app/data/routes";

interface SidebarHeaderProps {
    segment: string
}

export default function SidebarHeader(props: SidebarHeaderProps) {
    var segment = props.segment

    for (var route of routes) {
        if (route.name.toLowerCase() == segment) {
            segment = route.name
        }
    }

    return (
        <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
            <p style={{color: "#171717", paddingLeft: "5px", fontWeight: "bold", fontSize: "22px"}}>{segment}</p>
        </div>
    )
}