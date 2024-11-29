import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-game',
  templateUrl: './menu-game.component.html',
  styleUrl: './menu-game.component.css'
})
export class MenuGameComponent {
  
  @Input() tituloGame: string = 'JOGO DA MEMÓRIA'
  @Input() timer: number = 60; // Tempo total do jogo em segundos
  @Input() isPlaying: boolean = false;
  @Input() pontos: number = 0;
  @Input() selectedValue: number = 8;

  @Output() onOptionClicked = new EventEmitter<Event>();
  @Output() onIniciarGame = new EventEmitter<void>();
  @Output() onResetGame = new EventEmitter<void>();

  // Function to emit the event
  onOptionSelected(value: Event) {
    this.onOptionClicked.emit(value);
  }

  onIniciarGameSelected() {
    this.onIniciarGame.emit();
  }

  onResetGameSelected() {
    this.onResetGame.emit();
  }
}
