import { Component, QueryList, ViewChildren, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DecimalPipe } from '@angular/common'

import { Observable } from 'rxjs'

import { Track } from './Track'
import { TracksService } from './tracks.service';
import { NgbdSortableHeader, SortEvent } from '../utils/sortable.directive'

import { Apollo } from 'apollo-angular';
import { ADD_TRACK_MUTATION, TRACKS_QUERY } from '../graphql'


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

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    @ViewChild('closebutton', null) closebutton;
    
    constructor(private apollo: Apollo, public service: TracksService) {}

    ngOnInit() {
      this.tracks$ = this.service.tracks$
      this.gqltracks$ = this.service.gqltracks$
      this.gqltracks$.subscribe(tracks => {
        this.isLoading = tracks.length === 0
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
          this.closebutton.nativeElement.click();
        },(error) => {
          console.log('There was an error sending the add track mutation', error);
          this.error = error;
        });
  } 

  
  }