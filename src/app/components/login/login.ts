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
    if (form.invalid) return;
    const { email, password } = form.value;
    if (!email || !password) {
        this.mensajeError = 'Completá todos los campos.';
        return;
    }
    try {
        await this.authService.iniciarSesion(email, password);
        this.router.navigate(['/home']);
    } catch (error: any) {
        console.error('Error completo:', error);
        this.mensajeError = error?.message || error || 'Error al iniciar sesión. Verificá tus credenciales.';
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
