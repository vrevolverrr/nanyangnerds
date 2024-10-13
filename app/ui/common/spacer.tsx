interface SpacerProps {
    height:  number
}

export default function Spacer(props: SpacerProps) {
    return <div style={{width: "100%", minHeight: `${props.height}px`}}/>
}