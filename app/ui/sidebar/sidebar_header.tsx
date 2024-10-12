import CloseButton from "../buttons/close_button";

export default function SidebarHeader() {
    return (
        <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
            <p style={{color: "#171717", paddingLeft: "5px", fontWeight: "bold", fontSize: "18px"}}>Suez Canal (SZC)</p>
            <CloseButton />
        </div>
    )
}