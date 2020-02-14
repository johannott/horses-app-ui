import { Injectable, PipeTransform } from '@angular/core'
import { DecimalPipe } from '@angular/common'
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators'

import { Apollo, QueryRef } from 'apollo-angular'
import { WINNERS_BY_RACE_QUERY } from '../graphql'

import { Winner } from './winner'
import { SortDirection } from '../utils/sortable.directive'
import { compare } from '../utils/sortingUtils'

interface SearchResult {
  winners: Winner[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function sort(winners: Winner[], column: string, direction: string): Winner[] {
  if (direction === '') {
    return winners;
  } else {
    return [...winners].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(winner: Winner, term: string, pipe: PipeTransform) {
  return (winner.race_name && winner.race_name.toLowerCase().includes(term.toLowerCase()))
    || (winner.year && winner.year.toLowerCase().includes(term.toLowerCase()))
    || (winner.horse_name && winner.horse_name.toLowerCase().includes(term.toLowerCase()))
    || (winner.jockey && winner.jockey.toLowerCase().includes(term.toLowerCase()))
    || (winner.trainer && winner.trainer.toLowerCase().includes(term.toLowerCase()))
    || (winner.age && winner.age.toLowerCase().includes(term.toLowerCase()))
    || (winner.weight && winner.weight.toLowerCase().includes(term.toLowerCase()))
    || (winner.distance && winner.distance.toLowerCase().includes(term.toLowerCase()))
    || (winner.time && winner.time.toLowerCase().includes(term.toLowerCase()))
    || (winner.going && winner.going.toLowerCase().includes(term.toLowerCase()))
    || (winner.price && winner.price.toLowerCase().includes(term.toLowerCase()))
    || (winner.rating && winner.rating.toLowerCase().includes(term.toLowerCase()))
    || (winner.form && winner.form.toLowerCase().includes(term.toLowerCase()))
    || (winner.runs && winner.runs.toLowerCase().includes(term.toLowerCase()))
    || (winner.wins && winner.runs.toLowerCase().includes(term.toLowerCase()))
    || (winner.cheltenham_runs && winner.cheltenham_runs.toLowerCase().includes(term.toLowerCase()))
    || (winner.cheltenham_wins && winner.cheltenham_wins.toLowerCase().includes(term.toLowerCase()))
    || (winner.distance_runs && winner.distance_runs.toLowerCase().includes(term.toLowerCase()))
    || (winner.distance_wins && winner.distance_wins.toLowerCase().includes(term.toLowerCase()))
    || (winner.hurdles_runs && winner.hurdles_runs.toLowerCase().includes(term.toLowerCase()))
    || (winner.hurdles_wins && winner.hurdles_wins.toLowerCase().includes(term.toLowerCase()))
    || (winner.chase_runs && winner.chase_runs.toLowerCase().includes(term.toLowerCase()))
    || (winner.chase_wins && winner.chase_wins.toLowerCase().includes(term.toLowerCase()))
    || (winner.last_run && winner.last_run.toLowerCase().includes(term.toLowerCase()))
    || (winner.since_last_run && winner.since_last_run.toLowerCase().includes(term.toLowerCase()))
    || (winner.last_run_result && winner.last_run_result.toLowerCase().includes(term.toLowerCase()))
    || (winner.grade_one_wins && winner.grade_one_wins.toLowerCase().includes(term.toLowerCase()))
    || (winner.grade_two_wins && winner.grade_two_wins.toLowerCase().includes(term.toLowerCase()))
    || (winner.grade_three_wins && winner.grade_three_wins.toLowerCase().includes(term.toLowerCase()))
    || (winner.video_url && winner.video_url.toLowerCase().includes(term.toLowerCase()));
}

@Injectable({providedIn: 'root'})
export class WinnersService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _winners$ = new BehaviorSubject<Winner[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  query: QueryRef<any>;
  WINNERS = new BehaviorSubject<Winner[]>([]);
  private race_name 

  private _state: State = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private apollo: Apollo, private route: ActivatedRoute) {
    this.race_name = this.route.snapshot.params['race_name']
    this.query = this.apollo.watchQuery({
        query: WINNERS_BY_RACE_QUERY,
        variables: {race_name: this.race_name}
      });
  
      this.query.valueChanges.subscribe(result => {
        this.WINNERS.next(result.data && result.data.winnersByRace);
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          this._winners$.next(result.winners);
          this._total$.next(result.total);
        });
    
        this._search$.next();
        localStorage.setItem("winners", JSON.stringify(this.WINNERS.value));
      });
  }

  get gqlwinners$() { return this.WINNERS.asObservable(); }
  get winners$() { return this._winners$.asObservable(); }
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
    let winners = sort(this.WINNERS.value, sortColumn, sortDirection);

    if (winners.length > 0) {
      // 2. filter
      winners = winners.filter(winner => matches(winner, searchTerm, this.pipe));
      const total = winners.length;

      // 3. paginate
      winners = winners.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return of({winners, total});
    } else {
      const total = winners.length;
      return of({winners, total});
    }
  }
}