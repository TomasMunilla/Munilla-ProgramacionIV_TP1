import { Component, inject, signal, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase-service/supabase-service';
import { AuthService } from '../../services/auth-service/auth-service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

interface Mensaje {
    id: number;
    usuario_id: string;
    usuario_email: string;
    mensaje: string;
    fecha: string;
}

@Component({
    selector: 'app-chat',
    imports: [FormsModule, DatePipe],
    templateUrl: './chat.html',
    styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
    private supabaseService = inject(SupabaseService);
    private authService = inject(AuthService);
    private router = inject(Router);

    @ViewChild('mensajesContainer') private mensajesContainer!: ElementRef<HTMLElement>
    
    protected mensajes = signal<Mensaje[]>([]); // Lista de mensajes
    protected textoMensaje = ''; // Texto del input
    private canal: RealtimeChannel | null = null; // Canal de suscripción en tiempo real
    
    async ngOnInit() {
        await this.cargarMensajes();
        this.scrollAlFinal();
        this.suscribirseAChat();
    }

    
    private async cargarMensajes() { // cargo los mensajes existentes desde Supabase
        const { data } = await this.supabaseService.supabase
            .from('mensajes_chat')
            .select('*')
            .order('fecha', { ascending: true }); // Ordena los mensajes por fecha ascendente (más antiguos primero)
        if (data) this.mensajes.set(data);
    }
    
    private suscribirseAChat() { 
        this.canal = this.supabaseService.supabase
            .channel('mensajes_chat')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'mensajes_chat' },
                (payload) => { // payload contiene el nuevo mensaje insertado en la tabla 'mensajes_chat'
                    const mensajeNuevo = payload.new as Mensaje;
                    this.mensajes.update(msjs => [...msjs, mensajeNuevo]); // cuando llega un nuevo mensaje, lo agrego a la lista de mensajes
                    this.scrollAlFinal();
                }
            )
            .subscribe(); // me suscribo a los cambios en la tabla 'mensajes_chat'
    }
    
    async enviarMensaje() {
        if (!this.textoMensaje.trim()) return; // si al hacer trim el mensaje queda vacio, no lo envío
        const sesion = this.authService.sesionActiva();
        if (!sesion) return; // Si no hay sesion activa, no se envia el mensaje
        await this.supabaseService.supabase.from('mensajes_chat').insert({
            usuario_id: sesion.id,
            usuario_email: sesion.email,
            mensaje: this.textoMensaje,
        });
        this.textoMensaje = '';
        this.scrollAlFinal();
    }
    
    esMensajePropio(mensaje: Mensaje): boolean { // verifico si el mensaje lo envio el usuario actual
        return mensaje.usuario_id === this.authService.sesionActiva()?.id;
    }

    private scrollAlFinal() {
        setTimeout(() => { // espero a que angular termine de renderizar
            const chat = this.mensajesContainer?.nativeElement; // agarro el div del chat
            if (chat) chat.scrollTop = chat.scrollHeight; // si existe, lo mando al fondo
        });
    }
    
    ngOnDestroy() { // limpio la suscripción al salir del componente
        if (this.canal) this.supabaseService.supabase.removeChannel(this.canal);
    }

    salir() {
        this.router.navigate(['/home']);
    }
}