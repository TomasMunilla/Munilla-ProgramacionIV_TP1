import { Component, inject, computed } from '@angular/core';
import { GithubService } from '../../services/github-service';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy {
    private githubService = inject(GithubService);

    // Signals computadas. Se actualizan solas cuando el servicio recibe los datos:
    nombre = computed(() => this.githubService.usuarioGithub()?.name ?? 'Cargando...');  // el ? (operador de encadenamiento opcional) devuelve undefined si usuarioGithub es null o undefined, en lugar de lanzar un error.
    foto = computed(() => this.githubService.usuarioGithub()?.avatar_url ?? ''); // el operador de coalescencia nula (??) devuelve el valor de la izquierda si no es null ni undefined, y si lo es devuelve el valor de la derecha.
    nombreUsuario = computed(() => this.githubService.usuarioGithub()?.login ?? '');

    
    ngOnInit() {
        this.githubService.obtenerUsuarioGithub();
    }
}
