import { Component, ViewChildren, QueryList, Input } from '@angular/core';
import {Observable} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Entry } from './entry';
import { EntriesService } from './entries.service';
import { NgbdSortableHeader, SortEvent } from '../utils/sortable.directive';

@Component({
    selector: 'app-entries',
    templateUrl: './entries.component.html',
    styleUrls: ['./entries.component.scss'],
    providers: [EntriesService, DecimalPipe]
  })
  export class EntriesComponent{
    entries$: Observable<Entry[]>;
    total$: Observable<number>;
    race_name: string
    isLoading = false
  
    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  
    constructor(public service: EntriesService, private route: ActivatedRoute) {
      this.entries$ = service.entries$;
      this.total$ = service.total$;
      this.race_name = this.route.snapshot.params['race_name']

      this.entries$.subscribe(entries => {
        this.isLoading = entries.length === 0
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