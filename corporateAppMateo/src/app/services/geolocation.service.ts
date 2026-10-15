import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {
    readonly oficinaLat = 40.4452;
    readonly oficinaLon = -3.6115;

    async getCurrentPosition() {
       const data = await Geolocation.getCurrentPosition({
           enableHighAccuracy: false,
           maximumAge: 30_000,
           timeout: 60_000
       });
       return data.coords;
   }

   calcularDistancia(
       lat1: number,
       lon1: number,
       lat2: number,
       lon2: number
   ): number {
       const R = 6371;
       const dLat = (lat2 - lat1) * Math.PI / 180;
       const dLon = (lon2 - lon1) * Math.PI / 180;
       const a =
           Math.sin(dLat / 2) ** 2 +
           Math.cos(lat1 * Math.PI / 180) *
           Math.cos(lat2 * Math.PI / 180) *
           Math.sin(dLon / 2) ** 2;
       const c = 2 * Math.atan2(
           Math.sqrt(a),
           Math.sqrt(1 - a)
       );
       return R * c;
   }
}