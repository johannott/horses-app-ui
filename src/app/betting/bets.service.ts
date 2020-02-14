import { Injectable, PipeTransform } from '@angular/core'
import { DecimalPipe } from '@angular/common'

import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators'

import { Apollo, QueryRef } from 'apollo-angular'
import { BETS_QUERY } from '../graphql'

import { Bet } from './bet'
import { SortDirection } from '../utils/sortable.directive'
import { compare } from '../utils/sortingUtils'

interface SearchResult {
  bets: Bet[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function sort(bets: Bet[], column: string, direction: string): Bet[] {
  if (direction === '') {
    return bets;
  } else {
    return [...bets].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(bet: Bet, term: string, pipe: PipeTransform) {
  return (bet.race_name && bet.race_name.toLowerCase().includes(term.toLowerCase()))
    || (bet.date && bet.date.toLowerCase().includes(term.toLowerCase()))
    || (bet.time && bet.time.toLowerCase().includes(term.toLowerCase()))
    || bet.horse_name.some(horse => horse.toLowerCase().includes(term.toLowerCase()))
    || (bet.type && bet.type.toLowerCase().includes(term.toLowerCase()))
    || (bet.places && bet.places.toLowerCase().includes(term.toLowerCase()))
    || (bet.price && bet.price.toLowerCase().includes(term.toLowerCase()));
}

@Injectable({providedIn: 'root'})
export class BetsService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _bets$ = new BehaviorSubject<Bet[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  query: QueryRef<any>;
  BETS = new BehaviorSubject<Bet[]>([]);
  private bets: Bet[] = []

  private _state: State = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private apollo: Apollo) {
    this.query = this.apollo.watchQuery({
        query: BETS_QUERY
      });
  
      this.query.valueChanges.subscribe(result => {
        this.bets = result.data && result.data.bets.filter(bet => new Date(bet.date).getTime() > new Date().getTime())
        this.bets.forEach(bet => {
          bet.date = new Date(bet.date).toDateString()
        });
        this.BETS.next(this.bets)
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          this._bets$.next(result.bets);
          this._total$.next(result.total);
        });
    
        this._search$.next();
      });
  }

  get gqlbets$() { return this.BETS.asObservable(); }
  get bets$() { return this._bets$.asObservable(); }
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
    let bets = sort(this.BETS.value, sortColumn, sortDirection);

    if (bets.length > 0) {
      // 2. filter
      bets = bets.filter(bet => matches(bet, searchTerm, this.pipe));
      const total = bets.length;

      // 3. paginate
      bets = bets.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return of({bets, total});
    } else {
      const total = bets.length;
      return of({bets, total});
    }
  }
}