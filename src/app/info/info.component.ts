import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo, QueryRef } from 'apollo-angular';
import { ABBREVIATION_QUERY } from '../graphql'

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    providers: []
  })
  export class InfoComponent{
    private abbr_query: QueryRef<any>
    abbrs: any
    
    constructor(private apollo: Apollo, private route: ActivatedRoute) {
        this.abbr_query = this.apollo.watchQuery({
            query: ABBREVIATION_QUERY,
          });
      
          this.abbr_query.valueChanges.subscribe(result => {
            this.abbrs = result.data && result.data.abbreviations;
            console.log('Abbreviations', this.abbrs)
          })
    }
  
  }