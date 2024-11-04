import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonData } from '../../models/pokemonData';
import { TypeData } from '../../models/typeData';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  pokemon:PokemonData
  type:TypeData

  constructor(
    private service:PokemonService
  ){
    this.pokemon = {
      id:0, name:'',
      sprites:{
        front_default: '',
        other: {
          "official-artwork":{
            front_default: '',
          }
        }

        }
      ,types:[]
    }
    this.type ={
      id: 0,
      name: '',
      sprites:{
        "generation-viii": {
          "sword-shield": {
            name_icon: ''
          }
        }
      }
    }
  }

  ngOnInit(): void {
    this.getPokemon('pikachu')
    this.getType('electric')
  }


  getPokemon(searchName:string){
    this.service.getPokemon(searchName).subscribe(
      {
        next: (res) => {

          this.pokemon = {
            id: res.id,
            name: res.name,
            sprites: res.sprites,
            types: res.types
          }
        },
        error: (err) => console.log('not found')
      }
    )
  }

  getType(searchName:string){
    this.service.getType(searchName).subscribe(
      {
        next: (res) => {

          this.type = {
            id: res.id,
            name: res.name,
            sprites: res.sprites
            
          }
        },
        error: (err) => console.log('not found')
      }
    )
  }
}

