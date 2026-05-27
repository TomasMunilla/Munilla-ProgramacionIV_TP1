import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth-service';
import { SupabaseService } from '../../services/supabase-service/supabase-service';
import { PreguntadosService } from '../../services/preguntados-service/preguntados-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preguntados',
  imports: [],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements OnInit {
    private preguntadosService = inject(PreguntadosService);
    private router = inject(Router);
    private authService = inject(AuthService);
    private supabaseService = inject(SupabaseService);

    private preguntas: any[] = [];
    private indicePreguntaActual: number = 0;
    protected aciertos: number = 0;

    protected preguntaActual = signal<string>('');
    protected respuestaCorrecta = signal<string>('');
    protected posiblesRespuestas = signal<string[]>([]);
    protected respuestaSeleccionada = signal<string | null>(null);
    protected mostrarFinJuego = signal(false);

    async ngOnInit() {
        this.preguntas = await this.preguntadosService.obtenerPreguntas();
        this.preguntas.sort(() => Math.random() - 0.5); // mezclo las preguntas
        await this.cargarPregunta();
    }

    async cargarPregunta() {
        if (this.indicePreguntaActual >= this.preguntas.length) {
            await this.guardarPartida();
            this.mostrarFinJuego.set(true);
            return;
        }

        const pregunta = this.preguntas[this.indicePreguntaActual]; // 
        this.preguntaActual.set(pregunta.question);
        this.respuestaCorrecta.set(pregunta.correct_answer)
        const respuestasMezcladas = [pregunta.correct_answer,...pregunta.incorrect_answers];
        respuestasMezcladas.sort(() => Math.random() - 0.5);
        this.posiblesRespuestas.set(respuestasMezcladas);        
    }

    responder(respuesta: string) {
        const pregunta = this.preguntaActual();

        if (!pregunta || this.respuestaSeleccionada()) return;

        this.respuestaSeleccionada.set(respuesta);

        if (respuesta === this.respuestaCorrecta()) {
            this.aciertos++;
        }
    }

    async avanzar() {
        this.respuestaSeleccionada.set(null);
        this.indicePreguntaActual++;
        await this.cargarPregunta();
    }

    private async guardarPartida() {
        await this.supabaseService.supabase.from('partidas_preguntados').insert({
            usuario_id: this.authService.sesionActiva()!.id,
            usuario_email: this.authService.sesionActiva()!.email,
            aciertos: this.aciertos,
            total_preguntas: this.preguntas.length,
        });
    }

    async salir() {
        if (!this.mostrarFinJuego()) { // si el jugador quiere salir del juego antes de que se terminen todas las preguntas...
            await this.guardarPartida(); // ...tambien se guardan los puntos
        }
        this.router.navigate(['/home']);
    }
}
