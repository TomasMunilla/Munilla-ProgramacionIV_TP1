import { Component, inject, OnInit, signal } from '@angular/core';
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
    protected partidasAhorcado = signal<any[]>([]);
    protected partidasMayorMenor = signal<any[]>([]);
    protected partidasPreguntados = signal<any[]>([]);
    protected partidasSimonDice = signal<any[]>([]);

    async ngOnInit() {
        
        const email = this.authService.sesionActiva()!.email; // con el mail del usuario logueado filtro solo sus partidas
        
        const { data: a } = await this.supabaseService.supabase // a es un array de objetos, donde cada objeto es una fila de la tabla partidas_ahorcado que correspondan con el usuario
            .from('partidas_ahorcado')
            .select('*')
            .eq('usuario_email', email)
            .order('fecha', { ascending: false })
            .limit(5);
        if (a) this.partidasAhorcado.set(a);
        
        const { data: b } = await this.supabaseService.supabase
            .from('partidas_mayor_menor').select('*')
            .eq('usuario_email', email)
            .order('fecha', { ascending: false })
            .limit(5);
        if (b) this.partidasMayorMenor.set(b);
        
        const { data: c } = await this.supabaseService.supabase
            .from('partidas_preguntados').select('*')
            .eq('usuario_email', email)
            .order('fecha', { ascending: false })
            .limit(5);
        if (c) this.partidasPreguntados.set(c);
        
        const { data: d } = await this.supabaseService.supabase
            .from('partidas_simon_dice')
            .select('*').eq('usuario_email', email)
            .order('fecha', { ascending: false })
            .limit(5);
        if (d) this.partidasSimonDice.set(d);
    }

    salir() {
        this.router.navigate(['/home']);
    }
}