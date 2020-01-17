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




import { MsUser, PkStroageUser } from "@symlinkde/eco-os-pk-models";
import { StaticMailValidator } from "../../infrastructure/util/StaticMailValidator";
import { RestError, CustomRestError, apiResponseCodes } from "@symlinkde/eco-os-pk-api";
import { USER_TYPES, userContainer } from "@symlinkde/eco-os-pk-storage-user";
import { StaticUUIDService, StaticShaService } from "@symlinkde/eco-os-pk-crypt";
import { IPasswordService, PASSWORD_TYPES, passwordContainer } from "../../infrastructure/passwordService";

export class UserController {
  private userService: PkStroageUser.IUserService = userContainer.get<PkStroageUser.IUserService>(
    USER_TYPES.IUserService,
  );
  private passwordService: IPasswordService = passwordContainer.get<IPasswordService>(PASSWORD_TYPES.IPasswordService);

  // tslint:disable-next-line:cyclomatic-complexity
  public async createUser(
    user: MsUser.ICreateUserModel,
    validateEmail?: boolean,
    isAdmin?: boolean,
    shouldSetToActive?: boolean,
    injectPassword?: string,
  ): Promise<MsUser.IUser | RestError> {
    if (!validateEmail) {
      if (!StaticMailValidator.isValid(user.email)) {
        throw new CustomRestError(
          {
            code: apiResponseCodes.C806.code,
            message: apiResponseCodes.C806.message,
          },
          400,
        );
      }
    }

    const loadUser = await this.userService.loadUserByEmail(user.email);
    if (loadUser !== null && loadUser.length > 0) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C803.code,
          message: apiResponseCodes.C803.message,
        },
        400,
      );
    }

    let password = "";
    let lastPasswordHash = "";
    if (isAdmin === true && injectPassword !== undefined) {
      password = await this.passwordService.encryptPassword(injectPassword);
      lastPasswordHash = StaticShaService.getSha3(injectPassword);
    }

    const role: MsUser.UserRoles = isAdmin === true ? MsUser.UserRoles.admin : MsUser.UserRoles.user;
    const isActive: boolean = shouldSetToActive === true ? true : false;

    const convUser: MsUser.IUser = {
      email: user.email,
      password,
      lastPasswordHash,
      acl: {
        role,
      },
      isActive,
      activationId: StaticUUIDService.generateUUID(),
      deleteId: "",
      loginErrorCounter: 0,
      hasEulaAccepted: user.eula,
    };
    return await this.userService.createUser(convUser);
  }

  public async loadUserById(id: string): Promise<MsUser.IUser> {
    const result = await this.userService.loadUserById(id);
    if (result === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C815.code,
          message: apiResponseCodes.C815.message,
        },
        404,
      );
    }

    return result;
  }

  public async loadAllUsers(): Promise<Array<MsUser.IUser>> {
    const result = await this.userService.loadAllUsers();

    if (result === null) {
      return [];
    }

    return result;
  }

  public async deleteUserById(id: string): Promise<boolean> {
    return await this.userService.deleteUserById(id);
  }

  public async updateUserById(id: string, item: MsUser.IUpdateUserModel): Promise<boolean> {
    return await this.userService.updateUserById(id, item);
  }

  public async updateUserForAccountDelete(email: string): Promise<MsUser.IDeleteAccountResponse> {
    const user = await this.loadUserByEmail(email);

    if (!user._id) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C846.code,
          message: apiResponseCodes.C846.message,
        },
        404,
      );
    }

    const deleteId = StaticUUIDService.generateUUID();
    const update = await this.userService.updateUserById(user._id, { deleteId });
    if (!update) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C847.code,
          message: apiResponseCodes.C847.message,
        },
        400,
      );
    }
    return {
      deleteId,
    };
  }

  public async deleteUserByDeleteId(id: string): Promise<void> {
    const user = await this.userService.loadUserByDeleteId(id);

    if (user === null || user === undefined || user._id === undefined) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C815.code,
          message: apiResponseCodes.C815.message,
        },
        404,
      );
    }

    await this.deleteUserById(user._id);
  }
  public async loadUserByEmail(email: string): Promise<MsUser.IUser> {
    const result: Array<MsUser.IUser> | null = await this.userService.loadUserByEmail(email);
    if (result === null || result.length < 1) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C815.code,
          message: apiResponseCodes.C815.message,
        },
        404,
      );
    }
    // tslint:disable-next-line:no-string-literal
    return result.filter((entry) => entry["email"] === email)[0];
  }

  public async searchUsers(query: string): Promise<Array<MsUser.IUser>> {
    const result: Array<MsUser.IUser> | null = await this.userService.searchUsers(query);
    if (result === null || result.length < 1) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C815.code,
          message: apiResponseCodes.C815.message,
        },
        404,
      );
    }

    return result;
  }

  public async getLicensedUserCount(): Promise<number> {
    return await this.userService.getCountFromActivatedUsers();
  }
}
