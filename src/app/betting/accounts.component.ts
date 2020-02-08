import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo, QueryRef } from 'apollo-angular';
import { ACCOUNTS_QUERY } from '../graphql'

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
    providers: []
  })
  export class AccountsComponent{
    private accounts_query: QueryRef<any>
    accounts: any
    balanceTotal: number = 0

    @Output() balance = new EventEmitter<number>();
    
    constructor(private apollo: Apollo, private route: ActivatedRoute) {
        this.accounts_query = this.apollo.watchQuery({
            query: ACCOUNTS_QUERY
          });
      
          this.accounts_query.valueChanges.subscribe(result => {
            this.accounts = result.data && result.data.accounts;
            if (this.accounts.length > 0) {
              this.balanceTotal = this.accounts.map(account => Number(account.balance)).reduce((prev, next) => prev + next);
              this.balance.emit(this.balanceTotal);
            }
            console.log('Accounts', this.accounts)
            console.log('balanceTotal', this.balanceTotal)
          })
    }
  
  }