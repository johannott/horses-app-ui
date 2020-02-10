import { Component, QueryList, ViewChildren, ViewChild, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common'

import { Observable } from 'rxjs'

import { Note } from './note'
import { NotesService } from './notes.service';
import { NgbdSortableHeader, SortEvent } from '../horses/sortable.directive'

import { Apollo } from 'apollo-angular';
import { ADD_NOTE_MUTATION, UPDATE_NOTE_MUTATION, NOTES_QUERY } from '../graphql'


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
    note: Note = null
    updateNoteForm: FormGroup

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    @ViewChild('closebutton', null) closebutton;
    @ViewChild('closebuttonUpdate', null) closebuttonUpdate;
    
    constructor(private apollo: Apollo, public service: NotesService) {}

    ngOnInit() {
      this.notes$ = this.service.notes$
      this.gqlnotes$ = this.service.gqlnotes$
      this.gqlnotes$.subscribe(notes => {
        this.isLoading = notes.length === 0
      });
      this.total$ = this.service.total$

      this.updateNoteForm = new FormGroup({
        'note': new FormControl("", Validators.required),
        'type': new FormControl("", Validators.required),
        'id': new FormControl("")
      })

      $(document).on("click", ".update-note", () => {
        var noteId = $(".update-note").data('id')
        const notes = JSON.parse(localStorage.getItem('notes'))
        this.note = notes.find(o => o.id === noteId.toString());
        this.updateNoteForm.setValue({
          'note': this.note.note_,
          'type': this.note.type,
          'id': this.note.id
        })
      });
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
          this.closebutton.nativeElement.click();
        },(error) => {
          console.log('There was an error sending the add note mutation', error);
          this.error = error;
        });
    } 

    onSubmitUpdate() {
      if (!this.updateNoteForm.valid) {
        return;
    }
   
    const id = this.updateNoteForm.value.id.trim();
    const note = this.updateNoteForm.value.note.trim();
    const type = this.updateNoteForm.value.type.trim();

    this.apollo.mutate({
        mutation: UPDATE_NOTE_MUTATION,
        variables: {
          id,
          note,
          type,
        },
        refetchQueries: [{
          query: NOTES_QUERY
        }],
      }).subscribe(({ data }) => {
        console.log('Note Data', data);
        this.updateNoteForm.reset();
        this.closebuttonUpdate.nativeElement.click();
      },(error) => {
        console.log('There was an error sending the update note mutation', error);
        this.error = error;
      });
    }

  
  }