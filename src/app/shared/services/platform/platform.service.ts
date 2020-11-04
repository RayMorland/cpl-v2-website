import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  public provinces = [
    'British Columbia',
    'Alberta',
    'Saskatchewan',
    'Manitoba',
    'Ontario',
    'Quebec',
    'New Brunswick',
    'Nove Scotia',
    'Newfoundland and Labrador',
    'Prince Edward Island',
    'Yukon',
    'Northwest Territories',
    'Nunavut'
  ];

  public countries = [
    'Canada'
  ];

  public months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  constructor() { }

}
