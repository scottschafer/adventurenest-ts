import * as originalMoment from "moment";
import { extendMoment, DateRange } from "moment-range";
const moment = extendMoment(originalMoment);

import { any, string } from "prop-types";
import firebaseApp from "../firebase/Firebase";

export interface IDateRangeWithResponse {
  range: DateRange;
  responses: { [key: string]: string };
};

export class Adventure {

  key: string;
  title: string = '';
  description: string = '';
  creator: string = '';
  members: { [key: string]: string } = {};
  location: any = '';
  dateRanges: IDateRangeWithResponse[] = [];

  constructor(src?: {
    key?: string,
    title?: string,
    description?: string,
    creator: string,
    members?: { [key: number]: string },
    location?: any,
    dateRanges?: any[]
  }) {
    if (src) {
      for (const key in src) {
        if (key === 'dateRanges') {
          let srcDateRanges: {responses: { [key: string]: string }, range: {start: number, end: number}}[] = src.dateRanges;
          this.dateRanges = [];

          srcDateRanges.forEach(srcDateRange => {
            let start = moment(srcDateRange.range.start * 1000);
            let end = moment(srcDateRange.range.end * 1000);
            this.dateRanges.push({
              responses: srcDateRange.responses ? srcDateRange.responses : {},
              range: new DateRange(start, end)
            });
          });
        } else {
          this[key] = src[key];
        }
      }
    }
  }

  get asJSON(): any {
    let result: any = Object.assign({}, this);
    delete result.key;
    let dateRanges = [];
    this.dateRanges.forEach(dateRange => {
      dateRanges.push({
        range: {
          start: dateRange.range.start.unix(),
          end: dateRange.range.end.unix()
        },
        responses: dateRange.responses
      });
    });
    result.dateRanges = dateRanges;
    return result;
  }

  update(): Promise<any> {
    let updateAdventure = this.asJSON;

    return firebaseApp.database().ref('adventures/' + this.key)
      .set(updateAdventure);
  }
}