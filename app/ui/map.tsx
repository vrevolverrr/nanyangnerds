'use client';

import React  from 'react';
import dynamic from 'next/dynamic';
import { routes } from '../data/routes';
import { NewsEvent } from '../lib/firebase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAggregateRisk } from '../lib/riskscorer';
import { RISK_GREEN, RISK_RED, RISK_YELLOW } from './common/colors';

interface OmniMapProps {
  newsEvents: NewsEvent[]
  updateSegmentCallback: (routeName: string) => void
}

function createMarkerIcon(riskScore: number) {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${riskScore >= 0.85 ? RISK_RED : riskScore >= 0.3 ? RISK_YELLOW : RISK_GREEN}" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  })
}

export default class OmniMap extends React.Component<OmniMapProps> {
  shouldComponentUpdate(nextProps: Readonly<OmniMapProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    return nextProps.newsEvents != this.props.newsEvents
  }

  render(): React.ReactNode {
    const MapContainer = dynamic(
      () => import('react-leaflet').then((mod) => mod.MapContainer),
      { ssr: false }
    );
  
    const TileLayer = dynamic(
      () => import('react-leaflet').then((mod) => mod.TileLayer),
      { ssr: false }
    );
  
    const Marker = dynamic(
      () => import('react-leaflet').then((mod) => mod.Marker),
      { ssr: false }
    );
  
    const mapContainerStyle: React.CSSProperties = {
      width: "100%", height: "calc(100% - 50px)", zIndex: "0", padding: "0 15px 15px 15px", borderRadius: "15px",
      boxShadow: "box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px"
    }
  
    return (
      <div className='absolute z-0' style={mapContainerStyle}>
        <MapContainer center={[51.505, -0.09]} zoom={3} maxZoom={5} minZoom={3} style={{width: "100%", height: "100%", zIndex: "0", borderRadius: "15px"}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; Nanyang Nerds PSA Code Sprint 2024'
          />
          <DrawRouteSegment updateSegmentCallback={this.props.updateSegmentCallback} newsEvents={this.props.newsEvents} />
          {(this.props.newsEvents != undefined) ? this.props.newsEvents.map(event => 
            <Marker position={[event.location.latitude, event.location.longitude]} icon={createMarkerIcon(event.risk)}></Marker>
          ) : <div></div>}
        </MapContainer>
      </div>
    );
  }
}

function DrawRouteSegment(props: OmniMapProps) {
  const Polyline = dynamic(
    () => import('react-leaflet').then((mod) => mod.Polyline),
    { ssr: false }
  );

  const Tooltip = dynamic(
    () => import('react-leaflet').then((mod) => mod.Tooltip),
    { ssr: false }
  );

  return (
   <React.Fragment>
      {routes.map((route, index) => {
        const score = getAggregateRisk(route.name, props.newsEvents)
        
        return <Polyline
        key={index}
        positions={route.coordinates}
        eventHandlers={
          {
            click: (e: L.LeafletMouseEvent) => props.updateSegmentCallback(route.name)
          }
        }
        pathOptions={{
          color: score >= 0.7 ? RISK_RED : score >= 0.3 ? RISK_YELLOW : RISK_GREEN ,
          weight: 4.0,
          lineCap: "round"
        }}>
          <Tooltip sticky>{`${route.name}: ${score}`}</Tooltip>
      </Polyline>
      })}
   </React.Fragment>
  )
}