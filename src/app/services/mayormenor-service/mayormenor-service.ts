import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


interface Carta { // estructura de la carta que devuelve la api
    value: string;
    suit: string;
    image: string;
}
@Injectable({
    providedIn: 'root',
})
export class MayormenorService {

    private http = inject(HttpClient);

    private readonly API_BASE = 'https://deckofcardsapi.com/api/deck';

    async nuevoMazo() {
        const datos: any = await firstValueFrom(
            this.http.get(`${this.API_BASE}/new/draw/?count=1`)
        );
        return { deckId: datos.deck_id, carta: datos.cards[0] as Carta }; // Creo un nuevo mazo. Retirno el ID del mazo y la primera carta
    }

    async robarCarta(deckId: string) { // Robo otra carta del mismo ID de mazo de la que mostre antes
        const datos: any = await firstValueFrom(
            this.http.get(`${this.API_BASE}/${deckId}/draw/?count=1`)
        );
        return datos.cards[0] as Carta;
    }

    valorNumerico(valor: string): number { // Convierto el valor string de cada carta a numero para poder comparar
        const mapa: Record<string, number> = {
            ACE: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
            '8': 8, '9': 9, '10': 10, JACK: 11, QUEEN: 12, KING: 13,
        };
        return mapa[valor] ?? 0; // Si no encuentra el valor, devuelve 0
    }
}