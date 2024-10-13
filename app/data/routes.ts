import { LatLngExpression } from "leaflet";

export class RouteSegment {
    name: string
    coordinates: LatLngExpression[]

    constructor(name: string, coordinates: LatLngExpression[]) {
        this.name = name
        this.coordinates = coordinates
    }
}

export const routes = [
    new RouteSegment("Panama Canal", [{lat: 8.9667, lng: -79.5667}, {lat: 9.1012, lng: -79.4024}]),
    new RouteSegment("Entrance into Caribbean Sea", [{lat: 9.1012, lng: -79.4024}, {lat: 12.0000, lng: -70.0000}]),
    new RouteSegment("Near Caribbean Sea", [{lat: 12.0000, lng: -70.0000}, {lat: 18.0000, lng: -60.0000}]),
    new RouteSegment("Across the Atlantic", [{lat: 18.0000, lng: -60.0000}, {lat: 28.0000, lng: -40.0000}]),
    new RouteSegment("Towards Strait of Gibraltar", [{lat: 28.0000, lng: -40.0000}, {lat: 35.9555, lng: -5.9886}]),
    new RouteSegment("Entrance into Strait of Gibraltar", [{lat: 35.9555, lng: -5.9886}, {lat: 36.0000, lng: 0.0000}]),
    new RouteSegment("Across the Mediterranean", [{lat: 36.0000, lng: 0.0000}, {lat: 34.5000, lng: 24.0000}]),
    new RouteSegment("Towards Suez Canal", [{lat: 34.5000, lng: 24.0000}, {lat: 31.2653, lng: 32.3019}]),
    new RouteSegment("Entrance into Suez Canal", [{lat: 31.2653, lng: 32.3019}, {lat: 30.5852, lng: 32.2708}]),
    new RouteSegment("Middle of Suez Canal", [{lat: 30.5852, lng: 32.2708}, {lat: 29.9500, lng: 32.5839}]),
    new RouteSegment("Entrance into Southern End of Red Sea", [{lat: 29.9500, lng: 32.5839}, {lat: 29.9783, lng: 32.5550}]),
    new RouteSegment("Southern End of Red Sea", [{lat: 29.9783, lng: 32.5550}, {lat: 20.0000, lng: 38.0000}]),
    new RouteSegment("Bab el Mandeb", [{lat: 20.0000, lng: 38.0000}, {lat: 12.6304, lng: 43.1400}]),
    new RouteSegment("Gulf of Aden", [{lat: 12.6304, lng: 43.1400}, {lat: 10.0000, lng: 52.0000}]),
    new RouteSegment("Entrance into Arabian Sea", [{lat: 10.0000, lng: 52.0000}, {lat: 10.0000, lng: 60.0000}]),
    new RouteSegment("Middle of Arabian Sea", [{lat: 10.0000, lng: 60.0000}, {lat: 5.0000, lng: 70.0000}]),
    new RouteSegment("Indian Ocean", [{lat: 5.0000, lng: 70.0000}, {lat: 3.0000, lng: 85.0000}]),
    new RouteSegment("Sumatra", [{lat: 3.0000, lng: 85.0000}, {lat: 7.4074, lng: 97.4260}]),
    new RouteSegment("Into Straits of Malacca", [{lat: 7.4074, lng: 97.4260}, {lat: 2.9139, lng: 100.7981}]),
    new RouteSegment("Into Singapore", [{lat: 2.9139, lng: 100.7981}, {lat: 1.2108, lng: 103.6177}]),

    /**
    new RouteSegment("Approaching Southeast Asia", [{lat: 10.0000, lng: 60.0000}, {lat: 7.4074, lng: 97.4260}]), 
    new RouteSegment("Navigating through the Malacca Strait", [{lat: 7.4074, lng: 97.4260}, {lat: 2.9139, lng: 100.7981}]), 
    new RouteSegment("Arriving in Singapore", [{lat: 2.9139, lng: 100.7981}, {lat: 1.2108, lng: 103.6177}]), 

    new RouteSegment("Starting point in Europe", [{lat: 51.8882, lng: 0.3259}, {lat: 49.0522, lng: -0.5072}]), 
    new RouteSegment("Traveling down the Atlantic coast", [{lat: 49.0522, lng: -0.5072}, {lat: 38.7069, lng: -9.1399}]), 
    new RouteSegment("Approaching the Canary Islands", [{lat: 38.7069, lng: -9.1399}, {lat: 32.747954, lng: -10.688375}]), 
    new RouteSegment("Heading towards the coast of West Africa", [{lat: 32.747954, lng: -10.688375}, {lat: 21.470896, lng: -18.994039}]), 
    new RouteSegment("Following the coast down", [{lat: 21.470896, lng: -18.994039}, {lat: 10.663900, lng: -18.286926}]), 
    new RouteSegment("Near the Cape Verde Islands", [{lat: 10.663900, lng: -18.286926}, {lat: 2.521525, lng: -7.644331}]), 
    new RouteSegment("Navigating through the Gulf of Guinea", [{lat: 2.521525, lng: -7.644331}, {lat: -1.705782, lng: 7.700024}]), 
    new RouteSegment("Reaching the Cape of Good Hope", [{lat: -1.705782, lng: 7.700024}, {lat: -34.3568, lng: 18.4740}]), 
    new RouteSegment("Heading towards the Indian Ocean", [{lat: -34.3568, lng: 18.4740}, {lat: -32.607686, lng: 33.621023}]), 
    new RouteSegment("Continuing across the Indian Ocean", [{lat: -32.607686, lng: 33.621023}, {lat: -16.253554, lng: 42.126452}]), 
    new RouteSegment("Approaching the Arabian Sea", [{lat: -16.253554, lng: 42.126452}, {lat: 3.987246, lng: 57.109012}]), 
    new RouteSegment("Returning to the East", [{lat: 3.987246, lng: 57.109012}, {lat: 10.0000, lng: 60.0000}]),

    new RouteSegment("Starting from New York City", [{lat: 40.7128, lng: -74.0060}, {lat: 36.8529, lng: -75.9780}]), 
    new RouteSegment("Heading down the Eastern US", [{lat: 36.8529, lng: -75.9780}, {lat: 25.7617, lng: -80.1918}]), 
    new RouteSegment("Crossing to London", [{lat: 25.7617, lng: -80.1918}, {lat: 51.5074, lng: -0.1278}]), 
    new RouteSegment("Moving towards Amsterdam", [{lat: 51.5074, lng: -0.1278}, {lat: 52.3740, lng: 4.8897}]), 
    new RouteSegment("Approaching Portugal", [{lat: 52.3740, lng: 4.8897}, {lat: 38.7169, lng: -9.1399}]), 
    new RouteSegment("Starting from Buenos Aires", [{lat: -34.6037, lng: -58.3816}, {lat: -23.5505, lng: -46.6333}]), 
    new RouteSegment("Heading to Lisbon", [{lat: -23.5505, lng: -46.6333}, {lat: 38.7169, lng: -9.1399}]), 
    new RouteSegment("Entrance to the Canal", [{lat: 8.9667, lng: -79.5667}, {lat: 9.0000, lng: -79.5000}]), 
    new RouteSegment("Navigating through the Canal", [{lat: 9.0000, lng: -79.5000}, {lat: 9.1012, lng: -79.4024}]), 
    new RouteSegment("Exiting the Canal", [{lat: 9.1012, lng: -79.4024}, {lat: 9.2000, lng: -78.9000}]), 
    new RouteSegment("Heading towards Caribbean Sea", [{lat: 9.2000, lng: -78.9000}, {lat: 12.0000, lng: -70.0000}]), 
    new RouteSegment("Straits of Singapore", [{lat: 1.316034, lng: 104.256212}, {lat: 4.376874, lng: 105.634850}]), 
    new RouteSegment("South China Sea", [{lat: 4.376874, lng: 105.634850}, {lat: 9.093616, lng: 108.844136}]), 
    new RouteSegment("Macao", [{lat: 9.093616, lng: 108.844136}, {lat: 12.575147, lng: 116.891821}]), 
    new RouteSegment("Japan", [{lat: 12.575147, lng: 116.891821}, {lat: 12.914020, lng: 122.129258}]),
    */ 
];