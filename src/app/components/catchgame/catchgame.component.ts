import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonData } from '../../models/pokemonData';

@Component({
  selector: 'app-catchgame',
  templateUrl: './catchgame.component.html',
  styleUrls: ['./catchgame.component.css'],
})
export class CatchgameComponent implements OnInit {
  rows = Array.from({ length: 4 }, (_, rowIndex) =>
    Array.from({ length: 3 }, (_, colIndex) => ({ id: rowIndex * 3 + colIndex + 1 }))
  );

  pokemon: PokemonData;
  timer: number = 60;
  timerInterval: ReturnType<typeof setInterval> | null = null;
  gameInterval: ReturnType<typeof setInterval> | null = null;
  gameOver: boolean = false;
  isPlaying: boolean = false;
  score = 0;
  hitPosition: number | null = null;
  pokemonCarregado: PokemonData[] = [];
  image: string = '';
  selectedValue: number = 1300;

  constructor(private service: PokemonService) {
    this.pokemon = this.createEmptyPokemon();
  }

  ngOnInit() {
    this.resetGame();
  }

  createEmptyPokemon(): PokemonData {
    return {
      id: 0,
      species: { name: '' },
      sprites: {
        front_default: '',
        other: { 'official-artwork': { front_default: '' } },
      },
      types: [],
    };
  }

  async carregarPokemonsAleatorios() {
    const numerosAleatorios = new Set<number>();
    while (numerosAleatorios.size < 150) {
      numerosAleatorios.add(Math.floor(Math.random() * 1025) + 1);
    }
    for (const numero of numerosAleatorios) {
      await this.getPokemon(numero.toString());
    }
  }

  async getPokemon(searchName: string) {
    try {
      const res = await this.service.getPokemon(searchName).toPromise();
      if (res) {
        this.pokemonCarregado.push(res); // Só adiciona se res não for undefined.
      } else {
        console.error(`Pokemon not found or response invalid: ${searchName}`);
      }
    } catch (error) {
      console.error('Pokemon not found:', searchName);
    }
  }

  gerarPokemonAleatorio() {
    if (this.pokemonCarregado.length === 0) {
      console.error('No Pokémon available to generate.');
      return;
    }
  
    const numero = Math.floor(Math.random() * this.pokemonCarregado.length);
    const pokemon = this.pokemonCarregado[numero];
  
    if (pokemon) {
      this.image = pokemon.sprites.other['official-artwork'].front_default;
      this.pokemonCarregado.splice(numero, 1); // Remove o Pokémon diretamente.
    } else {
      console.error('Failed to retrieve Pokémon.');
    }
  }

  startGame() {
    this.isPlaying = true;
    this.startTimer();
  }

  resetGame() {
    this.clearIntervals();
    this.timer = 60;
    this.gameOver = false;
    this.hitPosition = null;
    this.score = 0;
    this.isPlaying = false;
    this.pokemonCarregado = [];
    this.image = '';
    this.carregarPokemonsAleatorios();
  }

  clearIntervals() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.gameInterval) clearInterval(this.gameInterval);
  }

  startTimer() {
    this.gameInterval = setInterval(() => this.randomSquare(), this.selectedValue);
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  randomSquare() {
    this.hitPosition = Math.floor(Math.random() * 12) + 1;
    this.gerarPokemonAleatorio();
  }

  endGame() {
    this.clearIntervals();
    this.pokemonCarregado = [];
    this.image = '';
    this.gameOver = true;
  }

  checkHit(squareId: number) {
    if (squareId === this.hitPosition) {
      this.score++;
      this.hitPosition = null;
    }
  }

  onOptionSelected(event: Event): void {
    const value = (event.target as HTMLInputElement).value; // Captura o valor como string
    if(value == 'D')
      this.selectedValue = 700;
    else if(value == 'N')
      this.selectedValue = 1000;
    else  
      this.selectedValue = 1300;
    
    this.resetGame();
  }
}
