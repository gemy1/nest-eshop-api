import { SetMetadata } from '@nestjs/common';

export const OwnershipCheck = () => {
  return SetMetadata('ownershipCheck', true);
};
