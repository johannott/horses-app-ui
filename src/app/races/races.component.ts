import { Component } from '@angular/core';

import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const RACES_QUERY = gql`
  query { 
    races {
      race_name,
      race_fullname,
      type,
      grade,
      distance,
      course,
      age_limit
    }
  }
`;

@Component({
    selector: 'app-races',
    templateUrl: './races.component.html',
    styleUrls: ['./races.component.scss'],
    providers: []
  })
  export class RacesComponent {

    private query: QueryRef<any>
    races: any

    constructor(private apollo: Apollo){
      this.query = this.apollo.watchQuery({
        query: RACES_QUERY
      });
  
      this.query.valueChanges.subscribe(result => {
        this.races = result.data && result.data.races;
        console.log(this.races)
      });
    }

  }