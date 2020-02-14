import { Component, QueryList, ViewChildren, ViewChild, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common'

import { Observable } from 'rxjs'

import { Track } from './Track'
import { TracksService } from './tracks.service';
import { NgbdSortableHeader, SortEvent } from '../utils/sortable.directive'

import { Apollo } from 'apollo-angular';
import { ADD_TRACK_MUTATION, UPDATE_TRACK_MUTATION, TRACKS_QUERY } from '../graphql'


@Component({
    selector: 'app-tracks',
    templateUrl: './tracks.component.html',
    styleUrls: ['./tracks.component.scss'],
    providers: [TracksService, DecimalPipe]
  })
  export class TracksComponent implements OnInit {
    tracks$: Observable<Track[]>
    gqltracks$: Observable<Track[]>
    total$: Observable<number>
    isLoading = false
    error: string = null
    updateTrackForm: FormGroup
    track: Track = null
    tracks_: Track[] = []

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    @ViewChild('closeTrackAdd', null) closeTrackAdd;
    @ViewChild('closeTrackUpdate', null) closeTrackUpdate;
    
    constructor(private apollo: Apollo, public service: TracksService) {}

    ngOnInit() {
      this.tracks$ = this.service.tracks$
      this.gqltracks$ = this.service.gqltracks$
      this.gqltracks$.subscribe(tracks => {
        this.tracks_ = tracks
        this.isLoading = tracks.length === 0
      });
      this.total$ = this.service.total$

      this.updateTrackForm = new FormGroup({
        'id': new FormControl(""),
        'track_name': new FormControl("", Validators.required),
        'direction': new FormControl("", Validators.required),
        'topography': new FormControl(""),
        'notes': new FormControl(""),
        'length': new FormControl("", Validators.required),
        'surface': new FormControl("", Validators.required),
        'country': new FormControl("", Validators.required)
      })
    }

    onClickUpdate(id) {
      this.track = this.tracks_.find(o => o.id === id.toString());
      this.updateTrackForm.setValue({
        'id': this.track.id,
        'track_name': this.track.track_name,
        'direction': this.track.direction,
        'topography': this.track.topography,
        'notes': this.track.notes,
        'length': this.track.length,
        'surface': this.track.surface,
        'country': this.track.country
      })
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

      const track_name = form.value.track_name.trim();
      const direction = form.value.direction.trim();
      const topography = form.value.direction.trim();
      const notes = form.value.direction.trim();
      const length = form.value.length.trim();
      const surface = form.value.surface.trim();
      const country = form.value.country.trim();


      this.apollo.mutate({
          mutation: ADD_TRACK_MUTATION,
          variables: {
            track_name,
            direction,
            topography,
            notes,
            length,
            surface,
            country
          },
          refetchQueries: [{
            query: TRACKS_QUERY
          }],
        }).subscribe(({ data }) => {
          console.log('Track Data', data);
          form.reset();
          this.closeTrackAdd.nativeElement.click();
        },(error) => {
          console.log('There was an error sending the add track mutation', error);
          this.error = error;
        });
    }

    onSubmitUpdate() {
      if (!this.updateTrackForm.valid) {
        return;
      }
 
      const id = this.updateTrackForm.value.id.trim();
      const track_name = this.updateTrackForm.value.track_name.trim();
      const direction = this.updateTrackForm.value.direction.trim();
      const topography = this.updateTrackForm.value.topography.trim();
      const notes = this.updateTrackForm.value.notes.trim();
      const length = this.updateTrackForm.value.length.trim();
      const surface = this.updateTrackForm.value.surface.trim();
      const country = this.updateTrackForm.value.country.trim();
  
    this.apollo.mutate({
        mutation: UPDATE_TRACK_MUTATION,
        variables: {
          id,
          track_name,
          direction,
          topography,
          notes,
          length,
          surface,
          country
        },
        refetchQueries: [{
          query: TRACKS_QUERY
        }],
      }).subscribe(({ data }) => {
        console.log('Update Track Data', data);
        this.updateTrackForm.reset();
        this.closeTrackUpdate.nativeElement.click();
      },(error) => {
        console.log('There was an error sending the update track mutation', error);
        this.error = error;
      });
    }

  
  }