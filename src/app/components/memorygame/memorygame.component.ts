import { Component, OnInit } from '@angular/core';
import { PokemonData } from '../../models/pokemonData';
import { PokemonService } from '../../services/pokemon.service';

interface Card {
  emoji: string;
  open: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-memorygame',
  templateUrl: './memorygame.component.html',
  styleUrls: ['./memorygame.component.css']
})
export class MemoryGameComponent implements OnInit {
  // emojis: string[] = [
  //   "🍕", "🍕", "🍔", "🍔", "🌭", "🌭", "🍗", "🍗", 
  //   "🍩", "🍩", "🍰", "🍰", "🍟", "🍟", "🥪", "🥪"
  // ];

  pokemon: PokemonData;
  emojis: string[] = [];
  shuffledEmojis: Card[] = [];
  openCards: Card[] = [];

  timer: number = 60; // Tempo total do jogo em segundos
  timerInterval: any; // Identificador do intervalo do timer
  gameOver: boolean = false;
  isPlaying: boolean = false;
  pontos: number = 0;
  resultado: string = '';
  selectedValue: number = 8;

  constructor(private service: PokemonService) {
    this.pokemon = {
      id: 0,
      species: { name: '' },
      sprites: {
        front_default: '',
        other: {
          "official-artwork": {
            front_default: '',
          }
        }
      }
      , types: []
    }
  }

  ngOnInit() {
    this.resetGame();
  }

  gerarPokemonsAleatorios(n: number) {
    const numerosAleatorios: number[] = [];

    while (numerosAleatorios.length < n) {
      const numero = Math.floor(Math.random() * 1025) + 1; // Gera número entre 1 e 1025
      if (!numerosAleatorios.includes(numero)) { // Verifica se o número já foi gerado
        numerosAleatorios.push(numero);
        this.getPokemon(numero.toString())
      }
    }
  }

  getPokemon(searchName: string) {
    this.service.getPokemon(searchName).subscribe(
      {
        next: (res) => {
          this.pokemon = ({
            id: res.id,
            species: res.species,
            sprites: res.sprites,
            types: res.types
          })
          this.emojis.push(res.sprites.front_default, res.sprites.front_default);

          this.shuffledEmojis = this.shuffleCards();
        },
        error: (err) => console.log('not found')
      }
    )
  }

  resetGame() {
    // this.openCards = [];
    // this.shuffledEmojis = this.shuffleCards();

    this.openCards = [];
    this.emojis = [];
    this.shuffledEmojis = [];

    this.timer = 60; // Reinicia o timer
    this.gameOver = false;

    this.pontos = 0;

    clearInterval(this.timerInterval); // Garante que o intervalo antigo seja limpo

    this.isPlaying = false;

    this.gerarPokemonsAleatorios(this.selectedValue);

  }

  iniciarGame() {
    this.isPlaying = true;
    this.startTimer();
  }

  shuffleCards(): Card[] {
    // Embaralha os emojis

    const shuffled = [...this.emojis].sort(() => Math.random() > 0.5 ? 1 : -1);
    return shuffled.map(emoji => ({
      emoji,
      open: false,
      matched: false
    }));
  }

  handleClick(card: Card) {
    if (this.isPlaying) {
      if (card.open || this.openCards.length === 2 || card.matched) {
        return;
      }

      card.open = true;
      this.openCards.push(card);

      if (this.openCards.length === 2) {
        setTimeout(() => this.checkMatch(), 500);
      }
    }
  }

  checkMatch() {
    const [card1, card2] = this.openCards;

    if (card1.emoji === card2.emoji) {
      card1.matched = true;
      card2.matched = true;
      this.pontos = this.pontos + 10;
    } else {
      card1.open = false;
      card2.open = false;
    }

    this.openCards = [];

    if (this.shuffledEmojis.every(card => card.matched)) {
      // alert('Você venceu!');
      clearInterval(this.timerInterval); // Para o timer se vencer
      this.resultado = 'Parabéns! Você venceu!';
      this.gameOver = true;
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer--;

      if (this.timer <= 0) {
        clearInterval(this.timerInterval); // Para o timer ao final
        this.resultado = 'Game Over! O tempo acabou.';
        this.gameOver = true
      }
    }, 1000);
  }

  onOptionSelected(event: Event): void {
    const value = (event.target as HTMLInputElement).value; // Captura o valor como string
    this.selectedValue = parseInt(value, 10); // Converte o valor para número e atribui à variável
    this.resetGame();
  }
}