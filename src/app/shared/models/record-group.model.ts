export class RecordGroup {
  level: string;
  gender: string;
  test: string;
  division: any;
  ageClasses: [
    {
      ageClass: {min: number, max: number};
      weightClasses: [
        {
          weightClass: {
            name: string;
            weightRange: { min: number; max: number };
          };
          records: any[];
        }
      ];
    }
  ];
  category: string;
  recordType: string;

  constructor(data?) {
    this.level = data.level || null;
    this.gender = data.gender || null;
    this.test = data.test || null;
    this.division = data.division || null;
    this.ageClasses = data.ageClasses || null;
    this.category = data.category || null;
    this.recordType = data.recordType || null;
  }
}
