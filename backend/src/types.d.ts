import { Request } from "express";

interface User{
    id:string;
    name:string;
    email:string;
    password?:string;
    createdAt?:string;
}


declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}
