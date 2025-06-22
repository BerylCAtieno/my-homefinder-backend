import multer from "multer";
import { storage } from "../config/cloudinary.config";
import { Request, Response, NextFunction } from "express";

export const uploadMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const upload = multer({ storage }).single("doc");

  upload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading file", error: err });
    }
    next();
  });
};

export const uploadMultipleMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const upload = multer({ storage }).array("docs", 10); // Limit to 10 files

  upload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading file", error: err });
    }
    next();
  });
};
