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
import { Application, Response, NextFunction } from "express";
import { AliasController } from "../controllers/AliasController";
import { PkApi, MsOverride } from "@symlinkde/eco-os-pk-models";

@injectValidatorService
export class AliasRoute extends AbstractRoutes implements PkApi.IRoute {
  private aliasController: AliasController;
  private validatorService!: PkApi.IValidator;

  private postAliasPattern: PkApi.IValidatorPattern = {
    alias: "",
    id: "",
  };

  private deleteAliasPattern: PkApi.IValidatorPattern = {
    alias: "",
    id: "",
  };

  constructor(app: Application) {
    super(app);
    this.aliasController = new AliasController();
    this.activate();
  }

  public activate(): void {
    this.addAlias();
    this.loadUserByAlias();
    this.removeAlias();
  }

  private addAlias(): void {
    this.getApp()
      .route("/alias")
      .post((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postAliasPattern);
        this.aliasController
          .addAlias(req)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private loadUserByAlias(): void {
    this.getApp()
      .route("/alias/:alias")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.aliasController
          .loadUserByAlias(req)
          .then((user) => {
            res.send(user);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private removeAlias(): void {
    this.getApp()
      .route("/alias")
      .delete((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.deleteAliasPattern);
        this.aliasController
          .removeAlias(req)
          .then((updatedUser) => {
            res.send(updatedUser);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
