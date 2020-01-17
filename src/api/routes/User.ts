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
import { Application, Response, NextFunction } from "express";
import { UserController } from "../controllers/UserController";
import { PkApi, MsUser, MsOverride } from "@symlinkde/eco-os-pk-models";

@injectValidatorService
export class UserRoute extends AbstractRoutes implements PkApi.IRoute {
  private userController: UserController;
  private validatorService!: PkApi.IValidator;

  private postAccountPattern: PkApi.IValidatorPattern = {
    email: "",
  };

  private postDeletePattern: PkApi.IValidatorPattern = {
    email: "",
  };

  constructor(app: Application) {
    super(app);
    this.userController = new UserController();
    this.activate();
  }

  public activate(): void {
    this.createAccount();
    this.updateAccount();
    this.getAccount();
    this.deleteAccount();
    this.updateUserForAccountDelete();
    this.deleteAccountWithDeleteId();
    this.getAllAccounts();
    this.getUserByEmail();
    this.seachUsers();
    this.getLicensedUsers();
  }

  private createAccount(): void {
    this.getApp()
      .route("/account")
      .post((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postAccountPattern);
        const user: MsUser.ICreateUserModel = req.body;
        this.userController
          .createUser(user)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private updateAccount(): void {
    this.getApp()
      .route("/account/:id")
      .put((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.userController
          .updateUserById(req.params.id, req.body as MsUser.IUpdateUserModel)
          .then((updatedUser) => {
            res.send(updatedUser);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getAccount(): void {
    this.getApp()
      .route("/account/:id")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.userController
          .loadUserById(req.params.id)
          .then((user) => {
            res.send(user);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deleteAccount(): void {
    this.getApp()
      .route("/account/:id")
      .delete((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.userController
          .deleteUserById(req.params.id)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private updateUserForAccountDelete(): void {
    this.getApp()
      .route("/account/queue")
      .post((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postDeletePattern);
        this.userController
          .updateUserForAccountDelete(req.body.email)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deleteAccountWithDeleteId(): void {
    this.getApp()
      .route("/account/queue/:id")
      .delete((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.userController
          .deleteUserByDeleteId(req.params.id)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getAllAccounts(): void {
    this.getApp()
      .route("/account")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.userController
          .loadAllUsers()
          .then((users) => {
            res.send(users);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getUserByEmail(): void {
    this.getApp()
      .route("/account/email/:email")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.userController
          .loadUserByEmail(req.params.email)
          .then((user) => {
            res.send(user);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private seachUsers(): void {
    this.getApp()
      .route("/account/search/:query")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.userController
          .searchUsers(req.params.query)
          .then((users) => {
            res.send(users);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getLicensedUsers(): void {
    this.getApp()
      .route("/account/licensed/count")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.userController
          .getLicensedUserCount()
          .then((count) => {
            res.send({
              count,
            });
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
