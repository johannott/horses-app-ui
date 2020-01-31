import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {DecimalPipe} from '@angular/common';


import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { EntriesService } from './entries.service';

const UPDATE_ENTRY_MUTATION = gql`
mutation updateEntryMutation (
    $race_name: String!,       
    $horse_name: String!, 
    $number: String,
    $weight: String,
    $jockey: String,
    $trends: String,
    $tipped: String,
    $bets: String) {
    updateEntry(
        race_name: $race_name
        horse_name: $horse_name, 
        number: $number
        weight: $weight,
        jockey: $jockey,
        trends: $trends,
        tipped: $tipped,
        bets: $bets
    ) {
        race_name
        horse_name
    }
}
`;

@Component({
  selector: 'app-update-entry',
  templateUrl: './update-entry.component.html',
  styleUrls: ['./update-entry.component.scss'],
  providers: [EntriesService, DecimalPipe]
})
export class UpdateEntryComponent {
    error: string = null;
    entry: object
    race_name: string
   

    constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) {
      console.log(JSON.parse(localStorage.getItem('entries')));
      console.log(this.route.snapshot.params['horse_name'])

      this.race_name = this.route.snapshot.params['race_name']
      const horse_name = this.route.snapshot.params['horse_name']
      const entries = JSON.parse(localStorage.getItem('entries'))

      this.entry = entries.find(o => o.horse_name === horse_name);
      console.log('entry', this.entry)
    }


    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        const race_name = form.value.race_name.trim();
        const horse_name = form.value.horse_name.trim();
        const number = form.value.number.trim();
        const weight = form.value.weight.trim();
        const jockey = form.value.jockey.trim();
        const trends = form.value.trends.trim();
        const tipped = form.value.tipped.trim();
        const bets = form.value.bets.trim();      

        this.apollo.mutate<any>({
            mutation: UPDATE_ENTRY_MUTATION,
            variables: {
                race_name,
                horse_name,
                number,
                weight,
                jockey,
                trends,
                tipped,
                bets
            }
          }).subscribe(({ data }) => {
            console.log('Entry Data', data);
            form.reset();
            this.router.navigate(['/races/'+data.updateEntry.race_name]);
          },(error) => {
            console.log('There was an error sending the update entry mutation', error);
            this.error = error;
          });
    } 



}