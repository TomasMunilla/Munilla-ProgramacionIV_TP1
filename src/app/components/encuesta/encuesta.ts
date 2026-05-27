import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import { SupabaseService } from '../../services/supabase-service/supabase-service';
@Component({
  selector: 'app-encuesta',
  imports: [FormsModule],  // Necesario para [(ngModel)]
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css',
})
export class Encuesta {
    
    private authService = inject(AuthService);
    private supabaseService = inject(SupabaseService);
    private router = inject(Router);

    
    protected nombre = '';
    protected apellido = '';
    protected edad: number | null = null;
    protected telefono = '';

    
    protected opinion = ''; // Pregunta 1: campo de texto libre
    
    protected juegosGustados = { // Pregunta 2: checkboxes (objeto con un boolean por juego)
        ahorcado: false,
        mayorMenor: false,
        preguntados: false,
        simonDice: false,
    };

    
    protected recomendaria: string | null = null; // Pregunta 3: radio button ( "si", "no" o "tal_vez" )
    
    protected mensajeError: string | null = null;

    protected enviado = false;
    
    async onSubmit() {
        // Limpio mensajes anteriores
        this.mensajeError = null;
        
        // --- Validaciones ---
        if (!this.nombre || !this.apellido || this.edad === null || !this.telefono || !this.opinion || !this.recomendaria) { // Si algún campo obligatorio está vacío
            this.mensajeError = 'Todos los campos son obligatorios.';
            return;
        }

        const tieneNumeros = (s: string) => s.split('').some(caracter => caracter !== '' && !isNaN(Number(caracter)));
        if (tieneNumeros(this.nombre)) {
            this.mensajeError = 'El nombre no puede contener números.';
            return;
        }

        if (tieneNumeros(this.apellido)) {
            this.mensajeError = 'El apellido no puede contener números.';
            return;
        }
        
        if (this.edad < 18 || this.edad > 99) { // Edad debe estar entre 18 y 99
            this.mensajeError = 'La edad debe estar entre 18 y 99 años.';
            return;
        }
        
        if (isNaN(Number(this.telefono))) {
            this.mensajeError = 'El teléfono debe ser un número.';
            return;
        }

        
        if (this.telefono.length > 10) {
            this.mensajeError = 'El teléfono no puede tener más de 10 dígitos.';
            return;
        }

        
        const sesion = this.authService.sesionActiva();
        if (!sesion) return;
        
        const juegosSeleccionados = Object.entries(this.juegosGustados) // filtro los juegos le gustaron al usuario
            .filter(([, valor]) => valor)      // solo los que están en true
            .map(([clave]) => clave);          // agarro el nombre del juego
        

        try {
            await this.supabaseService.supabase.from('respuestas_encuesta').insert({
                usuario_id: sesion.id,
                usuario_email: sesion.email,
                nombre: this.nombre,
                apellido: this.apellido,
                edad: this.edad,
                telefono: this.telefono,
                respuestas: {
                    opinion: this.opinion,
                    juegos_gustados: juegosSeleccionados,
                    recomendaria: this.recomendaria,
                },
            });
            this.enviado = true;
        } catch (error: any) {
            this.mensajeError = error?.message || 'Error al enviar la encuesta.';
        }
    }
    salir() {
        this.router.navigate(['/home']);
    }
}