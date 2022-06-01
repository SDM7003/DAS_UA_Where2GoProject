export interface EventCard{
  id?:number;
  name:string;
  loc:string;
  price:number;
  category:number
  date:boolean;
  avatar:string;
  description:string;
  link:string;
  city_id:number;
}
export interface City{
  id?:number,
  name:string,
  lat:string,
  lon:string
}
export interface Category{
  id?:number;
  name:string;
}
export interface User{
  id?:number;
  name?:string;
  email:string;
  password:string;
  phone?:string;
  date_birth?:string;
  type?:number;
  places?:number;
  avatar?:string;
}
