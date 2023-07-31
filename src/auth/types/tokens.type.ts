// export type Tokens = {
//   access_token: string;
//   refresh_token: string;
// };
import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
