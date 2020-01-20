import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const HORSES_QUERY = gql`
  query { 
    horses {
      horse_name
    }
  }
`;

@Component({
  selector: 'app-horses',
  templateUrl: './horses.component.html',
  styleUrls: ['./horses.component.scss']
})
export class HorsesComponent implements OnInit {
  horses: any[] = [];

  private query: QueryRef<any>;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.query = this.apollo.watchQuery({
      query: HORSES_QUERY
    });

    this.query.valueChanges.subscribe(result => {
      this.horses = result.data && result.data.horses;
    });
  }

}
