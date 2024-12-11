import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PokemonData } from '../../models/pokemonData';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-cardsgame',
  templateUrl: './cardsgame.component.html',
  styleUrl: './cardsgame.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CardsgameComponent implements OnInit {
  @ViewChild('bgm') bgmAudio!: ElementRef<HTMLAudioElement>;
  @ViewChild('nextDuelButton') nextDuelButton!: ElementRef<HTMLButtonElement>;

  // Dados do jogo

  pokemon: PokemonData = new PokemonData;
  playerCardsP: PokemonData[] = [];
  computerCardsP: PokemonData[] = [];

  playerCards: any[] = [];
  computerCards: any[] = [];
  cardData: any[] = [
    { id: 0, name: 'Blue Eyes White Dragon', type: 'Paper', img: 'assets/icons/dragon.png', winOf: [1], loseOf: [2] },
    { id: 1, name: 'Dark Magician', type: 'Rock', img: 'assets/icons/magician.png', winOf: [2], loseOf: [0] },
    { id: 2, name: 'Exodia', type: 'Scissors', img: 'assets/icons/exodia.png', winOf: [0], loseOf: [1] }
  ];
  playerFieldCard: any = null;
  computerFieldCard: any = null;
  score = { playerScore: 250, computerScore: 250 };
  duelResult: string = '';
  selectedStatus: number = 0;
  chooseStatus: boolean = false;


  constructor(private service: PokemonService) {}
  
  ngOnInit() {
    this.init();
  }

  /** Inicializa o jogo */
  init() {
    this.playerCards = this.generateRandomCards(5);
    this.computerCards = this.generateRandomCards(5);
    // this.playerCardsP = this.gerarPokemonsAleatorios();
    // this.computerCardsP = this.gerarPokemonsAleatorios();
    this.gerarPokemonsAleatorios(this.playerCardsP);
    this.gerarPokemonsAleatorios(this.computerCardsP);
   
   }

  

  gerarPokemonsAleatorios(pokeCards: PokemonData[]){
    const requests = [];
  
    for (let i = 0; i < 5; i++) {
      const numero = Math.floor(Math.random() * 1025) + 1;
      requests.push(this.service.getPokemon(numero.toString()));
    }
  
    forkJoin(requests).subscribe(
      (responses: any[]) => {
        const cards: PokemonData[] = responses.map(res => Object.assign(new PokemonData(), res));
        pokeCards.push(...cards); // Preenche o array diretamente
      },
      (err) => console.error('Erro ao gerar pokémons:', err)
    );
  }

  
  /** Gera cartas aleatórias */
  generateRandomCards(count: number): any[] {
    const cards = [];
    for (let i = 0; i < count; i++) {
      cards.push(this.getRandomCard());
    }
    return cards;
  }

  /** Retorna uma carta aleatória */
  getRandomCard(): any {
    const randomIndex = Math.floor(Math.random() * this.computerCardsP.length);
    return this.computerCardsP[randomIndex];
  }

  /** Lógica ao selecionar uma carta */
  selectCard(card: any) {
    this.playerFieldCard = card;
    this.computerFieldCard = this.getRandomCard();
    this.duelResult = this.checkDuelResult(card.stats[1].base_stat, this.computerFieldCard.stats[1].base_stat);
    console.log(this.duelResult)
    this.updateScore();
    this.drawButton(this.duelResult);
  }

  /** Atualiza o placar */
  updateScore() {
    if (this.duelResult === 'win') {
      this.score.computerScore-= 50;
    } else if (this.duelResult === 'lose') {
      this.score.playerScore-=50;
    }
  }

  /** Exibe o botão de resultado */
  drawButton(result: string) {
    const button = this.nextDuelButton.nativeElement;
    button.style.display = 'block';
    button.textContent = result.toUpperCase();
  }

  /** Reseta o estado do duelo */
  resetDuel() {
    this.playerFieldCard = null;
    this.computerFieldCard = null;
    this.duelResult = '';
    this.selectedStatus= 0;
    this.chooseStatus = false;
    // Oculta o botão
    const button = this.nextDuelButton.nativeElement;
    button.style.display = 'none';
  }

  /** Verifica o resultado do duelo */
  checkDuelResult(playerCardStat: number, computerCardStat: number): string {
    if (playerCardStat> computerCardStat) {
       return 'win';
    } else if (computerCardStat>playerCardStat) {
      
      return 'lose';
    } else {
           return 'draw';
    }
  }

  
}