import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarjeta-info',
  templateUrl: './tarjeta-info.component.html',
  styleUrls: ['./tarjeta-info.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TarjetaInfoComponent {
  @Input() titulo: string = '';
  @Input() valor: string | number = 0;
  @Input() icono: string = 'information-circle-outline';
  @Input() colorIcono: string = 'primary';

  constructor() {}
}