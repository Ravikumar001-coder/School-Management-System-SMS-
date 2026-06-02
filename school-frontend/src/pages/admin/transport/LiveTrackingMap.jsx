import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, Search, Map as MapIcon, Crosshair } from 'lucide-react';
import { getVehicles, getLatestLocation } from '../../../api/transportApi';

// Create custom icons for buses
const createBusIcon = (status) => {
  let color = '#3b82f6'; // Default Blue
  if (status === 'ACTIVE') color = '#10b981'; // Success Green
  if (status === 'IDLE' || status === 'MAINTENANCE') color = '#f59e0b'; // Warning Amber
  if (status === 'OFFLINE') color = '#94a3b8'; // Slate
  
  return L.divIcon({
    className: 'custom-bus-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-9l-2-1h-6v10h2"/><path d="M14 9h5l1 2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Component to handle map centering
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function LiveTrackingMap() {
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default Delhi
  const [mapZoom, setMapZoom] = useState(12);

  // Poll for data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vRes = await getVehicles(1);
        const allVehicles = vRes.data || [];
        setVehicles(allVehicles);

        const locMap = {};
        // Fetch latest location for all active vehicles
        const activeVehicles = allVehicles.filter(v => v.currentStatus === 'ACTIVE');
        
        await Promise.all(activeVehicles.map(async (v) => {
          try {
            const locRes = await getLatestLocation(v.id);
            if (locRes.data) {
              locMap[v.id] = locRes.data;
            }
          } catch (e) {
            // Ignore errors for individual vehicles that might not have a location yet
          }
        }));
        
        setLocations(locMap);
      } catch (err) {
        console.warn('Failed to fetch tracking data', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const handleVehicleClick = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    const loc = locations[vehicleId];
    if (loc && loc.latitude && loc.longitude) {
      setMapCenter([loc.latitude, loc.longitude]);
      setMapZoom(16);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-gray-50 overflow-hidden relative animate-fade-in">
      
      {/* Sidebar - Mobile Responsive */}
      <div className="w-full md:w-96 bg-white/95 backdrop-blur-md border-r border-slate-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] flex flex-col z-20 md:h-full relative">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Live Tracking</h2>
          <p className="text-[13px] text-slate-500 mb-4">Monitor active fleet coordinates</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search vehicle..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-[52px] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-[15px]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 md:pb-4">
          {filteredVehicles.map(bus => {
            const loc = locations[bus.id];
            const isSelected = selectedVehicle === bus.id;
            
            return (
              <div 
                key={bus.id}
                onClick={() => handleVehicleClick(bus.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-blue-100 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-500'}`}>
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900">{bus.vehicleNumber}</h4>
                      <p className="text-[12px] text-slate-500 font-medium">Cap: {bus.seatingCapacity}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border ${
                    bus.currentStatus === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {bus.currentStatus}
                  </span>
                </div>

                {loc ? (
                  <div className="mt-3 flex items-center justify-between text-[12px]">
                    <span className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-100">
                      {loc.speed || 0} km/h
                    </span>
                    <span className="text-slate-400">
                      {new Date(loc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 text-[12px] text-slate-400 italic">
                    Waiting for GPS signal...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 h-[50vh] md:h-full relative z-10">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapController center={mapCenter} zoom={mapZoom} />

          {vehicles.map(bus => {
            const loc = locations[bus.id];
            if (!loc || !loc.latitude || !loc.longitude) return null;
            
            return (
              <Marker 
                key={bus.id} 
                position={[loc.latitude, loc.longitude]}
                icon={createBusIcon(bus.currentStatus)}
                eventHandlers={{
                  click: () => {
                    setSelectedVehicle(bus.id);
                  },
                }}
              >
                <Popup className="custom-popup rounded-2xl">
                  <div className="p-1">
                    <h3 className="font-bold text-slate-900 mb-1">{bus.vehicleNumber}</h3>
                    <p className="text-sm text-slate-600 mb-2">{bus.brand}</p>
                    <div className="flex items-center justify-between text-xs font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span>Speed:</span>
                      <span className="font-bold text-slate-900">{loc.speed || 0} km/h</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        
        {/* Map Overlay Tools Blueprint */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          <button 
            onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
            className="w-12 h-12 bg-white/95 backdrop-blur shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] rounded-[16px] flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            <span className="text-2xl font-light leading-none">+</span>
          </button>
          <button 
            onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))}
            className="w-12 h-12 bg-white/95 backdrop-blur shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] rounded-[16px] flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            <span className="text-2xl font-light leading-none">-</span>
          </button>
          <button 
            onClick={() => setMapCenter([28.6139, 77.2090])}
            className="w-12 h-12 mt-4 bg-white/95 backdrop-blur shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9] rounded-[16px] flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            title="Recenter Map"
          >
            <Crosshair className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
