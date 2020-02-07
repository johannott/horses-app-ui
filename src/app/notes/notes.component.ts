import { Component, QueryList, ViewChildren, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DecimalPipe } from '@angular/common'

import { Observable } from 'rxjs'

import { Note } from './note'
import { NotesService } from './notes.service';
import { NgbdSortableHeader, SortEvent } from '../horses/sortable.directive'

import { Apollo } from 'apollo-angular';
import { ADD_NOTE_MUTATION, NOTES_QUERY } from '../graphql'


@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss'],
    providers: [NotesService, DecimalPipe]
  })
  export class NotesComponent implements OnInit {
    notes$: Observable<Note[]>
    gqlnotes$: Observable<Note[]>
    total$: Observable<number>
    isLoading = false
    error: string = null

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    
    constructor(private apollo: Apollo, private service: NotesService) {}

    ngOnInit() {
      this.notes$ = this.service.notes$
      this.gqlnotes$ = this.service.gqlnotes$
      this.gqlnotes$.subscribe(notes => {
        this.isLoading = notes.length === 0
      });
      this.total$ = this.service.total$
    }
  
    onSort({column, direction}: SortEvent) {
      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = ''
        }
      });
  
      this.service.sortColumn = column
      this.service.sortDirection = direction
    }

    onSubmit(form: NgForm) {
      if (!form.valid) {
          return;
      }

      const note = form.value.note.trim();
      const type = form.value.type.trim();

      this.apollo.mutate({
          mutation: ADD_NOTE_MUTATION,
          variables: {
              note,
              type,
          },
          refetchQueries: [{
            query: NOTES_QUERY
          }],
        }).subscribe(({ data }) => {
          console.log('Note Data', data);
          form.reset();
          $('#addNoteModalCenter').toggle()
          $('.modal-backdrop').hide();
        },(error) => {
          console.log('There was an error sending the add note mutation', error);
          this.error = error;
        });
  } 

  
  }