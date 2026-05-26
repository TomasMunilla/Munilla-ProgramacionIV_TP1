import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

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
        
        if (form.invalid) return;
        
        const { email, password, nombre, apellido, edad } = form.value;
        
        if (!email || !password || !nombre || !apellido || !edad) {
            this.mensajeError = 'Todos los campos son obligatorios.';
            return;
        }

        const numeros = '0123456789';
        let nombreInvalido = false;
        for (let n of numeros) {
            if (nombre.includes(n) || apellido.includes(n)) {
                nombreInvalido = true;
                break;
            }
        }
        if (nombreInvalido) {
            this.mensajeError = 'El nombre y apellido no pueden contener numeros.'
            return;
        }

        if (password.length < 6) {
            this.mensajeError = 'La contraseña debe tener al menos 6 caracteres.';
            return;
        }
        
        if (edad < 1 || edad > 120) {
            this.mensajeError = 'Ingresá una edad válida (1-120).';
            return;
        }
        
        try {
            await this.authService.registrar(email, password, nombre, apellido, edad);
            this.router.navigate(['/home']);
        } catch (error: any) {
            this.mensajeError = error?.message || error || 'Error al registrarse.';
        }
    }
}