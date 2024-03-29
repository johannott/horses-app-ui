import { Component } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

import { Apollo } from 'apollo-angular'
import { HORSES_QUERY, UPDATE_HORSE_MUTATION, HORSE_BY_NAME_QUERY } from '../graphql'

@Component({
  selector: 'update-add-horse',
  templateUrl: './update-horse.component.html',
  styleUrls: ['./update-horse.component.scss'],
  providers: []
})
export class UpdateHorseComponent {
    error: string = null
    current_name: string
    horse: any

    constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) {
      this.current_name = this.route.snapshot.params['horse_name']
      const horses = JSON.parse(localStorage.getItem('horses'))

      this.horse = horses.find(o => o.horse_name === this.current_name)
    }


    onSubmit(form: NgForm) {
        if (!form.valid) {
            return
        }

        const horse_name = form.value.name.trim()
        const trainer = form.value.trainer.trim()
        const regular_jockey = form.value.jockey.trim()
        const owner = form.value.owner.trim()
        const age = form.value.age.trim()
        const gender = form.value.gender.trim()
        const bred = form.value.bred.trim()
        const sire = form.value.sire.trim()
        const form_ = form.value.form.trim()
        const type = form.value.type.trim()
        const distance = form.value.distance.trim()
        const ground = form.value.ground.trim()
        const track = form.value.track.trim()
        const comments = form.value.comments.trim()
        const link = form.value.link.trim()

        this.apollo.mutate({
            mutation: UPDATE_HORSE_MUTATION,
            variables: {
                current_name: this.current_name,
                horse_name,
                trainer,
                regular_jockey,
                owner,
                age,
                gender,
                bred,
                sire,
                form: form_,
                type,
                distance,
                ground,
                track,
                comments,
                link
            },
            refetchQueries: [{
              query: HORSES_QUERY
            },
            {
              query: HORSE_BY_NAME_QUERY, 
              variables: { horse_name: this.current_name },
            }]
          }).subscribe(({ data }) => {
            form.reset()
            this.router.navigate(['/horses'])
          },(error) => {
            console.log('There was an error sending the update horse mutation', error)
            this.error = error
          });
    } 



}