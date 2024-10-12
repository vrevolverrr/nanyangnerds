'use client';
import OpenStreetMap from './ui/map';
import MenuBar from './ui/menu_bar';
import Sidebar from './ui/sidebar/sidebar';

export default function App() {
  return (
    <div style={{width: "100vw", height: "100vh", overflow: "hidden"}}>
      <MenuBar />
      <div style={{display: "flex"}}>
        <Sidebar />
        <OpenStreetMap center={[51.505, -0.09]} zoom={3} />
      </div>
    </div>
  );
}
