import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

const _style: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    width: "40px",
    height: "40px",
    backgroundColor: "#f3f5f4",

    borderRadius: "999px"
}

export default function CloseButton(style: React.CSSProperties) {
    return (
        <div style={Object.assign({}, _style, style)}>
            <FontAwesomeIcon icon={faX} color="#3d3d3d" size="xs"/>
        </div>
    )
}