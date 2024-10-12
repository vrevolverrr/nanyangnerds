import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const style: React.CSSProperties = {
    width: "100vw",
    height: "50px",
    padding: "10px",
    
    display: "flex",
    alignItems: "center",
    
    color: "black"
}

export default function MenuBar() {
    return (
        <div style={{fontWeight: "bold", ...style}}>
            NanyangNerds
        </div>
    )
}