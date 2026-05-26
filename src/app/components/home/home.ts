import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
    private authService = inject(AuthService);

    protected nombre = computed(() => this.authService.sesionActiva()?.nombre ?? ''); // computed es una función de Angular que me permite crear propiedades reactivas que se actualizan automáticamente cuando cambian las señales que utilizan. En este caso, creo una propiedad nombre que depende de la señal sesionActiva del AuthService. Cada vez que la sesión activa cambie (por ejemplo, cuando el usuario inicie o cierre sesión), el valor de nombre se actualizará automáticamente con el nombre del usuario o con una cadena vacía si no hay sesión activa.
    protected apellido = computed(() => this.authService.sesionActiva()?.apellido ?? ''); // De esta forma, puedo mostrar el nombre y apellido del usuario en la interfaz sin tener que preocuparme por actualizar manualmente esos valores cada vez que cambie la sesión.
    protected haySesion = computed(() => this.authService.sesionActiva() !== null); // Sabiendo si hay una sesión activa o no, puedo mostrar u ocultar ciertos elementos en la interfaz.

    cerrarSesion() {
        this.authService.cerrarSesion();
    }
}
