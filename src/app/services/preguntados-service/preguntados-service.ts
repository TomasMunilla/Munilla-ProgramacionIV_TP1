import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreguntadosService {
    private http = inject(HttpClient);
    private apiUrl = 'https://opentdb.com/api.php?amount=10&category=15&type=multiple';

    async obtenerPreguntas() { 
        const preguntas = await firstValueFrom(this.http.get<any>(this.apiUrl));
        
        if (preguntas.results && preguntas.results.length > 0) {
            return preguntas.results;
        }

        return [];
    }
}
