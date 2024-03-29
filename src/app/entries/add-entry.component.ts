import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { ADD_ENTRY_MUTATION, ENTRIES_BY_RACE_QUERY } from '../graphql'

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss'],
  providers: []
})
export class AddEntryComponent {
    error: string = null;
    race_name: string
    horses: any

    constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) {
      this.race_name = this.route.snapshot.params['race_name']
      this.horses = JSON.parse(localStorage.getItem('horses'))
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

        const isInHorses = this.horses.find(o => o.horse_name === horse_name);

        if (!isInHorses) {
          this.error = 'Horse is not currently in horse database. Please add there before adding entry';
          return;
      }

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
            },
            refetchQueries: [{
              query: ENTRIES_BY_RACE_QUERY,
              variables: { race_name },
            }]
          }).subscribe(({ data }) => {
            form.reset();
            this.router.navigate(['/races/'+data.addEntry.race_name]);
          },(error) => {
            console.log('There was an error sending the add entry mutation', error);
            this.error = error;
          });
    } 



}