import { Component, inject } from '@angular/core';
import { GithubService } from '../../services/github-service';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy {
    githubService = inject(GithubService);

    ngOnInit() {
        this.githubService.obtenerUsuarioGithub();
    }

    // traerUsuario() {

    // }
}
