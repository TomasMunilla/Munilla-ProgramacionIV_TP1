import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import { SupabaseService } from '../../services/supabase-service/supabase-service';

@Component({
  selector: 'app-ahorcado',
  imports: [],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit {
    private router = inject(Router);
    private authService = inject(AuthService);
    private supabaseService = inject(SupabaseService);

    protected palabras:string[] = ['AMIGOS', 'CAMPERA', "PELOTA","ELEFANTE","LOBO","COLECTIVO","COMPUTADORA","ARQUITECTURA","CAFE","CELULAR","PERRO","VENTANA","REMERA","ZAPATILLAS","ESCRITORIO"]; 
    
    protected indicePalabraActual: number = 0;
    protected palabraActual: string[] = [];       // palabra actual separada en letras
    protected letrasAdivinadas: string[] = [];    // letras que el usuario lleva acertadas
    protected letrasProbadas: string[] = [];      // letras que el usuario ha seleccionado (acertadas o no)
    protected intentosFallidos = 0;
    protected maxIntentos = 6;

    private tiempoInicio: number = 0; 
    protected tiempoTranscurrido: number = 0; 

    protected mostrarMensajeVictoria = signal(false);
    protected mostrarMensajeDerrota = signal(false);

    ngOnInit() {
        // Mezcla la lista de palabras al azar
        this.palabras.sort(() => Math.random() - 0.5);
        this.cargarPalabra();
        this.tiempoInicio = Date.now(); // Inicia el temporizador
    }

    private cargarPalabra() {
        this.palabraActual = this.palabras[this.indicePalabraActual].split('');
        this.letrasAdivinadas = [];
        this.letrasProbadas = [];
        this.intentosFallidos = 0;
    }

    seleccionarLetra(letra: string) {
        if (this.letrasProbadas.includes(letra)) return;

        this.letrasProbadas.push(letra);

        if (this.palabraActual.includes(letra)) { // SI ACERTO
            this.letrasAdivinadas.push(letra);
            if (this.palabraActual.every(l => this.letrasAdivinadas.includes(l))){ //
                this.tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);
                this.mostrarMensajeVictoria.set(true);    
                this.guardarPartida('victoria');
            }

        } else { // SI FALLO
            this.intentosFallidos++;
            if (this.intentosFallidos >= this.maxIntentos) {
                this.tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);
                this.mostrarMensajeDerrota.set(true);
                this.guardarPartida('derrota');
            }
        }
    }

    avanzar() {
        this.mostrarMensajeVictoria.set(false);
        this.mostrarMensajeDerrota.set(false);
        this.indicePalabraActual++;
        if (this.indicePalabraActual >= this.palabras.length) {
            this.indicePalabraActual = 0; // Reinicia el juego si se han agotado las palabras
        }
        this.cargarPalabra();
    }

    private async guardarPartida(resultado: string) {
        await this.supabaseService.supabase.from('partidas_ahorcado').insert({
        usuario_id: this.authService.sesionActiva()!.id,
        usuario_email: this.authService.sesionActiva()!.email,
        letras_seleccionadas: this.letrasProbadas.length,
        tiempo_segundos: this.tiempoTranscurrido,
        resultado: resultado,
    });
    }

    salir() {
        this.router.navigate(['/home']);
    }
}
