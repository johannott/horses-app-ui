import { Component, QueryList, ViewChildren, ViewChild, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common'

import { Observable } from 'rxjs'

import { Race } from './race'
import { RacesService } from './races.service';
import { NgbdSortableHeader, SortEvent } from '../utils/sortable.directive'

import { Apollo } from 'apollo-angular';
import { ADD_RACE_MUTATION, UPDATE_RACE_MUTATION, RACES_QUERY } from '../graphql'


@Component({
    selector: 'app-races',
    templateUrl: './races.component.html',
    styleUrls: ['./races.component.scss'],
    providers: [RacesService, DecimalPipe]
  })
  export class RacesComponent implements OnInit {
    races$: Observable<Race[]>
    gqlraces$: Observable<Race[]>
    total$: Observable<number>
    isLoading = false
    error: string = null
    hasRaces: boolean = false
    updateRaceForm: FormGroup
    races_: Race[] = []
    race: Race = null 

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    @ViewChild('closeRaceAdd', null) closeRaceAdd;
    @ViewChild('closeRaceUpdate', null) closeRaceUpdate;
    
    constructor(private apollo: Apollo, public service: RacesService) {}

    ngOnInit() {
      this.races$ = this.service.races$
      this.gqlraces$ = this.service.gqlraces$
      this.gqlraces$.subscribe(races => {
        this.races_ = races
        this.isLoading = races.length === 0
        this.hasRaces = races.length > 0
      });
      this.total$ = this.service.total$

      this.updateRaceForm = new FormGroup({
        'id': new FormControl(""),
        'race_name': new FormControl("", Validators.required),
        'race_fullname': new FormControl("", Validators.required),
        'type': new FormControl("", Validators.required),
        'grade': new FormControl("", Validators.required),
        'distance': new FormControl("", Validators.required),
        'course': new FormControl("", Validators.required),
        'country': new FormControl("", Validators.required),
        'age_limit': new FormControl("", Validators.required),
        'attended': new FormControl("", Validators.required)
      })
    }

    onClickUpdate(id) {
      this.race = this.races_.find(o => o.id === id.toString());
      this.updateRaceForm.setValue({
        'id': this.race.id,
        'race_name': this.race.race_name,
        'race_fullname': this.race.race_fullname,
        'type': this.race.type,
        'grade': this.race.grade,
        'distance': this.race.distance,
        'course': this.race.course,
        'country': this.race.country,
        'age_limit': this.race.age_limit,
        'attended': this.race.attended
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

      const race_name = form.value.race_name.trim();
      const race_fullname = form.value.race_fullname.trim();
      const type = form.value.type.trim();
      const grade = form.value.grade.trim();
      const distance = form.value.distance.trim();
      const course = form.value.course.trim();
      const country = form.value.country.trim();
      const age_limit = form.value.age_limit.trim();
      const attended = form.value.attended.trim();

      this.apollo.mutate({
          mutation: ADD_RACE_MUTATION,
          variables: {
            race_name,
            race_fullname,
            type,
            grade,
            distance,
            course,
            country,
            age_limit,
            attended
          },
          refetchQueries: [{
            query: RACES_QUERY
          }],
        }).subscribe(({ data }) => {
          form.reset();
          this.error = null;
          this.closeRaceAdd.nativeElement.click();
        },(error) => {
          console.log('There was an error sending the add race mutation', error);
          this.error = error;
        });
  } 


  onSubmitUpdate() {
    if (!this.updateRaceForm.valid) {
      return;
  }
 
  const id = this.updateRaceForm.value.id.trim();
  const race_name = this.updateRaceForm.value.race_name.trim();
  const race_fullname = this.updateRaceForm.value.race_fullname.trim();
  const type = this.updateRaceForm.value.type.trim();
  const grade = this.updateRaceForm.value.grade.trim();
  const distance = this.updateRaceForm.value.distance.trim();
  const course = this.updateRaceForm.value.course.trim();
  const country = this.updateRaceForm.value.country.trim();
  const age_limit = this.updateRaceForm.value.age_limit.trim();
  const attended = this.updateRaceForm.value.attended.trim();

  this.apollo.mutate({
      mutation: UPDATE_RACE_MUTATION,
      variables: {
        id,
        race_name,
        race_fullname,
        type,
        grade,
        distance,
        course,
        country,
        age_limit,
        attended
      },
      refetchQueries: [{
        query: RACES_QUERY
      }],
    }).subscribe(({ data }) => {
      this.updateRaceForm.reset();
      this.closeRaceUpdate.nativeElement.click();
    },(error) => {
      console.log('There was an error sending the update race mutation', error);
      this.error = error;
    });
  } 
}