import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent 
} from '@ionic/angular';

@Component({
  selector: 'app-widget-estadistico',
  templateUrl: './widget-estadistico.component.html',
  styleUrls: ['./widget-estadistico.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent
  ]
})
export class WidgetEstadisticoComponent {
  // Inputs: Propiedades que vienen desde el componente padre
  @Input({ required: true }) titulo: string = '';
  @Input({ required: true }) valor: string | number = 0;
  @Input() subtitulo: string = '';
  @Input() colorBorde: string = '#3880ff';

  // Output: Evento personalizado emitido hacia el padre
  @Output() alHacerClic = new EventEmitter<string>();

  notificarClic(): void {
    this.alHacerClic.emit(this.titulo);
  }
}