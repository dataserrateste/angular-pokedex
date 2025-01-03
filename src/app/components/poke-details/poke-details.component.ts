import { Component, Input } from '@angular/core';
import { PokemonData } from '../../models/pokemonData';
import { TypeData } from '../../models/typeData';
import { EvolutionChainData } from '../../models/evolutionChainData';
import { PokemonService } from '../../services/pokemon.service';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-poke-details',
  templateUrl: './poke-details.component.html',
  styleUrl: './poke-details.component.css'
})
export class PokeDetailsComponent {

  pokemon: PokemonData = new PokemonData();
  types: TypeData[] = [];
  evolutionChain: EvolutionChainData = new EvolutionChainData();
  evolutions: EvolutionChainData[] = [];
  evolutionChainURL: string = '';

  @Input()
  index: string = '';

  constructor(private service: PokemonService) {}

  ngOnInit(): void {
    this.getPokemon(this.index);
  }

  getPokemon(searchName: string) {
    this.service.getPokemon(searchName).subscribe({
      next: (res) => {
        this.pokemon = Object.assign(new PokemonData(), res);
        console.log('Dados do Pokémon:', this.pokemon); // Log para verificar os dados do Pokémon
        this.getType(this.getTypeNames());
        this.getSpecies();
      },
      error: (err) => console.error('Pokemon not found:', err),
    });
  }

  getSpecies() {
    if (this.pokemon.species) {
      this.service
        .getSpecies(this.pokemon.species.name)
        .pipe(
          switchMap((data: any) =>{
            console.log('Dados da espécie:', data); // Log para verificar os dados da espécie
            return this.service.getEvolutionChain(data.evolution_chain.url);
          })
        )
        .subscribe({
          next: (data: any) => {
            this.evolutionChain = data.results;
            console.log('Cadeia de Evolução:', this.evolutionChain); // Log para verificar a cadeia de evolução
            this.evolutions = (this.getEvolution(data.chain));
            console.log('Cadeia de Evolução:', this.evolutions);
          },
          error: (err) => console.error('Error fetching species or chain:', err),
        });
    }
  }

  getEvolution(evolution: EvolutionChainData): EvolutionChainData[] {
    const evolutions: EvolutionChainData[] = [];

    if (evolution && evolution.species?.name) {
      evolutions.push(evolution);
      console.log('Adicionando evolução:', evolution); // Log para cada evolução adicionada
    }

    if (Array.isArray(evolution.evolves_to) && evolution.evolves_to.length > 0) {
      evolution.evolves_to.forEach((evo) => {
        evolutions.push(...this.getEvolution(evo)); // Recursão
      });
    }

    // this.evolutions = evolutions;
    return evolutions;
  }

  getType(searchNames: string[]) {
    const typeRequests = searchNames.map((name) =>
      this.service.getType(name)
    );

    forkJoin(typeRequests).subscribe({
      next: (results) => {
        this.types = results.map((res) => Object.assign(new TypeData(), res));
      },
      error: (err) => console.error('Error fetching types:', err),
    });
   
  }

  getTypeNames(): string[] {
    return this.pokemon.types.map((t) => t.type.name);
  }

  getPokemonIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2]; // Obtém o penúltimo segmento da URL
  }
}