import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase-service/supabase-service';

@Component({
  selector: 'app-resultados-encuesta',
  templateUrl: './resultados-encuesta.html',
  styleUrl: './resultados-encuesta.css',
})
export class ResultadosEncuesta implements OnInit {

    private supabaseService = inject(SupabaseService);
    private router = inject(Router);

    
    protected respuestas: any[] = []; // Lista de respuestas
    protected cargando = true; // controla si se termino de cargar
    protected error: string | null = null;
    
    async ngOnInit() {
        try {
            
            const { data, error } = await this.supabaseService.supabase // traigo las respuestas de la tabla, de mas nueva a mas vieja
                .from('respuestas_encuesta')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.respuestas = data || []; // si hay datos los guardo, sino guardo un array vacio
        } catch (err: any) {
            this.error = err?.message || 'Error al cargar respuestas.';
        } finally {
            this.cargando = false; // pase lo que pase, dejo de mostrar "cargando..."
        }
    }
    volver() {
        this.router.navigate(['/home']);
    }
}