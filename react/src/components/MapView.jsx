import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

/* global L */

/**
 * MapView — thin React wrapper over Leaflet (loaded globally via CDN in index.html).
 * markers: [{ lat, lng, color, icon, popup }]
 * circles: [{ lat, lng, color, radius, popup }]
 */
export default function MapView({ center = [22.9734, 78.6569], zoom = 5, markers = [], circles = [], height = 480 }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const { theme } = useApp();

  // create / destroy map
  useEffect(() => {
    if (!window.L || !elRef.current) return;
    const map = L.map(elRef.current, { zoomControl: true, attributionControl: false, scrollWheelZoom: false })
      .setView(center, zoom);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tile layer follows theme
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;
    if (map._tile) map.removeLayer(map._tile);
    const url = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    map._tile = L.tileLayer(url, { maxZoom: 19 }).addTo(map);
  }, [theme]);

  // markers + circles
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !window.L) return;
    layer.clearLayers();
    const pin = (color, icon) => L.divIcon({
      className: '', iconSize: [26, 26], iconAnchor: [13, 26],
      html: `<div class="map-pin" style="width:26px;height:26px;background:${color}"><i class="fa-solid ${icon}"></i></div>`,
    });
    markers.forEach((m) => {
      const mk = L.marker([m.lat, m.lng], { icon: pin(m.color || '#1b7df5', m.icon || 'fa-location-dot') });
      if (m.popup) mk.bindPopup(m.popup);
      mk.addTo(layer);
    });
    circles.forEach((c) => {
      const cm = L.circleMarker([c.lat, c.lng], {
        radius: c.radius || 12, color: c.color, fillColor: c.color, fillOpacity: 0.45, weight: 1.5,
      });
      if (c.popup) cm.bindPopup(c.popup);
      cm.addTo(layer);
    });
  }, [markers, circles]);

  return <div ref={elRef} style={{ height }} className="w-full" />;
}
