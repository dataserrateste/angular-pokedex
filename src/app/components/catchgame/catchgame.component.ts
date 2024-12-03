import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonData } from '../../models/pokemonData';

@Component({
  selector: 'app-catchgame',
  templateUrl: './catchgame.component.html',
  styleUrl: './catchgame.component.css'
})
export class CatchgameComponent {
  rows = [
    [{ id: 1 }, { id: 2 }, { id: 3 }],
    [{ id: 4 }, { id: 5 }, { id: 6 }],
    [{ id: 7 }, { id: 8 }, { id: 9 }],
    [{ id: 10 }, { id: 11 }, { id: 12 }],
  ];

  
 
  pokemon: PokemonData;
  timer: number = 60; 
  timerInterval: any; 
  gameOver: boolean = false;
  isPlaying: boolean = false;
  score = 0;
  hitPosition: number | null = null;
  gameInterval: any;
  countDownInterval: any;

  pokemonCarregado: string[] = [];
  image: string = ''

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


  carregarPokemonsAleatorios() {
    const numerosAleatorios: number[] = [];

    while (numerosAleatorios.length < 100) {
      const numero = Math.floor(Math.random() * 1025) + 1; // Gera número entre 1 e 1025
      if (!numerosAleatorios.includes(numero)) { // Verifica se o número já foi gerado
        numerosAleatorios.push(numero);
        this.getPokemon(numero.toString())
        console.log(numerosAleatorios);
      }
    }
    
  }

  gerarPokemonsAleatorios(){
    const numero = Math.floor(Math.random() * this.pokemonCarregado.length) + 1; // Número entre 1 e 100
    
    this.image =  this.pokemonCarregado[numero];
    this.pokemonCarregado.slice(numero)
   
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
                 
          this.pokemonCarregado.push(res.sprites.front_default);
        },
        error: (err) => console.log('not found')
      }
    )
  }


  startGame() {
    this.isPlaying = true;
    this.startTimer();
    this.carregarPokemonsAleatorios();
    // this.gameInterval = setInterval(() => this.randomSquare(), 1000);
    // this.countDownInterval = setInterval(() => this.countDown(), 1000);
  }

  resetGame() {
    this.timer = 60; 
    this.gameOver = false;
    this.hitPosition = null;
    this.score = 0;
    clearInterval(this.gameInterval);
    clearInterval(this.timerInterval);
    this.isPlaying = false;
  }

  // countDown() {
  //   this.currentTime--;
  //   if (this.currentTime <= 0) {
  //     clearInterval(this.gameInterval);
  //     clearInterval(this.countDownInterval);
  //     // alert(Game Over! O seu resultado foi: ${this.score});
  //   }
  // }

  startTimer() {
    this.gameInterval = setInterval(() => this.randomSquare(), 1000);
    this.timerInterval = setInterval(() => {
      this.timer--;

      if (this.timer <= 0) {
        clearInterval(this.gameInterval);
        clearInterval(this.timerInterval); // Para o timer ao final
        this.gameOver = true
      }
    }, 1000);
  }

  async randomSquare() {
 
   this.hitPosition = Math.floor(Math.random() * 12) + 1;
   this.gerarPokemonsAleatorios()
    
  }

  checkHit(squareId: number) {
    if (squareId === this.hitPosition) {
      this.score++;
      this.hitPosition = null;
      this.playSound('hit');
    }
  }

  playSound(audioName: string) {
    const audio = new Audio('../../../assets/audios/${audioName}.m4a');
    audio.volume = 0.2;
    audio.play();
  }
}