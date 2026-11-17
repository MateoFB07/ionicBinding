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