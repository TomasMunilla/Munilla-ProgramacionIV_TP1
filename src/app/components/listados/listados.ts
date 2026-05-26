import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import { SupabaseService } from '../../services/supabase-service/supabase-service';
@Component({
    selector: 'app-listados',
    imports: [],
    templateUrl: './listados.html',
    styleUrl: './listados.css',
})
export class Listados implements OnInit {
    private authService = inject(AuthService);
    private supabaseService = inject(SupabaseService);
    private router = inject(Router);

    // Arrays para guardar las partidas de cada juego
    partidasAhorcado: any[] = [];
    partidasMayorMenor: any[] = [];
    partidasPreguntados: any[] = [];
    partidasSimonDice: any[] = [];

    async ngOnInit() {
        
        const email = this.authService.sesionActiva()!.email; // con el mail del usuario logueado filtro solo sus partidas
        
        const { data: a } = await this.supabaseService.supabase // a es un array de objetos, donde cada objeto es una fila de la tabla partidas_ahorcado que correspondan con el usuario
            .from('partidas_ahorcado')
            .select('*')
            .eq('usuario_email', email)
            .order('fecha', { ascending: false });
        if (a) this.partidasAhorcado = a;
        
        const { data: b } = await this.supabaseService.supabase
            .from('partidas_mayor_menor').select('*')
            .eq('usuario_email', email)
            .order('fecha', { ascending: false });
        if (b) this.partidasMayorMenor = b;
        
        const { data: c } = await this.supabaseService.supabase
            .from('partidas_preguntados').select('*')
            .eq('usuario_email', email)
            .order('fecha', { ascending: false });
        if (c) this.partidasPreguntados = c;
        
        const { data: d } = await this.supabaseService.supabase
            .from('partidas_simon_dice')
            .select('*').eq('usuario_email', email)
            .order('fecha', { ascending: false });
        if (d) this.partidasSimonDice = d;
    }

    salir() {
        this.router.navigate(['/home']);
    }
}