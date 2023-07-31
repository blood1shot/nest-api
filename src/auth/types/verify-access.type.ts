import { ApiProperty } from '@nestjs/swagger';

export class VerifyAccess {
  @ApiProperty()
  message: string;
}
