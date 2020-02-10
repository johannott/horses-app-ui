import { Component, QueryList, ViewChildren, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DecimalPipe } from '@angular/common'

import { Observable } from 'rxjs'

import { Bet } from './bet'
import { BetsService } from './bets.service';
import { NgbdSortableHeader, SortEvent } from '../horses/sortable.directive'

import { Apollo } from 'apollo-angular';
import { ADD_BET_MUTATION, BETS_QUERY } from '../graphql'


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

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    @ViewChild('closebutton', null) closebutton;
    
    constructor(private apollo: Apollo, public service: BetsService) {}

    ngOnInit() {
      this.bets$ = this.service.bets$
      this.gqlbets$ = this.service.gqlbets$
      this.gqlbets$.subscribe(bets => {
        this.isLoading = bets.length === 0
        this.hasBets = bets.length > 0
      });
      this.total$ = this.service.total$
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
          this.closebutton.nativeElement.click();
        },(error) => {
          console.log('There was an error sending the add bet mutation', error);
          this.error = error;
        });
  } 

  
  }