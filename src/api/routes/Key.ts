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
import { PkApi } from "@symlinkde/eco-os-pk-models";
import { Application, Request, Response, NextFunction } from "express";
import { KeyController } from "../controllers/KeyController";

@injectValidatorService
export class KeyRoute extends AbstractRoutes implements PkApi.IRoute {
  private validatorService!: PkApi.IValidator;
  private keyController: KeyController;

  constructor(app: Application) {
    super(app);
    this.keyController = new KeyController();
    this.activate();
  }

  public activate(): void {
    this.addKeyToUser();
    this.loadUserByApiKey();
    this.removeKeyFromUser();
    this.removeAllKeysFromUser();
  }

  private addKeyToUser(): void {
    this.getApp()
      .route("/apikeys")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.keyController
          .addKeyToUser(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private loadUserByApiKey(): void {
    this.getApp()
      .route("/apikeys/:key")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.keyController
          .loadUserByApiKey(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private removeKeyFromUser(): void {
    this.getApp()
      .route("/apikeys/delete")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.keyController
          .removeKeyFromUser(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private removeAllKeysFromUser(): void {
    this.getApp()
      .route("/apikeys/delete/all/:id")
      .delete((req: Request, res: Response, next: NextFunction) => {
        this.keyController
          .removeAllKeysFromUser(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
