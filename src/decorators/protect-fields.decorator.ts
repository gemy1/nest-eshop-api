import { UseGuards } from '@nestjs/common';
import { ProtectFieldsGuard } from '../guards/protect-fields.guard';

export const ProtectFields = (fields: string[]) => {
  return UseGuards(new ProtectFieldsGuard(fields));
};
