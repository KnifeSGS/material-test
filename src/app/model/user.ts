export class User {
  id: number = 0;
  first_name: string = '';
  last_name: string = '';
  gender: string = '';
  email: string = '';
  address: string = '';
  onBoarding?: Date = new Date();
  salary?: number = 0;
  active?: boolean = false;
}
