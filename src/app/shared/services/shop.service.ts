
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { of, combineLatest } from 'rxjs';
import { startWith, debounceTime, delay, map, switchMap } from 'rxjs/operators';
import { MeetsService } from './meets/meets.service';
import { MembersService } from './members/members.service';
import { Meet } from '../models/meet.model';

@Injectable()
export class ShopService {
  public Meets: Meet[] = [];
  public initialFilters = {
    minPrice: 10,
    maxPrice: 40,
    minRating: 1,
    maxRating: 5
  };

  constructor(
    private meetService: MeetsService,
    private memberService: MembersService
  ) { }

  public getMeets(): Observable<Meet[]> {
    let meets = this.meetService.getMeets();
    return meets
      .pipe(
        map((data: Meet[]) => {
          this.Meets = data;
          return data;
        })
      );
  }

  public getMeetDetails(MeetID): Observable<Meet> {
    console.log(MeetID);
    let meet = this.meetService.findMeet(MeetID);
    return meet;
  }
  // public getCategories(): Observable<any> {
  //   // Get Categories from league

  //   return ;
  // }

  public getFilteredMeet(filterForm: FormGroup): Observable<Meet[]> {
    return combineLatest(
      this.getMeets(),
      filterForm.valueChanges
      .pipe(
        startWith(this.initialFilters),
        debounceTime(400)
      )
    )
    .pipe(
      switchMap(([meets, filterData]) => {
        return this.filterMeets(meets, filterData);
      })
    );
  }
  /*
  * If your data set is too big this may raise performance issue.
  * You should implement server side filtering instead.
  */ 
  private filterMeets(meets: Meet[], filterData): Observable<Meet[]> {
    let filteredMeets = meets.filter(p => {
      let isMatch: Boolean;
      let match = {
        search: false,
        // caterory: false,
        // price: false,
        // rating: false
      };
      // Search
      if (
        !filterData.search
        || p.title.toLowerCase().indexOf(filterData.search.toLowerCase()) > -1
        // || p.description.indexOf(filterData.search) > -1
        // || p.tags.indexOf(filterData.search) > -1
      ) {
        match.search = true;
      } else {
        match.search = false;
      }
      // Category filter
      // if (
      //   filterData.category === p.category 
      //   || !filterData.category 
      //   || filterData.category === 'all'
      // ) {
      //   match.caterory = true;
      // } else {
      //   match.caterory = false;
      // }
      // Price filter
      // if (
      //   p.price.sale >= filterData.minPrice 
      //   && p.price.sale <= filterData.maxPrice
      // ) {
      //   match.price = true;
      // } else {
      //   match.price = false;
      // }
      // Rating filter
      // if(
      //   p.ratings.rating >= filterData.minRating 
      //   && p.ratings.rating <= filterData.maxRating
      // ) {
      //   match.rating = true;
      // } else {
      //   match.rating = false;
      // }
      
      for(let m in match) {
        if(!match[m]) return false;
      }

      return true;
    });
    console.log(filteredMeets);
    return of(filteredMeets);
  }
}
