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
  playerCards: PokemonData[] = [];
  computerCards: PokemonData[] = [];
  playerCardsPlayed: PokemonData[] = [];
  computerCardsPlayed: PokemonData[] = [];
  playerFieldCard: any = null;
  computerFieldCard: any = null;
  score = { playerScore: 250, computerScore: 250 };
  duelResult: string = '';
  selectedStatus: number = 0;
  chooseStatus: boolean = false;
  nextRound:boolean = false;
  disabledButtons: boolean[] = [false, false, false, false, false, false];
  gameOver: boolean = false;
  vidaPercentage = { player: this.score.playerScore, computer: this.score.computerScore }; // Para a largura da barra de vida



  constructor(private service: PokemonService) {}
  
  ngOnInit() {
    this.init();
  }

  /** Inicializa o jogo */
  init() {
    this.gerarPokemonsAleatorios(this.playerCards);
    this.gerarPokemonsAleatorios(this.computerCards);
    
    this.gameOver = false;
    this.disabledButtons = [false, false, false, false, false, false];
    this.playerCardsPlayed = [];
    this.computerCardsPlayed = [];
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

  /** Retorna uma carta aleatória */
  getRandomCard(): any {
    const randomIndex = Math.floor(Math.random() * this.computerCards.length);
    return this.computerCards[randomIndex];
  }

  /** Lógica ao selecionar uma carta */
  selectCard(card: any) {
    this.playerFieldCard = card;
    this.computerFieldCard = this.getRandomCard();
    this.duelResult = this.checkDuelResult(card.stats[this.selectedStatus].base_stat, this.computerFieldCard.stats[this.selectedStatus].base_stat);
    this.updateScore();
    this.drawButton(this.duelResult);
    this.nextRound = false;
    this.playerCardsPlayed.push(this.playerFieldCard);
    this.computerCardsPlayed.push(this.computerFieldCard);
    this.playerCards.splice(this.findIndex(this.playerFieldCard, 1), 1);
    this.computerCards.splice(this.findIndex(this.computerFieldCard, 2), 1);
  }

  /** Atualiza o placar */
  updateScore() {
    if (this.duelResult === 'win') {
      this.score.computerScore-= 50;
      this.vidaPercentage.computer = this.score.computerScore;
    } else if (this.duelResult === 'lose') {
      this.score.playerScore-=50;
      this.vidaPercentage.player = this.score.playerScore;
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
    this.checkStatusGame();
    console.log(this.gameOver);
  }

  checkStatusGame(){
    if(this.playerCards.length == 0)
      this.gameOver = true
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
  
  checkStatus(status:number){
    this.selectedStatus = status;
    this.chooseStatus = true;
    this.nextRound = true;
    this.disabledButtons[status] = true;
  }

  findIndex(index: any, n:number):number{
    let indice:number;
    
    if(n == 1){
      indice = this.playerCards.findIndex(obj => 
        JSON.stringify(obj) === JSON.stringify(index)
      );
    }
    else{
      indice = this.computerCards.findIndex(obj => 
        JSON.stringify(obj) === JSON.stringify(index)
      );
    }
    return indice;
  }



  onMouseMove(event: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10; // Rotação no eixo X
    const rotateY = ((x - centerX) / centerX) * -10; // Rotação no eixo Y

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }

  onMouseLeave(card: HTMLElement): void {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
  }
}