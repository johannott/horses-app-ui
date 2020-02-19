import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { Apollo, QueryRef } from 'apollo-angular'

import { RACE_BY_NAME_QUERY } from '../graphql'

import { EntriesService } from '../entries/entries.service'
import { WinnersService } from '../winners/winners.service'
import { DecimalPipe } from '@angular/common'

@Component({
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.scss'],
    providers: [EntriesService, WinnersService, DecimalPipe]
  })
  export class RaceComponent implements OnInit{
    private race_query: QueryRef<any>
    race: any
    private race_name: string

    constructor(private router: Router, private route: ActivatedRoute, private apollo: Apollo, public entriesService: EntriesService) {
    }

    ngOnInit() {
      this.race_name = this.route.snapshot.params['race_name']
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.race_query = this.apollo.watchQuery({
        query: RACE_BY_NAME_QUERY,
        variables: {race_name: this.race_name}
      });
  
      this.race_query.valueChanges.subscribe(result => {
        this.race = result.data && result.data.raceByName;
      })
    }
  }