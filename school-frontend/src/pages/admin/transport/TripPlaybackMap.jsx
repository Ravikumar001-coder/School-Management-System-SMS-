import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, Search, Calendar, Clock, Play, Pause, RotateCcw, Crosshair } from 'lucide-react';
import { getVehicles, getGpsHistory } from '../../../api/transportApi';
import { useToast } from '../../../hooks/useToast';

// Component to handle map centering and bounds
function MapController({ bounds, center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.flyTo(center, zoom);
    }
  }, [bounds, center, zoom, map]);
  return null;
}

export default function TripPlaybackMap() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Map state
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default Delhi
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    fetchVehicles();
    
    // Set default dates to today
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    
    // Format to YYYY-MM-DDTHH:mm
    setStartDate(start.toISOString().slice(0, 16));
    setEndDate(end.toISOString().slice(0, 16));
  }, []);

  const fetchVehicles = async () => {
    try {
      const vRes = await getVehicles(1);
      setVehicles(vRes.data || []);
    } catch (err) {
      toast.error('Failed to fetch vehicles');
    }
  };

  const loadHistory = async () => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle first');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Please select valid start and end times');
      return;
    }

    try {
      setLoading(true);
      setIsPlaying(false);
      setCurrentIndex(0);
      
      const res = await getGpsHistory(selectedVehicle, startDate + ':00', endDate + ':00');
      const data = res.data || [];
      
      if (data.length === 0) {
        toast.error('No GPS history found for the selected time range');
      } else {
        toast.success(`Loaded ${data.length} GPS points`);
        // Extract polyline path
        setMapCenter([data[0].latitude, data[0].longitude]);
      }
      setHistory(data);
    } catch (err) {
      toast.error('Failed to load GPS history');
    } finally {
      setLoading(false);
    }
  };

  // Playback Loop
  useEffect(() => {
    let interval;
    if (isPlaying && history.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= history.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed); // Adjust interval based on speed multiplier
    }
    return () => clearInterval(interval);
  }, [isPlaying, history, playbackSpeed]);

  const togglePlayback = () => {
    if (history.length === 0) return;
    if (currentIndex >= history.length - 1) {
      setCurrentIndex(0); // Restart if at end
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Derive Map Bounds
  const pathCoordinates = history.map(h => [h.latitude, h.longitude]);
  const currentPoint = history[currentIndex];

  const busIcon = L.divIcon({
    className: 'custom-bus-icon',
    html: `<div style="background-color: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-9l-2-1h-6v10h2"/><path d="M14 9h5l1 2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Control Panel */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Vehicle</label>
          <div className="relative">
            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select 
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-[14px] font-medium"
            >
              <option value="">-- Select Vehicle --</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.registrationNumber})</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Start Time</label>
          <input 
            type="datetime-local" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-[14px]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">End Time</label>
          <input 
            type="datetime-local" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-[14px]"
          />
        </div>

        <div>
          <button 
            onClick={loadHistory}
            disabled={loading}
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Search className="h-4 w-4" />}
            {loading ? 'Loading...' : 'Fetch History'}
          </button>
        </div>
      </div>

      {/* Map & Playback Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        
        {/* Playback Controls Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col h-full overflow-hidden">
          <h2 className="font-bold text-slate-900 text-lg mb-6">Playback Controls</h2>
          
          <div className="space-y-6 flex-1">
            {/* Speed Selector */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Playback Speed</p>
              <div className="flex gap-2">
                {[1, 5, 10, 20].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      playbackSpeed === speed ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Play/Pause Button */}
            <button 
              onClick={togglePlayback}
              disabled={history.length === 0}
              className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                history.length === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
              }`}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              {isPlaying ? 'Pause Playback' : 'Start Playback'}
            </button>

            <button 
              onClick={() => { setIsPlaying(false); setCurrentIndex(0); }}
              disabled={history.length === 0}
              className="w-full py-3 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>

          {/* Telemetry Dashboard */}
          {currentPoint && (
            <div className="bg-slate-900 rounded-xl p-4 text-white space-y-3 mt-auto">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                 <span className="text-slate-400 text-xs">Time</span>
                 <span className="font-mono font-bold text-sm">{formatTime(currentPoint.recordedAt)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                 <span className="text-slate-400 text-xs">Speed</span>
                 <span className={`font-mono font-bold text-sm ${currentPoint.speed > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                   {currentPoint.speed} km/h
                 </span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-slate-400 text-xs">Ignition</span>
                 <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${currentPoint.ignitionStatus ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                   {currentPoint.ignitionStatus ? 'ON' : 'OFF'}
                 </span>
              </div>
            </div>
          )}
          
          {history.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400 font-medium">Point {currentIndex + 1} of {history.length}</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / history.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Draw the full history path */}
            {pathCoordinates.length > 0 && (
              <Polyline positions={pathCoordinates} color="#94a3b8" weight={4} opacity={0.6} dashArray="5, 10" />
            )}

            {/* Draw the animated bus marker */}
            {currentPoint && (
              <Marker position={[currentPoint.latitude, currentPoint.longitude]} icon={busIcon}>
                <Popup className="custom-popup">
                  <div className="font-sans">
                    <p className="font-bold text-slate-900">Recorded: {formatTime(currentPoint.recordedAt)}</p>
                    <p className="text-sm text-slate-600">Speed: {currentPoint.speed} km/h</p>
                  </div>
                </Popup>
              </Marker>
            )}

            <MapController 
              bounds={pathCoordinates.length > 0 && currentIndex === 0 ? pathCoordinates : null} 
              center={currentPoint ? [currentPoint.latitude, currentPoint.longitude] : mapCenter} 
              zoom={15} 
            />
          </MapContainer>
        </div>

      </div>
    </div>
  );
}
