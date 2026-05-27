import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
    private cdr = inject(ChangeDetectorRef);

    protected email = '';
    protected password = '';

    protected mensajeError: string | null = null;

    async onSubmit(form: any) {
        console.log('onSubmit llamado', form.value);
        this.mensajeError = null; // reseteo el mensaje de error cada vez que se intenta iniciar sesion
        
        if (form.invalid) {
            this.mensajeError = 'Completá los campos correctamente.';
            return;
        }
        
        if (!this.email || !this.password) {
            this.mensajeError = 'Completá todos los campos.';
            return;
        }
        try {
            await this.authService.iniciarSesion(this.email, this.password);
            this.router.navigate(['/home']);
        } catch (error: any) {
            console.error('Error completo:', error);
            this.mensajeError = 'Credenciales incorrectas.';
            this.cdr.detectChanges();
        }
    }

    async accesoRapido(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}
