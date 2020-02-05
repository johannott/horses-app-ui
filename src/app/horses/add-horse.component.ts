import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {DecimalPipe} from '@angular/common';

import { Apollo } from 'apollo-angular';

import { HorseService } from './horse.service'

import { HORSES_QUERY, ADD_HORSE_MUTATION } from '../graphql'

@Component({
  selector: 'app-add-horse',
  templateUrl: './add-horse.component.html',
  styleUrls: ['./add-horse.component.scss'],
  providers: [HorseService, DecimalPipe]
})
export class AddHorseComponent {
    error: string = null;

    constructor(private apollo: Apollo, private router: Router, public service: HorseService) {}


    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        const horse_name = form.value.name.trim();
        const trainer = form.value.trainer.trim();
        const regular_jockey = form.value.jockey.trim();
        const owner = form.value.owner.trim();
        const age = form.value.age.trim();
        const gender = form.value.gender.trim();
        const bred = form.value.bred.trim();
        const sire = form.value.sire.trim();
        const form_ = form.value.form.trim();
        const races = form.value.races.trim();
        const wins = form.value.wins.trim();
        const places = form.value.places.trim();
        const win_percentage = form.value.win_percentage.trim();
        const place_percentage = form.value.place_percentage.trim();
        const type = form.value.type.trim();
        const distance = form.value.distance.trim();
        const ground = form.value.ground.trim();
        const track = form.value.track.trim();
        const comments = form.value.comments.trim();
        const link = form.value.link.trim();

        this.apollo.mutate({
            mutation: ADD_HORSE_MUTATION,
            variables: {
                horse_name,
                trainer,
                regular_jockey,
                owner,
                age,
                gender,
                bred,
                sire,
                form: form_,
                races,
                wins,
                places,
                win_percentage,
                place_percentage,
                type,
                distance,
                ground,
                track,
                comments,
                link
            },
            refetchQueries: [{
              query: HORSES_QUERY
            }],
          }).subscribe(({ data }) => {
            console.log('Horse Data', data);
            form.reset();
            this.router.navigate(['/horses']);
          },(error) => {
            console.log('There was an error sending the add horse mutation', error);
            this.error = error;
          });
    } 



}