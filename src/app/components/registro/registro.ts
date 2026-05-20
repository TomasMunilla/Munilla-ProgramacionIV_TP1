import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
    private authService = inject(AuthService);
    private router = inject(Router);

    mensajeError: string | null = null;

    async onSubmit(form: any) {
        this.mensajeError = null;

        try {
            const {email, password, nombre, apellido, edad} = form.value;
            await this.authService.registrar(email, password, nombre, apellido, edad);
            this.router.navigate(['/home']); // la ruta se pone entre [] porque es un array de segmentos de ruta. En este caso solo tengo un segmento, 'home'
        } catch (error: any) {
            this.mensajeError = error.message;
        }
    }
}
