import multer from "multer";
import { storage } from "../config/cloudinary.config";
import { Request, Response, NextFunction } from "express";

// Helper to inject folder and format into req for CloudinaryStorage
function setCloudinaryParams(req: Request, folder?: string, format?: string) {
  if (folder) req.cloudinaryFolder = folder;
  if (format) req.cloudinaryFormat = format;
}

export const uploadMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  setCloudinaryParams(req, req.query.folder as string, req.query.format as string);

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
  setCloudinaryParams(req, req.query.folder as string, req.query.format as string);

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

// Add types to Request for TS
declare global {
  namespace Express {
    interface Request {
      cloudinaryFolder?: string;
      cloudinaryFormat?: string;
    }
  }
}
