import { Injectable, signal, WritableSignal } from '@angular/core';
import { WarehousePackage, PackageStatus } from '../models/package.model';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  // Estado privado con Signals reactivas
  private readonly packagesSignal: WritableSignal<WarehousePackage[]> = signal<WarehousePackage[]>([
    {
      id: 'c0a80101-8b2f-4c11-9e11-1a2b3c4d5e6f',
      trackingCode: 'LTK-8921-ES',
      destinationHub: 'HUB-MAD-BARAJAS',
      weightKg: 12.4,
      priority: 'CRITICAL',
      status: 'IN_TRANSIT',
      timestamp: new Date('2026-11-11T08:30:00'),
    },
    {
      id: 'b7b20202-9c3f-5d22-af22-2b3c4d5e6f7a',
      trackingCode: 'LTK-4032-ES',
      destinationHub: 'HUB-BCN-ZAL',
      weightKg: 3.8,
      priority: 'STANDARD',
      status: 'IN_TRANSIT',
      timestamp: new Date('2026-11-11T08:45:00'),
    },
    {
      id: 'a1a30303-0d4f-6e33-bf33-3c4d5e6f7a8b',
      trackingCode: 'LTK-1109-ES',
      destinationHub: 'HUB-VLC-FUERTE',
      weightKg: 25.1,
      priority: 'LOW',
      status: 'INSPECTED',
      timestamp: new Date('2026-11-11T09:00:00'),
    },
    {
      id: 'd2e40404-1a5f-7e44-cf44-4d5e6f7a8b9c',
      trackingCode: 'LTK-7745-ES',
      destinationHub: 'HUB-SEV-SANPABLO',
      weightKg: 8.6,
      priority: 'CRITICAL',
      status: 'REJECTED',
      timestamp: new Date('2026-11-11T09:15:00'),
    },
    {
      id: 'e3f50505-2b6f-8f55-df55-5e6f7a8b9c0d',
      trackingCode: 'LTK-2260-ES',
      destinationHub: 'HUB-BIL-BILBAO',
      weightKg: 17.2,
      priority: 'STANDARD',
      status: 'IN_TRANSIT',
      timestamp: new Date('2026-11-11T09:30:00'),
    },
    {
      id: 'f4a60606-3c7f-9f66-ef66-6f7a8b9c0d1e',
      trackingCode: 'LTK-5583-ES',
      destinationHub: 'HUB-MAD-GETAFE',
      weightKg: 1.9,
      priority: 'LOW',
      status: 'INSPECTED',
      timestamp: new Date('2026-11-11T09:45:00'),
    },
  ]);

  // Señal de solo lectura expuesta a los componentes
  public readonly packages = this.packagesSignal.asReadonly();

  // Actualización inmutable del estado de un paquete
  updatePackageStatus(id: string, newStatus: PackageStatus): void {
    this.packagesSignal.update((packages) =>
      packages.map((pkg) => (pkg.id === id ? { ...pkg, status: newStatus } : pkg))
    );
  }
}