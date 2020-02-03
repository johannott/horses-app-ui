import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

import { EntriesService } from '../entries/entries.service'
import { DecimalPipe } from '@angular/common';

const RACE_QUERY = gql`
  query RaceByName($race_name: String!){ 
    raceByName(race_name: $race_name) {
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
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.scss'],
    providers: [EntriesService, DecimalPipe]
  })
  export class RaceComponent implements OnInit{
    private race_query: QueryRef<any>
    race: any
    private race_name: string

    constructor(private route: ActivatedRoute, private apollo: Apollo, public entriesService: EntriesService) {
    }

    ngOnInit() {
      console.log(this.route.snapshot.params['race_name'])
      this.race_name = this.route.snapshot.params['race_name']
      this.race_query = this.apollo.watchQuery({
        query: RACE_QUERY,
        variables: {race_name: this.race_name}
      });
  
      this.race_query.valueChanges.subscribe(result => {
        this.race = result.data && result.data.raceByName;
        console.log(this.race)
      })
    }
  }