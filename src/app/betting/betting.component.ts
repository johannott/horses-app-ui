import { Component } from '@angular/core';

@Component({
    selector: 'app-betting',
    templateUrl: './betting.component.html',
    styleUrls: ['./betting.component.scss'],
    providers: []
  })
  export class BettingComponent{
    pointFive: number
    onePoint: number
    twoPoints: number
    balance: number
    
    constructor() {}

    getBalance(balance: number) {
      this.balance = balance
      this.pointFive = this.roundToTwoDecmimals(balance*.005);
      this.onePoint = this.roundToTwoDecmimals(balance*.01);
      this.twoPoints = this.roundToTwoDecmimals(balance*.02);
    }

    roundToTwoDecmimals(amountofBank: number): number {
      return Math.round((amountofBank + Number.EPSILON) * 100) / 100
    }
  }