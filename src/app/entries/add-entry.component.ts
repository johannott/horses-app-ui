import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const ADD_ENTRY_MUTATION = gql`
mutation addEntryMutation (
    $race_name: String!,       
    $horse_name: String!, 
    $number: String,
    $weight: String,
    $jockey: String,
    $trends: String,
    $tipped: String,
    $bets: String) {
    addEntry(
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
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss'],
  providers: []
})
export class AddEntryComponent {
    error: string = null;

    constructor(private apollo: Apollo, private router: Router) {}


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
            mutation: ADD_ENTRY_MUTATION,
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
            this.router.navigate(['/races/'+data.addEntry.race_name]);
          },(error) => {
            console.log('There was an error sending the add entry mutation', error);
            this.error = error;
          });
    } 



}