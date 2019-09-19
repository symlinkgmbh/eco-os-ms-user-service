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



import { AbstractRoutes, injectValidatorService } from "@symlinkde/eco-os-pk-api";
import { Application, Request, Response, NextFunction } from "express";
import { PasswordController } from "../controllers/PasswordController";
import { PkApi, MsUser } from "@symlinkde/eco-os-pk-models";

@injectValidatorService
export class PasswordRoute extends AbstractRoutes implements PkApi.IRoute {
  private passwordController: PasswordController;
  private validatorService!: PkApi.IValidator;

  private postForgotPasswordPattern: PkApi.IValidatorPattern = {
    email: "",
  };

  private postUpdatePasswordPattern: PkApi.IValidatorPattern = {
    otp: "",
    forgotPasswordId: "",
    password: "",
    confirmPassword: "",
  };

  constructor(app: Application) {
    super(app);
    this.passwordController = new PasswordController();
    this.activate();
  }

  public activate(): void {
    this.forgotPassword();
    this.changePassword();
  }

  private forgotPassword(): void {
    this.getApp()
      .route("/password/forgot")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postForgotPasswordPattern);
        const forgotRequest: MsUser.IForgotPasswordRequest = req.body;
        this.passwordController
          .handleForgotPasswordRequest(forgotRequest)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private changePassword(): void {
    this.getApp()
      .route("/password/update")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postUpdatePasswordPattern);
        const updatePasswordRequest: MsUser.IForgotPasswordUpdateRequest = req.body;
        this.passwordController
          .handleSetNewPasswordRequest(updatePasswordRequest)
          .then((data) => {
            if (!data) {
              res.sendStatus(400);
            }
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
