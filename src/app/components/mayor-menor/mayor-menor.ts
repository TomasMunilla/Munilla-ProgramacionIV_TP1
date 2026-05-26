import { Component, inject, signal, OnInit } from '@angular/core';
import { MayormenorService } from '../../services/mayormenor-service/mayormenor-service';
import { SupabaseService } from '../../services/supabase-service/supabase-service';
import { AuthService } from '../../services/auth-service/auth-service';
import { Router } from '@angular/router';

interface Carta {
    value: string;
    suit: string;
    image: string;
}

@Component({
    selector: 'app-mayor-menor',
    imports: [],
    templateUrl: './mayor-menor.html',
    styleUrl: './mayor-menor.css',
})
export class MayorMenor implements OnInit {
    // Inyección de servicios
    private juegoService = inject(MayormenorService);
    private supabaseService = inject(SupabaseService);
    private authService = inject(AuthService); // Servicio de autenticación para saber quién juega
    private router = inject(Router);

    
    protected cartaActual = signal<Carta | null>(null); // Carta visible en pantalla
    protected puntaje = signal(0); // Aciertos consecutivos
    protected termino = signal(false);
    protected mensajeError = signal<string | null>(null); // Mensaje de error si algo falla
    
    private deckId = '';
    
    async ngOnInit() {
        await this.iniciarJuego();
    }
    
    protected async iniciarJuego() {
        try {
            const { deckId, carta } = await this.juegoService.nuevoMazo();
            this.deckId = deckId;
            this.cartaActual.set(carta);
            this.puntaje.set(0);
            this.termino.set(false);
            this.mensajeError.set(null);
        } catch {
            this.mensajeError.set('Error al iniciar el juego');
        }
    }

    async elegir(respuesta: 'Mayor' | 'Menor') {
        try {
            const nuevaCarta = await this.juegoService.robarCarta(this.deckId);
            // Convertimos los valores de las cartas a números para comparar
            const valorActual = this.juegoService.valorNumerico(this.cartaActual()!.value);
            const valorNuevo = this.juegoService.valorNumerico(nuevaCarta.value);
            // Verificamos si el usuario acertó
            if (
                (respuesta === 'Mayor' && valorNuevo > valorActual) ||
                (respuesta === 'Menor' && valorNuevo < valorActual)
            ) {
                this.puntaje.update(v => v + 1); // Suma un punto
                this.cartaActual.set(nuevaCarta); // La nueva carta pasa a ser la actual
            } else {
                this.termino.set(true); // Termina el juego
                await this.guardarPartida(); // Guarda en la base de datos
            }
        } catch {
            this.mensajeError.set('Error al robar carta');
        }
    }
    // Guarda el resultado en Supabase (solo se llama cuando el usuario pierde)
    private async guardarPartida() {
        await this.supabaseService.supabase.from('partidas_mayor_menor').insert({
            usuario_id: this.authService.sesionActiva()!.id,
            usuario_email: this.authService.sesionActiva()!.email,
            aciertos: this.puntaje(),
        });
    }

    salir() {
        this.router.navigate(['/home']);
    }
}