import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GithubUser } from '../models/github-user';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
    private http = inject(HttpClient);
    private usuario = 'TomasMunilla'
    private apiGithub = 'https://api.github.com/users/';

    // signal privado para que el componente no lo pueda modificar
    private _usuarioGithub = signal<GithubUser | null>(null);

    // signal público de solo lectura que sirve como espejo para que el componente pueda leerlo pero no modificarlo
    public usuarioGithub = this._usuarioGithub.asReadonly();

    obtenerUsuarioGithub() {
        this.http.get<GithubUser>(this.apiGithub + this.usuario).subscribe((data) => { // Las peticiones hechas con HttpClient devuelven observables finitos; después de emitir la respuesta de la API, ejecutan automaticamente complete(). Cuando el observable se completa, Angular limpia la suscripcion y la memoria, por eso no es necesario hacer un unsubscribe.
            if(data) {
                this._usuarioGithub.set(data);
            }
        });
    }
}