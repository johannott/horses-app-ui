import {Injectable, PipeTransform} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

import { Entry } from './entry';
import { SortDirection } from '../horses/sortable.directive';

const ENTRIES_QUERY = gql`
  query EntriesByRaceName($race_name: String!){ 
    entriesByRace(race_name: $race_name) {
      horse_name,
      number
      weight,
      jockey,
      trends,
      tipped,
      bets
    }
  }
`;


const HORSE_QUERY = gql`
  query HorseByName($horse_name: String!){ 
    horseByName(horse_name: $horse_name) {
      horse_name,
      trainer,
      regular_jockey,
      owner,
      age,
      gender,
      bred,
      sire,
      form,
      races,
      wins,
      places,
      win_percentage,
      place_percentage,
      type,
      distance,
      ground,
      track,
      comments,
      link
    }
  }
`;

interface SearchResult {
  entries: Entry[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(entries: Entry[], column: string, direction: string): Entry[] {
  if (direction === '') {
    return entries;
  } else {
    return [...entries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(entry: Entry, term: string, pipe: PipeTransform) {
  return entry.horse_name.toLowerCase().includes(term.toLowerCase())
    || entry.number.toLowerCase().includes(term.toLowerCase())
    || entry.weight.toLowerCase().includes(term.toLowerCase())
    || entry.jockey.toLowerCase().includes(term.toLowerCase())
    || entry.trends.toLowerCase().includes(term.toLowerCase())
    || entry.tipped.toLowerCase().includes(term.toLowerCase())
    || entry.bets.toLowerCase().includes(term.toLowerCase());
}

@Injectable({providedIn: 'root'})
export class EntriesService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _entries$ = new BehaviorSubject<Entry[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private query: QueryRef<any>;
  private horse_query: QueryRef<any>;
  private ENTRIES: Entry[];
  private HORSE_ENTRIES: any[] = [];
  private MERGED_ENTRIES: any[] = [];
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
        query: ENTRIES_QUERY,
        variables: {race_name: this.race_name}
      });
  
      this.query.valueChanges.subscribe(result => {
        this.ENTRIES = result.data && result.data.entriesByRace && result.data.entriesByRace;
        localStorage.setItem("entries", JSON.stringify(this.ENTRIES));
        this.ENTRIES.forEach(entry => {
          this.horse_query = this.apollo.watchQuery({
            query: HORSE_QUERY,
            variables: {horse_name: entry.horse_name}
          });
          this.horse_query.valueChanges.subscribe(res => {
            if (res.data && res.data.horseByName && res.data.horseByName) {
              this.HORSE_ENTRIES.push(res.data.horseByName)
              if (this.ENTRIES.length > 0 && this.HORSE_ENTRIES.length > 0) {
                this.MERGED_ENTRIES = this.ENTRIES.map((item, i) => Object.assign({}, item, this.HORSE_ENTRIES[i]));
                console.log(this.ENTRIES)
                console.log(this.HORSE_ENTRIES)
                console.log(this.MERGED_ENTRIES)
              }
            }
        });
      })
    })

    

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._entries$.next(result.entries);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get entries$() { return this._entries$.asObservable(); }
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
    let entries = sort(this.MERGED_ENTRIES, sortColumn, sortDirection);

    // 2. filter
    entries = entries.filter(entry => matches(entry, searchTerm, this.pipe));
    const total = entries.length;

    // 3. paginate
    entries = entries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({entries, total});
  }
}