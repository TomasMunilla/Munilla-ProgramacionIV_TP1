import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; // Herramienta para conectarse 
import { environment } from '../../../environments/environment'; // Variables de entorno de Supabase

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private supabase: SupabaseClient; // en esta propiedad guardo la conexion
    private _sesionActiva = signal<any>(null);
    public sesionActiva = this._sesionActiva.asReadonly();

    constructor() { // En cuanto el servicio se crea...
        // Inicializo el cliente de Supabase con las credenciales de los environments
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey); // automaticamente me conecto al proyecto de Supabase

        this.supabase.auth.onAuthStateChange((event, session) => { // onAuthStateChange es un metodo listener de Supabase que me permite escuchar los cambios en la autenticacion (inicio de sesion, cierre de sesion, refresco de token, etc)
            // event es un string que describe que paso con la autenticacion. Sus valores pueden ser: 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'USER_UPDATED'
            // session es un objeto que tiene los datos de la sesion activa si el usuario esta loguado (null si no lo esta). Contiene session.user y session.access_token
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
        const { data: perfil } = await this.supabase
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
        // el método de registro de Supabase solo necesita obligatoriamente el email y la contraseña:
        const { data, error } = await this.supabase.auth.signUp({ // uso object destructuring
            email: email,
            password: password
        });

        if (error) throw error;

        // guardo datos extra para mi tabla de usuarios
        if (data.user) {
            const { error: dbError } = await this.supabase.from('usuarios').insert({
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
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;
        return data;
    }

    async cerrarSesion() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
    }
}
