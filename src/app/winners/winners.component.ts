import { Component, ViewChildren, QueryList, Input } from '@angular/core';
import {Observable} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Winner } from './winner';
import { WinnersService } from './winners.service';
import { NgbdSortableHeader, SortEvent } from '../utils/sortable.directive';

@Component({
    selector: 'app-winners',
    templateUrl: './winners.component.html',
    styleUrls: ['./winners.component.scss'],
    providers: [WinnersService, DecimalPipe]
  })
  export class WinnersComponent{
    winners$: Observable<Winner[]>;
    total$: Observable<number>;
    race_name: string
    isLoading = false
  
    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  
    constructor(public service: WinnersService, private route: ActivatedRoute) {
      this.winners$ = service.winners$;
      this.total$ = service.total$;
      this.race_name = this.route.snapshot.params['race_name']

      this.winners$.subscribe(winners => {
        this.isLoading = winners.length === 0
      });
    }
  
    onSort({column, direction}: SortEvent) {
      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
  
      this.service.sortColumn = column;
      this.service.sortDirection = direction;
    }
  }