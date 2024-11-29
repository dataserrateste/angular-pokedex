import { Component } from '@angular/core';

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
  ];

  currentTime = 60;
  score = 0;
  hitPosition: number | null = null;
  gameInterval: any;
  countDownInterval: any;

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.gameInterval = setInterval(() => this.randomSquare(), 1000);
    this.countDownInterval = setInterval(() => this.countDown(), 1000);
  }

  countDown() {
    this.currentTime--;
    if (this.currentTime <= 0) {
      clearInterval(this.gameInterval);
      clearInterval(this.countDownInterval);
      // alert(`Game Over! O seu resultado foi: ${this.score}`);
    }
  }

  randomSquare() {
    this.hitPosition = Math.floor(Math.random() * 9) + 1;
  }

  checkHit(squareId: number) {
    if (squareId === this.hitPosition) {
      this.score++;
      this.hitPosition = null;
      // this.playSound('hit');
    }
  }

  // playSound(audioName: string) {
  //   const audio = new Audio(`../../../assets/audios/${audioName}.m4a`);
  //   audio.volume = 0.2;
  //   audio.play();
  // }
}