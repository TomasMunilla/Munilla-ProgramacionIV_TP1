import { Component, signal, inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase-service/supabase-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';

@Component({
  selector: 'app-simon-dice',
  imports: [],
  templateUrl: './simon-dice.html',
  styleUrl: './simon-dice.css',
})
export class SimonDice {
    supabaseService = inject(SupabaseService);
    router = inject(Router);
    authService = inject(AuthService)

    coloresDisponibles = ['rojo', 'verde', 'azul', 'amarillo'];
    secuencia: string[] = []; // la secuencia de colores que el jugador tiene que repetir
    indiceJugador = 0;  // en que paso de la secuencia esta el jugador

    puntaje = signal(0);
    termino = signal(false); // true cuando se pierde
    mostrando = signal(false); // es true cuando la maquina esta mostrando la secuencia
    colorIluminado = signal<string | null>(null);

    iniciarJuego() {
        this.secuencia = [];
        this.puntaje.set(0);
        this.termino.set(false);
        this.siguienteRonda();
        
    }

    private async siguienteRonda() {
        const colorRandom = this.coloresDisponibles[Math.floor(Math.random() * 4)]; // 
        this.secuencia.push(colorRandom);
        this.indiceJugador = 0;
        await this.esperar(1000)
        this.mostrarSecuencia();
    }

    private async mostrarSecuencia() {
        this.mostrando.set(true);
        for (const color of this.secuencia) {
            this.colorIluminado.set(color);
            await this.esperar(500);
            this.colorIluminado.set(null);
            await this.esperar(400);
        }

        this.mostrando.set(false); // cuando se termina de mostrar la secuencua, el jugador ya puede repetirla
    }

    private esperar(ms: number): Promise<void> { // funcion para esperar x ms
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    elegirColor(color: string) {
        if (this.mostrando() || this.termino()) return; // si el juego termino o la maquina esta mostrando la secuencia, se ignoran los clicks

        this.colorIluminado.set(color);
        setTimeout(() => this.colorIluminado.set(null), 300);
        
        if(color === this.secuencia[this.indiceJugador]) { // si acerto un paso
            this.indiceJugador++;

            if (this.indiceJugador >= this.secuencia.length) { // si termino toda la secuencia
                this.puntaje.update(p => p+1);
                setTimeout(() => this.siguienteRonda(), 600);
            }
        } else {            // no acerto (perdio)
            this.termino.set(true);
            this.guardarPartida();
        }
    }

    private async guardarPartida() {
        await this.supabaseService.supabase.from('partidas_simon_dice').insert({
            usuario_id: this.authService.sesionActiva()!.id,
            usuario_email: this.authService.sesionActiva()!.email,
            puntaje: this.puntaje()
        });
    }

    salir() {
        this.router.navigate(['/home']);
    }
}
