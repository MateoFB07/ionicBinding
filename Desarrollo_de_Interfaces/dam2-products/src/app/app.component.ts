import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonApp, IonButton, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonButton,
    IonRouterOutlet
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);

  // Punto 5: Botón de modo oscuro/claro. Guarda el tema seleccionado.
  isDarkMode: boolean;

  constructor() {
    // Punto 5: recupera el tema guardado o usa la preferencia del dispositivo.
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = this.document.defaultView
      ?.matchMedia('(prefers-color-scheme: dark)')
      .matches ?? false;

    this.isDarkMode = savedTheme === 'dark'
      ? true
      : savedTheme === 'light'
        ? false
        : prefersDark;

    this.applyTheme();
  }

  // Punto 5: el botón alterna el tema y recuerda la elección.
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  // Punto 5: aplica o quita la paleta oscura de Ionic.
  private applyTheme(): void {
    this.document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);
  }
}