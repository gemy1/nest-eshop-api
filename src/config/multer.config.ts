import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';

export const multerConfig = {
  storage: diskStorage({
    destination: './assets/images',
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  limits: { fileSize: 5000000 },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new BadRequestException('Invalid file format'), false);
    }
    cb(null, true);
  },
};
