import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {PokemonList} from '../models/pokemon-list';
import {PokemonEntry} from '../models/pokemon-entry';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import {Pokemon} from '../models/pokemon';
import {PokemonAbilityInfo} from '../models/pokemon-ability-info';
import {PokemonAbility} from '../models/pokemon-ability';
import {PokemonDescription} from '../models/pokemon-description';
import {PokemonStats} from '../models/pokemon-stats';
import {PokemonType} from '../models/pokemon-type';

@Injectable()
export class PokemonService {
  private _baseUrl: string = 'https://pokeapi.co/api/v2';
  private _spriteBaseUrl: string = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other-sprites/official-artwork';
  private _detailRegex = /^https:\/\/pokeapi.co\/api\/v2\/pokemon\/(\d+)\/$/;
  private _language = 'en';

  constructor(private _http: Http) { }

  findAll(offset: number = 0, limit: number = 20): Observable<PokemonList> {
    return this._http
      .get(`${this._baseUrl}/pokemon/?offset=${offset}&limit=${limit}`)
      .map(response => response.json())
      .map(results => this.getList(results));
  }
  getList(data):PokemonList {
    // Manually filter all pokémons above 10000 since these are not official but mega evolutions
    let results = data.results
      .map(result => this.getEntry(result))
      .filter(entry => entry.id < 10000);
    // Manually override count to 721 to exclude mega's
    return new PokemonList(results, 721);
  }
  getEntry(data): PokemonEntry {
    const matches = this._detailRegex.exec(data.url),
      id = matches == null ? null : parseInt(matches[1]),
      sprite = id == null ? null : `${this._spriteBaseUrl}/${id}.png`;
    return new PokemonEntry(id , _.capitalize(data.name), sprite);
  }
}
