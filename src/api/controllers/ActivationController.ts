/**
 * Copyright 2018-2019 Symlink GmbH
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



import { USER_TYPES, User, userContainer } from "@symlinkde/eco-os-pk-storage-user";
import { CustomRestError, apiResponseCodes } from "@symlinkde/eco-os-pk-api";
import { MsUser, PkStroageUser } from "@symlinkde/eco-os-pk-models";
import { IPasswordService, PASSWORD_TYPES, passwordContainer } from "../../infrastructure/passwordService";
import { Request } from "express";
import { StaticShaService } from "@symlinkde/eco-os-pk-crypt";

export class ActivationController {
  private userService: PkStroageUser.IUserService;

  private passwordService: IPasswordService;

  public constructor() {
    this.userService = userContainer.get<PkStroageUser.IUserService>(USER_TYPES.IUserService);
    this.passwordService = passwordContainer.get<IPasswordService>(PASSWORD_TYPES.IPasswordService);
  }

  public async loadUserByActivationId(activationId: string): Promise<MsUser.IUser> {
    const user = await this.userService.loadUserByActivationId(activationId);
    if (user === undefined || user === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C838.code,
          message: apiResponseCodes.C838.message + activationId,
        },
        404,
      );
    }
    return user;
  }

  public async deactiveUser(activationId: string): Promise<MsUser.IUser> {
    const user = await this.userService.loadUserByActivationId(activationId);
    if (user === null || user._id === undefined) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C839.code,
          message: apiResponseCodes.C839.message + activationId,
        },
        404,
      );
    }

    const deactivate = await this.userService.updateUserById(user._id, <MsUser.IUpdateUserActiveState>{
      isActive: false,
    });

    if (!deactivate) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C807.code,
          message: apiResponseCodes.C807.message,
        },
        400,
      );
    }

    const deactivatedUser = await this.userService.loadUserByActivationId(activationId);

    if (deactivatedUser === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C838.code,
          message: apiResponseCodes.C838.message + activationId,
        },
        404,
      );
    }

    return deactivatedUser;
  }

  public async activateUser(req: Request): Promise<MsUser.IUser> {
    const { activationId, password, confirmPassword } = req.body;

    if (!this.passwordService.comparePassword(password, confirmPassword)) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C804.code,
          message: apiResponseCodes.C804.message,
        },
        400,
      );
    }

    const user = await this.userService.loadUserByActivationId(activationId);

    if (user === undefined || user === null) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C815.code,
          message: apiResponseCodes.C815.message,
        },
        404,
      );
    }

    if (user._id === undefined) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C815.code,
          message: apiResponseCodes.C815.message,
        },
        404,
      );
    }

    if (!(await this.passwordService.checkPasswordPolicy(password))) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C805.code,
          message: apiResponseCodes.C805.message,
        },
        400,
      );
    }

    const encryptedPassword = await this.passwordService.encryptPassword(password);

    const convUser: MsUser.IUser = {
      email: user.email,
      password: encryptedPassword,
      lastPasswordHash: StaticShaService.getSha3(password),
      acl: {
        role: MsUser.UserRoles.user,
      },
      isActive: true,
      activationId: "",
      deleteId: "",
      loginErrorCounter: user.loginErrorCounter,
    };
    const response = await this.userService.updateUserById(user._id, convUser);

    if (!response) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C840.code,
          message: apiResponseCodes.C840.message + activationId,
        },
        400,
      );
    }

    return new User(convUser);
  }
}
