import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {DecimalPipe} from '@angular/common';


import { Apollo } from 'apollo-angular';
import { UPDATE_ENTRY_MUTATION, ENTRIES_BY_RACE_QUERY } from '../graphql'


import { EntriesService } from './entries.service';

@Component({
  selector: 'app-update-entry',
  templateUrl: './update-entry.component.html',
  styleUrls: ['./update-entry.component.scss'],
  providers: [EntriesService, DecimalPipe]
})
export class UpdateEntryComponent {
    error: string = null;
    entry: any
    race_name: string
   

    constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) {
      this.race_name = this.route.snapshot.params['race_name']
      const horse_name = this.route.snapshot.params['horse_name']
      const entries = JSON.parse(localStorage.getItem('entries'))

      this.entry = entries.find(o => o.horse_name === horse_name);
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
            },
            refetchQueries: [{
              query: ENTRIES_BY_RACE_QUERY,
              variables: { race_name },
            }]
          }).subscribe(({ data }) => {
            form.reset();
            this.router.navigate(['/races/'+data.updateEntry.race_name]);
          },(error) => {
            console.log('There was an error sending the update entry mutation', error);
            this.error = error;
          });
    } 



}