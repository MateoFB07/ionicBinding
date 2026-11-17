import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import type { SearchbarCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cubeOutline } from 'ionicons/icons';

import { PackageCardComponent } from '../components/package-card/package-card.component';
import type { PackagePriority, PackageStatus, WarehousePackage } from '../models/package.model';
import { PackageService } from '../services/package.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonContent,
    IonList,
    IonIcon,
    CommonModule,
    PackageCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly packageService = inject(PackageService);

  // Signals de estado local para los filtros de la UI
  public readonly searchTerm = signal<string>('');
  public readonly selectedPriority = signal<PackagePriority | 'ALL'>('ALL');

  constructor() {
    addIcons({ cubeOutline });
  }

  // Estado reactivo computado: cero suscripciones manuales, cero fugas de memoria
  public readonly filteredPackages = computed<WarehousePackage[]>(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const priority = this.selectedPriority();
    const allPackages = this.packageService.packages();

    return allPackages.filter((pkg) => {
      const matchesSearch =
        term === '' || pkg.trackingCode.toLowerCase().includes(term) || pkg.destinationHub.toLowerCase().includes(term);

      const matchesPriority = priority === 'ALL' || pkg.priority === priority;

      return matchesSearch && matchesPriority;
    });
  });

  onSearchInput(event: SearchbarCustomEvent): void {
    const value = event.detail.value ?? '';
    this.searchTerm.set(value);
  }

  onPriorityFilterChange(event: CustomEvent): void {
    const value = event.detail.value as PackagePriority | 'ALL';
    this.selectedPriority.set(value);
  }

  onStatusChanged(event: { id: string; newStatus: PackageStatus }): void {
    this.packageService.updatePackageStatus(event.id, event.newStatus);
  }
}