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




import { USER_TYPES, userContainer } from "@symlinkde/eco-os-pk-storage-user";
import { MsUser, PkStroageUser } from "@symlinkde/eco-os-pk-models";
import { CustomRestError, apiResponseCodes } from "@symlinkde/eco-os-pk-api";
import { IPasswordService, PASSWORD_TYPES, passwordContainer } from "../../infrastructure/passwordService";
import { StaticUUIDService, StaticShaService } from "@symlinkde/eco-os-pk-crypt";

export class PasswordController {
  private userService: PkStroageUser.IUserService = userContainer.get<PkStroageUser.IUserService>(
    USER_TYPES.IUserService,
  );
  private passwordService: IPasswordService = passwordContainer.get<IPasswordService>(PASSWORD_TYPES.IPasswordService);

  public async handleForgotPasswordRequest(
    obj: MsUser.IForgotPasswordRequest,
  ): Promise<MsUser.IForgotPasswordResponse> {
    const users: Array<MsUser.IUser> | null = await this.userService.loadUserByEmail(obj.email);
    if (users === null || users.length < 1) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C815.code,
          message: apiResponseCodes.C815.message,
        },
        404,
      );
    }

    const otp = this.passwordService.getOtp();
    const forgotPasswordId = StaticUUIDService.generateUUID();
    const user: MsUser.IUser = users[0];

    if (user._id === undefined) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C840.code,
          message: apiResponseCodes.C840.message,
        },
        400,
      );
    }

    const updateUserResult = await this.userService.updateUserById(user._id, <MsUser.IUpdateUserModel>{
      forgotPasswordId,
      otp,
    });
    if (!updateUserResult) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C840.code,
          message: apiResponseCodes.C840.message,
        },
        400,
      );
    }
    return {
      otp,
      forgotPasswordId,
    };
  }

  public async handleSetNewPasswordRequest(obj: MsUser.IForgotPasswordUpdateRequest): Promise<boolean> {
    if (!(await this.passwordService.checkPasswordPolicy(obj.password))) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C805.code,
          message: apiResponseCodes.C805.message,
        },
        400,
      );
    }

    if (!this.passwordService.comparePassword(obj.password, obj.confirmPassword)) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C804.code,
          message: apiResponseCodes.C804.message,
        },
        400,
      );
    }

    const user = await this.userService.loadUserByForgotPasswordId(obj.forgotPasswordId);
    const encryptedPassword = await this.passwordService.encryptPassword(obj.password);

    if (!user || user._id === undefined) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C815.code,
          message: apiResponseCodes.C815.message,
        },
        404,
      );
    }

    if (obj.otp !== user.otp) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C814.code,
          message: apiResponseCodes.C814.message,
        },
        400,
      );
    }

    if (user.lastPasswordHash === StaticShaService.getSha3(obj.password)) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C834.code,
          message: apiResponseCodes.C834.message,
        },
        400,
      );
    }

    const updateResult = await this.userService.updateUserById(user._id, <MsUser.IUpdateUserPassword>{
      password: encryptedPassword,
      forgotPasswordId: "",
      otp: null,
    });

    return updateResult;
  }
}
