/**
 * Copyright 2018-2020 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */




import { PkStroageUser, MsOverride } from "@symlinkde/eco-os-pk-models";
import { userContainer, USER_TYPES } from "@symlinkde/eco-os-pk-storage-user";
import { CustomRestError, apiResponseCodes } from "@symlinkde/eco-os-pk-api";

export class TokenController {
  private userService: PkStroageUser.IUserService;

  public constructor() {
    this.userService = userContainer.get<PkStroageUser.IUserService>(USER_TYPES.IUserService);
  }

  public async validateForgotPasswordId(req: MsOverride.IRequest): Promise<void> {
    const user = await this.userService.loadUserByForgotPasswordId(req.params.id);
    if (user === undefined || user === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C845.code,
          message: apiResponseCodes.C845.message,
        },
        400,
      );
    }
    return;
  }

  public async validateActivationId(req: MsOverride.IRequest): Promise<void> {
    const user = await this.userService.loadUserByActivationId(req.params.id);
    if (user === undefined || user === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C845.code,
          message: apiResponseCodes.C845.message,
        },
        400,
      );
    }
    return;
  }

  public async validateDelteId(req: MsOverride.IRequest): Promise<void> {
    const user = await this.userService.loadUserByDeleteId(req.params.id);
    if (user === undefined || user === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C845.code,
          message: apiResponseCodes.C845.message,
        },
        400,
      );
    }
    return;
  }
}
