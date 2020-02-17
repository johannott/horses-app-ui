import { Component } from '@angular/core';

import { Apollo, QueryRef } from 'apollo-angular';
import { RACES_BY_COUNTRY_QUERY } from '../../graphql'
import { Race } from '../race'

@Component({
    selector: 'app-irishGrade1s',
    templateUrl: './irishGrade1s.component.html',
    styleUrls: ['./irishGrade1s.component.scss'],
    providers: []
  })
  export class IrishGrade1sComponent{
    private tracks_query: QueryRef<any>
    race_name: string
    grade1s: Race[]
    races: Race[]
    
    constructor(private apollo: Apollo) {

        // const races = JSON.parse(localStorage.getItem('races'))
        // this.grade1s = races.filter(o => o.grade === 'Grade 1');
        // console.log('Grade 1s', this.grade1s)

        this.tracks_query = this.apollo.watchQuery({
            query: RACES_BY_COUNTRY_QUERY,
            variables: {country: 'Ireland'}
          });
      
          this.tracks_query.valueChanges.subscribe(result => {
            this.races = result.data && result.data.racesByCountry;
            console.log('Races By Country', this.races)
          })
    }
  
  }