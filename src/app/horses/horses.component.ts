import { Component, QueryList, ViewChildren, OnInit, OnDestroy } from '@angular/core'
import { DecimalPipe } from '@angular/common'

import {Observable} from 'rxjs'

import { Horse } from './horse'
import { HorseService } from './horse.service'
import { NgbdSortableHeader, SortEvent } from './sortable.directive'

@Component({
  selector: 'app-horses',
  templateUrl: './horses.component.html',
  styleUrls: ['./horses.component.scss'],
  providers: [HorseService, DecimalPipe]
})
export class HorsesComponent implements OnInit, OnDestroy {
  horses$: Observable<Horse[]>
  gqlhorses$: Observable<Horse[]>
  total$: Observable<number>
  isLoading = false
  mainContainer: HTMLElement

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: HorseService) {}

  ngOnInit() {
    this.horses$ = this.service.horses$
    this.gqlhorses$ = this.service.gqlhorses$
    this.gqlhorses$.subscribe(horses => {
      this.isLoading = horses.length === 0
    });
    this.total$ = this.service.total$

    this.mainContainer = document.getElementById('main-container')
    this.mainContainer.className = 'container-fluid'
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

  ngOnDestroy() {
    this.mainContainer.className = 'container'
  }

}
