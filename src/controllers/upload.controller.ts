import { NextFunction, Request, Response } from "express";

export class UploadController{
  public uploadDoc = async(req: Request, res: Response, next: NextFunction){
    try {
    
  }catch(error){
  next(error);
}
  }

}
