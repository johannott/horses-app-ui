import { Injectable, PipeTransform } from '@angular/core'
import { DecimalPipe } from '@angular/common'

import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators'

import { Apollo, QueryRef } from 'apollo-angular'
import { HORSES_QUERY } from '../graphql'

import { Horse } from './horse'
import { SortDirection } from '../utils/sortable.directive'
import { compare } from '../utils/sortingUtils'

interface SearchResult {
  horses: Horse[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function sort(horses: Horse[], column: string, direction: string): Horse[] {
  if (direction === '') {
    return horses;
  } else {
    return [...horses].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(horse: Horse, term: string, pipe: PipeTransform) {
  return (horse.horse_name && horse.horse_name.toLowerCase().includes(term.toLowerCase()))
    || (horse.trainer && horse.trainer.toLowerCase().includes(term.toLowerCase()))
    || (horse.regular_jockey && horse.regular_jockey.toLowerCase().includes(term.toLowerCase()))
    || (horse.owner && horse.owner.toLowerCase().includes(term.toLowerCase()))
    || (horse.age && pipe.transform(horse.age).includes(term))
    || (horse.gender && horse.gender.toLowerCase().includes(term.toLowerCase()))
    || (horse.sire && horse.sire.toLowerCase().includes(term.toLowerCase()))
    || (horse.win_percentage && horse.win_percentage.toLowerCase().includes(term.toLowerCase()))
    || (horse.place_percentage && horse.place_percentage.toLowerCase().includes(term.toLowerCase()))
    || (horse.type && horse.type.toLowerCase().includes(term.toLowerCase()))
    || (horse.distance && horse.distance.toLowerCase().includes(term.toLowerCase()))
    || (horse.ground && horse.ground.toLowerCase().includes(term.toLowerCase()))
    || (horse.track && horse.track.toLowerCase().includes(term.toLowerCase()))
    || (horse.comments && horse.comments.toLowerCase().includes(term.toLowerCase()));
}

@Injectable({providedIn: 'root'})
export class HorseService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _horses$ = new BehaviorSubject<Horse[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  query: QueryRef<any>;
  HORSES = new BehaviorSubject<Horse[]>([]);
  horses: Horse[]

  private _state: State = {
    page: 1,
    pageSize: 40,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private apollo: Apollo) {
    this.query = this.apollo.watchQuery({
        query: HORSES_QUERY
      });
  
      this.query.valueChanges.subscribe(result => {
        this.horses = result.data && result.data.horses;
        this.horses.forEach(horse => {
          horse.age = parseInt(horse.age)
        });
        this.HORSES.next(this.horses);
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          this._horses$.next(result.horses);
          this._total$.next(result.total);
        });
    
        this._search$.next();
        localStorage.setItem("horses", JSON.stringify(this.HORSES.value));
      });
  }

  get gqlhorses$() { return this.HORSES.asObservable(); }
  get horses$() { return this._horses$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let horses = sort(this.HORSES.value, sortColumn, sortDirection);

    if (horses.length > 0) {
      // 2. filter
      horses = horses.filter(horse => matches(horse, searchTerm, this.pipe));
      const total = horses.length;

      // 3. paginate
      horses = horses.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return of({horses, total});
    } else {
      const total = horses.length;
      return of({horses, total});
    }
  }
}