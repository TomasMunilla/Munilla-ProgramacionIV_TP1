import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
    http = inject(HttpClient);
    usuario = 'TomasMunilla'
    apiGithub = 'https://api.github.com/users/';
    usuarioGithub = signal<any | null>(null);

    obtenerUsuarioGithub() {
        const peticion = this.http.get<any>(this.apiGithub + this.usuario); // esto es un observable? si, es un observable porque es una peticion http, y las peticiones http en Angular devuelven observables

        const suscripcion = peticion.subscribe((data) => {
            if(data) {
                console.log(data);
                this.usuarioGithub.set(data);
            }

            suscripcion.unsubscribe();
        })
    }
}
