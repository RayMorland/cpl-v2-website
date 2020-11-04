import { CplEvent } from "./event.model";

export class League {
  _id: string;
  creationDate: Date;
  lastEditDate: Date;
  description: string;
  phone: string;
  email: string;
  genders: [
    {
      name: string;
      weightClasses: [
        {
          name: string;
          weightRange: {
            min: number;
            max: number;
          };
        }
      ];
    }
  ];
  divisions: [
    {
      name: string;
      ageClasses: [
        {
          min: number;
          max: number;
        }
      ];
    }
  ];
  tests: [
    {
      type: string;
      price: number;
    }
  ];
  categories: string[];
  events: CplEvent[];
  movements: string[];
  recordCertificate: {
    price: number;
  };
  officials: {
    type: string;
    name: string;
  }[];

  constructor(data?) {
    data = data || {};
    this._id = data._id || "";
    this.creationDate = data.creationDate || new Date();
    this.lastEditDate = data.lastEditDate || new Date();
    this.description = data.description || 'description of league';
    this.phone = data.phone || "";
    this.email = data.email || "";
    this.genders = data.genders || [
      {
        name: "male",
        weightClasses: [
          { name: "heavy weight", weightRange: { min: 90, max: 1000 } },
        ],
      },
      {
        name: "female",
        weightClasses: [
          { name: "light weight", weightRange: { min: 90, max: 1000 } },
        ],
      },
    ];
    this.divisions = data.divisions || [
      {
        name: "Junior",
        ageClasses: [
          { min: 13, max: 15 },
          { min: 16, max: 17 },
          { min: 17, max: 18 },
          { min: 19, max: 20 },
        ],
      },
      { name: "Open", ageClasses: [{ min: 13, max: 100 }] },
      { name: "Submaster", ageClasses: [{ min: 30, max: 35 }] },
      { name: "Master", ageClasses: [{ min: 36, max: 100 }] },
    ];
    this.tests = data.drugTests || [{ type: "Tested", price: 100 }];
    this.categories = data.categories || ["multi-ply", "single-ply"];
    this.events = data.events || [
      {
        type: "full power",
        price: 120,
        movements: ["bench", "squat", "deadlift"],
      },
      {
        type: "bench",
        price: 120,
        movements: ["bench"],
      },
      {
        type: "deadlift",
        price: 120,
        movements: ["deadlift"],
      },
    ];
    this.movements = data.movements || ["bench", "squat", "deadlift"];
    this.recordCertificate = data.recordCertificate || {
      purchased: false,
      price: 0,
    };
    this.officials = data.officials || [{
      type: 'National Referee',
      name: 'Ramyond'
    }];
  }
}
