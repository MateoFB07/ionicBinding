import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

import { PackageStatus, WarehousePackage } from '../../models/package.model';

@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonItemOptions,
    IonItemOption,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageCardComponent {
  @Input({ required: true }) packageData!: WarehousePackage;

  @Output() statusChange = new EventEmitter<{ id: string; newStatus: PackageStatus }>();

  constructor() {
    // Registro explícito de iconos de Ionicons para Standalone Components
    addIcons({ checkmarkCircleOutline, closeCircleOutline });
  }

  markAsInspected(): void {
    this.statusChange.emit({
      id: this.packageData.id,
      newStatus: 'INSPECTED',
    });
  }

  markAsRejected(): void {
    this.statusChange.emit({
      id: this.packageData.id,
      newStatus: 'REJECTED',
    });
  }
}