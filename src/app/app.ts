import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
    protected authService = inject(AuthService);
    protected haySesion = computed(() => this.authService.sesionActiva() !== null); // si hay una sesión activa, haySesion será true, de lo contrario será false

    protected readonly title = signal('Munilla-ProgramacionIV_TP1');

    nombre = computed(() => this.authService.sesionActiva()?.nombre ?? ''); 
    apellido = computed(() => this.authService.sesionActiva()?.apellido ?? '');

    cerrarSesion() {
        this.authService.cerrarSesion();
    }
}
