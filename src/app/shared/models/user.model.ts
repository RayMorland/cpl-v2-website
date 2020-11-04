export class User {
  _id: string;
  creationDate: Date;
  lastEditDate: Date;
  status: string;
  email: string;
  name: string;
  userType: string;
  cognitoId: string;
  typeId: string;
  userProperties: {};
  notifications: {};
  permissions: string[];

  constructor(data?) {
      this._id = data._id || null;
      this.creationDate = data.creationDate || null;
      this.lastEditDate = data.lastEditDate || null;
      this.status = data.status || null;
      this.email = data.email || null;
      this.name = data.name || null;
      this.userType = data.userType || null;
      this.cognitoId = data.cognitoId || null;
      this.typeId = data.typeId || null;
      this.userProperties = data.userProperties || null;
      this.notifications = data.notifications || null;
      this.permissions = data.permissions || null;
  }
}
