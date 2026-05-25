import { Injectable, signal } from '@angular/core';
import { SupabaseService } from '../supabase-service/supabase-service';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _sesionActiva = signal<any>(null);
    public sesionActiva = this._sesionActiva.asReadonly();
    constructor(private supabaseService: SupabaseService) {
        this.supabaseService.supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                this._sesionActiva.set({
                    ...session.user,
                    nombre: '',
                    apellido: '',
                });
                this.cargarPerfil(session.user.id, session.user);
            } else {
                this._sesionActiva.set(null);
            }
        });
    }
    private async cargarPerfil(userId: string, user: any) {
        const { data: perfil } = await this.supabaseService.supabase
            .from('usuarios')
            .select('nombre, apellido')
            .eq('id', userId)
            .single();
        if (perfil) {
            this._sesionActiva.set({
                ...user,
                nombre: perfil.nombre ?? '',
                apellido: perfil.apellido ?? '',
            });
        }
    }
    async registrar(email: string, password: string, nombre: string, apellido: string, edad: number) {
        const { data, error } = await this.supabaseService.supabase.auth.signUp({
            email: email,
            password: password
        });
        if (error) throw error;
        if (data.user) {
            const { error: dbError } = await this.supabaseService.supabase.from('usuarios').insert({
                id: data.user.id,
                email: email,
                nombre: nombre,
                apellido: apellido,
                edad: edad
            });
            if (dbError) throw dbError;
        }
        return data;
    }
    async iniciarSesion(email: string, password: string) {
        const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) throw error;
        return data;
    }
    async cerrarSesion() {
        const { error } = await this.supabaseService.supabase.auth.signOut();
        if (error) throw error;
    }
}