import { Injectable, signal } from '@angular/core';
import { SupabaseService } from '../supabase-service/supabase-service';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    
    private _sesionActiva = signal<any>(null);
    public sesionActiva = this._sesionActiva.asReadonly();
    
    constructor(private supabaseService: SupabaseService) {
        this.supabaseService.supabase.auth.onAuthStateChange((event, session) => { // seescuchan los cambios de autenticacion 
            if (session?.user) { // hay un usuario logueado?
                this._sesionActiva.set({ // lo guardo
                    ...session.user,  // spread operator , copia lo que venia
                    nombre: '',
                    apellido: '',
                });
                this.cargarPerfil(session.user.id, session.user);
            } else {
                this._sesionActiva.set(null);
            }
        });
    }
    
    async esperarInicializacion(): Promise<void> { // cuando se recarga la pagina, _sesionActiva es null, entonces getSession() lo setea 
        if (this._sesionActiva()) return; // si ya hay sesion, no hago nada
        
        const { data: { session } } = await this.supabaseService.supabase.auth.getSession(); // busco una sesion en el storage
        if (session?.user) {
            this._sesionActiva.set({
                ...session.user,
                nombre: '',
                apellido: '',
            });
            await this.cargarPerfil(session.user.id, session.user);
        }
    }
    
    private async cargarPerfil(userId: string, user: any) { // cuando ya se creo la sesion y onAuthStateChange o esperarInicializacion setean _sesionActiva, actualizo el perfil 
        try { // try para evitar que un posible error rompa todo
            const { data: perfil } = await this.supabaseService.supabase
                .from('usuarios')
                .select('nombre, apellido, es_admin')
                .eq('id', userId)
                .single(); // single() espera una sola fila, y si no existe tira error 406.
            if (perfil) {
                this._sesionActiva.set({
                    ...user,
                    nombre: perfil.nombre ?? '',  // ?? devuelve '' si perfil.nombre es null o undefined
                    apellido: perfil.apellido ?? '',
                    es_admin: perfil.es_admin ?? false
                });
            }
        } catch {
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

            this._sesionActiva.set({
                ...data.user,
                nombre: nombre,
                apellido: apellido,
            });
        }

        return data;
    }
    
    async iniciarSesion(email: string, password: string) { // aca arranca todo
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