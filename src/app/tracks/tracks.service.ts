import { Injectable, PipeTransform } from '@angular/core'
import { DecimalPipe } from '@angular/common'

import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators'

import { Apollo, QueryRef } from 'apollo-angular'
import { TRACKS_QUERY } from '../graphql'

import { Track } from './Track'
import { SortDirection } from '../utils/sortable.directive'

interface SearchResult {
  tracks: Track[];
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

function sort(tracks: Track[], column: string, direction: string): Track[] {
  if (direction === '') {
    return tracks;
  } else {
    return [...tracks].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(track: Track, term: string, pipe: PipeTransform) {
  return (track.track_name &&track.track_name.toLowerCase().includes(term.toLowerCase()))
    || (track.direction && track.direction.toLowerCase().includes(term.toLowerCase()))
    || (track.topography && track.topography.toLowerCase().includes(term.toLowerCase()))
    || (track.notes && track.notes.toLowerCase().includes(term.toLowerCase()))
    || (track.length && track.length.toLowerCase().includes(term.toLowerCase()))
    || (track.surface && track.surface.toLowerCase().includes(term.toLowerCase()))
    || (track.country && track.country.toLowerCase().includes(term.toLowerCase()));
}

@Injectable({providedIn: 'root'})
export class TracksService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _tracks$ = new BehaviorSubject<Track[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  query: QueryRef<any>;
  TRACKS = new BehaviorSubject<Track[]>([]);

  private _state: State = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private apollo: Apollo) {
    this.query = this.apollo.watchQuery({
        query: TRACKS_QUERY
      });
  
      this.query.valueChanges.subscribe(result => {
        this.TRACKS.next(result.data && result.data.tracks);
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          this._tracks$.next(result.tracks);
          this._total$.next(result.total);
        });
    
        this._search$.next();
        localStorage.setItem("tracks", JSON.stringify(this.TRACKS.value));
      });
  }

  get gqltracks$() { return this.TRACKS.asObservable(); }
  get tracks$() { return this._tracks$.asObservable(); }
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
    let tracks = sort(this.TRACKS.value, sortColumn, sortDirection);

    if (tracks.length > 0) {
      // 2. filter
      tracks = tracks.filter(track => matches(track, searchTerm, this.pipe));
      const total = tracks.length;

      // 3. paginate
      tracks = tracks.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return of({tracks, total});
    } else {
      const total = tracks.length;
      return of({tracks, total});
    }
  }
}