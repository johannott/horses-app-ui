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
      this.pointFive = balance*.005;
      this.onePoint = balance*.01;
      this.twoPoints = balance*.02;
    }
  
  }