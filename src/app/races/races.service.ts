import { Injectable, PipeTransform } from '@angular/core'
import { DecimalPipe } from '@angular/common'

import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators'

import { Apollo, QueryRef } from 'apollo-angular'
import { RACES_QUERY } from '../graphql'

import { Race } from './race'
import { SortDirection } from '../utils/sortable.directive'
import { compare } from '../utils/sortingUtils'

interface SearchResult {
  races: Race[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function sort(races: Race[], column: string, direction: string): Race[] {
  if (direction === '') {
    return races;
  } else {
    return [...races].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(race: Race, term: string, pipe: PipeTransform) {
  return (race.race_name && race.race_name.toLowerCase().includes(term.toLowerCase()))
    || (race.race_fullname && race.race_fullname.toLowerCase().includes(term.toLowerCase()))
    || (race.type && race.type.toLowerCase().includes(term.toLowerCase()))
    || (race.grade && race.grade.toLowerCase().includes(term.toLowerCase()))
    || (race.distance && race.distance.toLowerCase().includes(term.toLowerCase()))
    || (race.course && race.course.toLowerCase().includes(term.toLowerCase()))
    || (race.age_limit && race.age_limit.toLowerCase().includes(term.toLowerCase()));
}

@Injectable({providedIn: 'root'})
export class RacesService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _races$ = new BehaviorSubject<Race[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  query: QueryRef<any>;
  RACES = new BehaviorSubject<Race[]>([]);

  private _state: State = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private apollo: Apollo) {
    this.query = this.apollo.watchQuery({
        query: RACES_QUERY
      });
  
      this.query.valueChanges.subscribe(result => {
        this.RACES.next(result.data && result.data.races);
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          this._races$.next(result.races);
          this._total$.next(result.total);
        });
    
        this._search$.next();
        localStorage.setItem("races", JSON.stringify(this.RACES.value));
      });
  }

  get gqlraces$() { return this.RACES.asObservable(); }
  get races$() { return this._races$.asObservable(); }
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
    let races = sort(this.RACES.value, sortColumn, sortDirection);

    if (races.length > 0) {
      // 2. filter
      races = races.filter(race => matches(race, searchTerm, this.pipe));
      const total = races.length;

      // 3. paginate
      races = races.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return of({races, total});
    } else {
      const total = races.length;
      return of({races, total});
    }
  }
}