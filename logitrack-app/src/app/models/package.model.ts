export type PackagePriority = 'CRITICAL' | 'STANDARD' | 'LOW';
export type PackageStatus = 'IN_TRANSIT' | 'INSPECTED' | 'REJECTED';

export interface WarehousePackage {
  id: string;             // UUID v4
  trackingCode: string;   // Formato LTK-XXXX-ES
  destinationHub: string; // Ej: 'HUB-MAD-BARAJAS', 'HUB-BCN-ZAL'
  weightKg: number;
  priority: PackagePriority;
  status: PackageStatus;
  timestamp: Date;
}