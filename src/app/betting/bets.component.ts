import { Component, QueryList, ViewChildren, ViewChild, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common'

import { Observable } from 'rxjs'

import { Bet } from './bet'
import { BetsService } from './bets.service';
import { NgbdSortableHeader, SortEvent } from '../utils/sortable.directive'

import { Apollo } from 'apollo-angular';
import { ADD_BET_MUTATION, UPDATE_BET_MUTATION, BETS_QUERY } from '../graphql'


@Component({
    selector: 'app-bets',
    templateUrl: './bets.component.html',
    styleUrls: ['./bets.component.scss'],
    providers: [BetsService, DecimalPipe]
  })
  export class BetsComponent implements OnInit {
    bets$: Observable<Bet[]>
    gqlbets$: Observable<Bet[]>
    total$: Observable<number>
    isLoading = false
    error: string = null
    hasBets: boolean = false
    updateBetForm: FormGroup
    bets_: Bet[] = []
    bet: Bet = null 

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    @ViewChild('closeBetAdd', null) closeBetAdd;
    @ViewChild('closeBetUpdate', null) closeBetUpdate;
    
    constructor(private apollo: Apollo, public service: BetsService) {}

    ngOnInit() {
      this.bets$ = this.service.bets$
      this.gqlbets$ = this.service.gqlbets$
      this.gqlbets$.subscribe(bets => {
        this.bets_ = bets
        this.isLoading = bets.length === 0
        this.hasBets = bets.length > 0
      });
      this.total$ = this.service.total$

      this.updateBetForm = new FormGroup({
        'id': new FormControl(""),
        'race_name': new FormControl("", Validators.required),
        'date': new FormControl("", Validators.required),
        'time': new FormControl("", Validators.required),
        'horse_name': new FormControl("", Validators.required),
        'type': new FormControl("", Validators.required),
        'places': new FormControl("", Validators.required),
        'price': new FormControl("", Validators.required),
        'amount': new FormControl("", Validators.required),
        'to_return': new FormControl("", Validators.required),
      })
    }

    onClickUpdate(id) {
      this.bet = this.bets_.find(o => o.id === id.toString());
      this.updateBetForm.setValue({
        'id': this.bet.id,
        'race_name': this.bet.race_name,
        'date': this.bet.date,
        'time': this.bet.time,
        'horse_name': this.bet.horse_name.reduce((x,y) => x + ',' + y),
        'type': this.bet.type,
        'places': this.bet.places,
        'price': this.bet.price,
        'amount': this.bet.amount,
        'to_return': this.bet.to_return
      })
    }
  
    onSort({column, direction}: SortEvent) {
      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = ''
        }
      });
  
      this.service.sortColumn = column
      this.service.sortDirection = direction
    }

    onSubmit(form: NgForm) {
      if (!form.valid) {
          return;
      }

      const race_name = form.value.race_name.trim();
      const date = form.value.date.trim();
      const time = form.value.time.trim();
      const horse_name = form.value.horse_name.trim().split(',');
      const type = form.value.type.trim();
      const places = form.value.places.trim();
      const price = form.value.price.trim();
      const amount = form.value.amount.trim();
      const to_return = form.value.to_return.trim();

      this.apollo.mutate({
          mutation: ADD_BET_MUTATION,
          variables: {
            race_name,
            date,
            time,
            horse_name,
            type,
            places,
            price,
            amount,
            to_return
          },
          refetchQueries: [{
            query: BETS_QUERY
          }],
        }).subscribe(({ data }) => {
          console.log('Bet Data', data);
          form.reset();
          this.closeBetAdd.nativeElement.click();
        },(error) => {
          console.log('There was an error sending the add bet mutation', error);
          this.error = error;
        });
  } 


  onSubmitUpdate() {
    if (!this.updateBetForm.valid) {
      return;
  }
 
  const id = this.updateBetForm.value.id.trim();
  const race_name = this.updateBetForm.value.race_name.trim();
  const date = this.updateBetForm.value.date.trim();
  const time = this.updateBetForm.value.time.trim();
  const horse_name = this.updateBetForm.value.horse_name.trim().split(',');
  const type = this.updateBetForm.value.type.trim();
  const places = this.updateBetForm.value.places.trim();
  const price = this.updateBetForm.value.price.trim();
  const amount = this.updateBetForm.value.amount.trim();
  const to_return = this.updateBetForm.value.to_return.trim();

  this.apollo.mutate({
      mutation: UPDATE_BET_MUTATION,
      variables: {
        id,
        race_name,
        date,
        time,
        horse_name,
        type,
        places,
        price,
        amount,
        to_return
      },
      refetchQueries: [{
        query: BETS_QUERY
      }],
    }).subscribe(({ data }) => {
      console.log('Update Bet Data', data);
      this.updateBetForm.reset();
      this.closeBetUpdate.nativeElement.click();
    },(error) => {
      console.log('There was an error sending the update bet mutation', error);
      this.error = error;
    });
  }


  
  }