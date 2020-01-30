import { Component, ViewChildren, QueryList, Input } from '@angular/core';
import {Observable} from 'rxjs';
import {DecimalPipe} from '@angular/common';

import { Entry } from './entry';
import { EntriesService } from './entries.service';
import { NgbdSortableHeader, SortEvent } from '../horses/sortable.directive';

@Component({
    selector: 'app-entries',
    templateUrl: './entries.component.html',
    styleUrls: ['./entries.component.scss'],
    providers: [EntriesService, DecimalPipe]
  })
  export class EntriesComponent{
    entries$: Observable<Entry[]>;
    total$: Observable<number>;
  
    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  
    constructor(public service: EntriesService) {
      this.entries$ = service.entries$;
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