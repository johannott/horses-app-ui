import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo, QueryRef } from 'apollo-angular';
import { ACCOUNTS_QUERY } from '../graphql'

import { Subscription } from 'rxjs';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
    providers: []
  })
  export class AccountsComponent implements OnDestroy{
    private accounts_query: QueryRef<any>
    accounts: any
    balanceTotal: number = 0
    private accountsSub: Subscription;

    @Output() balance = new EventEmitter<number>();
    
    constructor(private apollo: Apollo, private route: ActivatedRoute) {
        this.accounts_query = this.apollo.watchQuery({
            query: ACCOUNTS_QUERY
          });
      
          this.accountsSub = this.accounts_query.valueChanges.subscribe(result => {
            this.accounts = result.data && result.data.accounts;
            if (this.accounts.length > 0) {
              this.balanceTotal = this.accounts.map(account => Number(account.balance)).reduce((prev, next) => prev + next);
              this.balance.emit(this.balanceTotal);
            }
          })
    }

    ngOnDestroy() {
      this.accountsSub.unsubscribe();
    }
  
  }