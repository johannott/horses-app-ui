import { Component, QueryList, ViewChildren } from '@angular/core';
import {DecimalPipe} from '@angular/common';

import {Observable} from 'rxjs';

import { Horse } from './horse';
import { HorseService } from './horse.service';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';

@Component({
  selector: 'app-horses',
  templateUrl: './horses.component.html',
  styleUrls: ['./horses.component.scss'],
  providers: [HorseService, DecimalPipe]
})
export class HorsesComponent {
  horses$: Observable<Horse[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: HorseService) {
    this.horses$ = service.horses$;
    this.total$ = service.total$;
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
