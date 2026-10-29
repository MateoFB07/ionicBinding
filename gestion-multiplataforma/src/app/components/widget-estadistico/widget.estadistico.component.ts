import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent 
} from '@ionic/angular';

@Component({
  selector: 'app-widget-estadistico',
  standalone: true,
  imports: [
    CommonModule, 
    IonCard, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle, 
    IonCardContent
  ],
  template: `
    <ion-card 
      [style.border-left]="'5px solid ' + colorBorde" 
      class="ion-no-margin widget-card"
      (click)="notificarClic()">
      <ion-card-header>
        @if (subtitulo) {
          <ion-card-subtitle class="widget-subtitulo">{{ subtitulo }}</ion-card-subtitle>
        }
        <ion-card-title class="widget-titulo">{{ titulo }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <h2 class="widget-valor">
          {{ valor }}
        </h2>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .widget-card {
      background: var(--ion-card-background, #ffffff);
      transition: background 0.3s ease, color 0.3s ease;
    }
    .widget-subtitulo {
      color: var(--ion-color-medium, #666666);
      font-size: 0.85rem;
    }
    .widget-titulo {
      color: var(--ion-text-color, #1f2937);
      font-size: 1.1rem;
      font-weight: 600;
    }
    .widget-valor {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: var(--ion-text-color, #1f2937);
    }
  `]
})
export class WidgetEstadisticoComponent {
  @Input({ required: true }) titulo: string = '';
  @Input({ required: true }) valor: string | number | null = 0;
  @Input() subtitulo: string = '';
  @Input() colorBorde: string = '#3880ff';

  @Output() alHacerClic = new EventEmitter<string>();

  notificarClic(): void {
    this.alHacerClic.emit(this.titulo);
  }
}