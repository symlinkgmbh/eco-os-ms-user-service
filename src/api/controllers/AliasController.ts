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




import { MsUser, PkStroageUser, MsOverride } from "@symlinkde/eco-os-pk-models";
import { StaticMailValidator } from "../../infrastructure/util/StaticMailValidator";
import { CustomRestError, apiResponseCodes } from "@symlinkde/eco-os-pk-api";
import { USER_TYPES, userContainer } from "@symlinkde/eco-os-pk-storage-user";

export class AliasController {
  private userService: PkStroageUser.IUserService = userContainer.get<PkStroageUser.IUserService>(
    USER_TYPES.IUserService,
  );

  public async addAlias(req: MsOverride.IRequest): Promise<MsUser.IUser> {
    const { alias, id } = req.body;

    if (!StaticMailValidator.isValid(alias)) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C806.code,
          message: apiResponseCodes.C806.message,
        },
        400,
      );
    }

    const result = await this.userService.addAliasToUser(id, alias);

    if (result === undefined || result === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C862.code,
          message: apiResponseCodes.C862.message,
        },
        400,
      );
    }

    return result;
  }

  public async loadUserByAlias(req: MsOverride.IRequest): Promise<MsUser.IUser> {
    const loadUser = await this.userService.loadUserByAlias(req.params.alias);
    if (loadUser === undefined || loadUser === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C863.code,
          message: apiResponseCodes.C863.message,
        },
        400,
      );
    }
    return loadUser;
  }

  public async removeAlias(req: MsOverride.IRequest): Promise<MsUser.IUser> {
    const { alias, id } = req.body;

    const result = await this.userService.removeAliasFromUser(id, alias);

    if (result === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C864.code,
          message: apiResponseCodes.C864.message,
        },
        400,
      );
    }

    return result;
  }
}
