import Image from 'next/image'
import logo from '../logo.jpg'

const style: React.CSSProperties = {
    width: "100vw",
    height: "50px",
    padding: "15px",
    
    display: "flex",
    alignItems: "center",
    
    color: "black"
}

function queryBackend() {
    const URL = prompt("Enter URL of news article")
    
    fetch("bbb", {
        method: "POST",
        body: JSON.stringify({
          url: URL
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
}

export default function MenuBar() {
    return (
        <div style={{fontWeight: "bold", ...style}}>
            <Image src={logo} alt="Omnisense Logo" width={160} onClick={queryBackend} onDragStart={(e) => e.preventDefault()}/>
        </div>
    )
}