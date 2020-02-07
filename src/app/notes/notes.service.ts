import { Injectable, PipeTransform } from '@angular/core'
import { DecimalPipe } from '@angular/common'

import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators'

import { Apollo, QueryRef } from 'apollo-angular'
import { NOTES_QUERY } from '../graphql'

import { Note } from './note'
import { SortDirection } from '../horses/sortable.directive'

interface SearchResult {
  notes: Note[];
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

function sort(notes: Note[], column: string, direction: string): Note[] {
  if (direction === '') {
    return notes;
  } else {
    return [...notes].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(note: Note, term: string, pipe: PipeTransform) {
  return note.note_.toLowerCase().includes(term.toLowerCase())
    || note.type.toLowerCase().includes(term.toLowerCase());
}

@Injectable({providedIn: 'root'})
export class NotesService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _notes$ = new BehaviorSubject<Note[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  query: QueryRef<any>;
  NOTES = new BehaviorSubject<Note[]>([]);

  private _state: State = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private apollo: Apollo) {
    this.query = this.apollo.watchQuery({
        query: NOTES_QUERY
      });
  
      this.query.valueChanges.subscribe(result => {
        this.NOTES.next(result.data && result.data.notes);
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          this._notes$.next(result.notes);
          this._total$.next(result.total);
        });
    
        this._search$.next();
        localStorage.setItem("notes", JSON.stringify(this.NOTES.value));
      });
  }

  get gqlnotes$() { return this.NOTES.asObservable(); }
  get notes$() { return this._notes$.asObservable(); }
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
    let notes = sort(this.NOTES.value, sortColumn, sortDirection);

    if (notes.length > 0) {
      // 2. filter
      notes = notes.filter(note => matches(note, searchTerm, this.pipe));
      const total = notes.length;

      // 3. paginate
      notes = notes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return of({notes, total});
    } else {
      const total = notes.length;
      return of({notes, total});
    }
  }
}