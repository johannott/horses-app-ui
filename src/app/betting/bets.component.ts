import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo, QueryRef } from 'apollo-angular';
import { BETS_QUERY } from '../graphql'

@Component({
    selector: 'app-bets',
    templateUrl: './bets.component.html',
    styleUrls: ['./bets.component.scss'],
    providers: []
  })
  export class BetsComponent{
    private bets_query: QueryRef<any>
    bets: any
    
    constructor(private apollo: Apollo, private route: ActivatedRoute) {
        this.bets_query = this.apollo.watchQuery({
            query: BETS_QUERY
          });
      
          this.bets_query.valueChanges.subscribe(result => {
            this.bets = result.data && result.data.bets;
            console.log('Bets', this.bets)
          })
    }
  
  }