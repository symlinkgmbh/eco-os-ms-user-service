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




import { AbstractRoutes, injectValidatorService } from "@symlinkde/eco-os-pk-api";
import { PkApi, MsOverride } from "@symlinkde/eco-os-pk-models";
import { Application, Response, NextFunction } from "express";
import { ActivationController } from "../controllers/ActivationController";

@injectValidatorService
export class ActivationRoute extends AbstractRoutes implements PkApi.IRoute {
  private activationController: ActivationController;
  private validatorService!: PkApi.IValidator;
  private postActivationPattern: PkApi.IValidatorPattern = {
    activationId: "",
    password: "",
    confirmPassword: "",
  };

  constructor(app: Application) {
    super(app);
    this.activationController = new ActivationController();
    this.activate();
  }

  public activate(): void {
    this.loadUserByActivationId();
    this.deactivateAccount();
    this.activateAccount();
  }

  private loadUserByActivationId(): void {
    this.getApp()
      .route("/account/activation/:id")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.activationController
          .loadUserByActivationId(req.params.id)
          .then((user) => {
            res.send(user);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private activateAccount(): void {
    this.getApp()
      .route("/account/activation/activate")
      .post((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postActivationPattern);
        this.activationController
          .activateUser(req)
          .then((user) => {
            res.send(user);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deactivateAccount(): void {
    this.getApp()
      .route("/account/activation/deactivate/:id")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.activationController
          .deactiveUser(req.params.id)
          .then((user) => {
            res.send(user);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
