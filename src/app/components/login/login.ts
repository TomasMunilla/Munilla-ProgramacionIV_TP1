import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private authService = inject(AuthService);
    private router = inject(Router);

    mensajeError: string | null = null;

    async onSubmit(form: any) {
        console.log('onSubmit llamado', form.value);
        this.mensajeError = null; // reseteo el mensaje de error cada vez que se intenta iniciar sesion

        try {
            const { email, password } = form.value;
            await this.authService.iniciarSesion(email, password);
            this.router.navigate(['/home']);
        } catch (error: any) {
            console.error('Error completo:', error);
            this.mensajeError = error.message;
        }
    }

    async accesoRapido(email: string, password: string) {
        this.mensajeError = null;

        try {
            await this.authService.iniciarSesion(email, password);
            this.router.navigate(['/home']);
        } catch (error: any) {
            this.mensajeError = error.message;
        }
    }
}
