import { SetMetadata } from '@nestjs/common';

export const SetModuleName = (moduleName: string) =>
  SetMetadata('moduleName', moduleName);

export const SetPermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
