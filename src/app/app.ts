import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
    protected router = inject(Router);
    protected authService = inject(AuthService);
    protected haySesion = computed(() => this.authService.sesionActiva() !== null); // si hay una sesión activa, haySesion será true, de lo contrario será false
    protected esAdmin = computed(() => this.authService.sesionActiva()?.es_admin === true);

    protected readonly title = signal('Munilla-ProgramacionIV_TP1');

    protected nombre = computed(() => this.authService.sesionActiva()?.nombre ?? ''); 
    protected apellido = computed(() => this.authService.sesionActiva()?.apellido ?? '');

    cerrarSesion() {
        this.authService.cerrarSesion();
        this.router.navigate(['/home']);
    }
}
