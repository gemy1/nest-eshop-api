import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

export const multerConfig = {
  storage: diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      const dist = `assets/images/${day}-${month}-${year}`;

      fs.mkdirSync(dist, { recursive: true });

      cb(null, dist);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.split(' ').join('-');
      cb(null, Date.now() + '-' + fileName);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new BadRequestException('Invalid file format'), false);
    }
    cb(null, true);
  },
};
