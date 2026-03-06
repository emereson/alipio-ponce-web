export type Login = {
  correo: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  lastName: string;
  studentImg: string;
  country: string;
  startDate: string;
  endDate: string;
  password: string;
  newPassword: string;
  role: string;
  status: string;
};

export interface DataFilterUser {
  search: string;
  status: string;
}
