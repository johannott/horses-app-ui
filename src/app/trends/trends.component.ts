import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo, QueryRef } from 'apollo-angular';
import { TRENDS_QUERY } from '../graphql'

@Component({
    selector: 'app-trends',
    templateUrl: './trends.component.html',
    styleUrls: ['./trends.component.scss'],
    providers: []
  })
  export class TrendsComponent{
    private trend_query: QueryRef<any>
    trends: any
    race_name: string
    
    constructor(private apollo: Apollo, private route: ActivatedRoute) {
        this.race_name = this.route.snapshot.params['race_name']

        this.trend_query = this.apollo.watchQuery({
            query: TRENDS_QUERY,
            variables: {race_name: this.race_name}
          });
      
          this.trend_query.valueChanges.subscribe(result => {
            this.trends = result.data && result.data.trendsByRace;
          })
    }
  
  }