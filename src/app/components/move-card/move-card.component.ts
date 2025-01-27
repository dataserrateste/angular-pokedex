import { Component, Input } from '@angular/core';
import { MoveData } from '../../models/moveData';
import { PokemonService } from '../../services/pokemon.service';
import { TypeData } from '../../models/typeData';

@Component({
  selector: 'app-move-card',
  templateUrl: './move-card.component.html',
  styleUrl: './move-card.component.css'
})
export class MoveCardComponent {
  move: MoveData = new MoveData;
  // type: TypeData = new TypeData;


  constructor(private service: PokemonService) {}


  @Input()
  index: string = ''

  ngOnInit(): void {
    this.getMove(this.index)
  }

  getMove(searchName: string): void {
    this.service.getMove(searchName).subscribe({
      next: (res) => {
        this.move = Object.assign(new MoveData(), res);

        // Verifica e trata os `effect_entries` para evitar inconsistências
        if (!this.move.effect_entries[0]) {
          this.move.effect_entries = [
            {
              effect: 'No effect available',
              short_effect: 'No effect available'
            }
          ];
        }

        // Atualiza o `typeImage` no objeto `move` com as informações do tipo
        this.getType(this.move.type.name);
      },
      error: (err) => console.error('Move not found', err)
    });
  }

  getType(searchName: string): void {
    this.service.getType(searchName).subscribe({
      next: (res) => {
        // Atribui o objeto TypeData diretamente ao typeImage dentro de move
        this.move.type.typeImage = res;
      },
      error: (err) => console.error('Type not found', err)
    });
  }


}