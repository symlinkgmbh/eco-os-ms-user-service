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
import { PkApi, MsOverride } from "@symlinkde/eco-os-pk-models";
import { Application, Response, NextFunction } from "express";
import { ApikeyGroupController } from "../controllers/ApikeyGroupController";

@injectValidatorService
export class ApikeyGroupRoute extends AbstractRoutes implements PkApi.IRoute {
  private apikeygroupController: ApikeyGroupController;

  constructor(app: Application) {
    super(app);
    this.apikeygroupController = new ApikeyGroupController();
    this.activate();
  }

  public activate(): void {
    this.createApikeyGroup();
    this.addDomain();
    this.addMember();
    this.getGroupById();
    this.getGroupByKey();
    this.getAllGroups();
    this.removeDomain();
    this.removeMember();
    this.removeGroup();
  }

  private createApikeyGroup(): void {
    this.getApp()
      .route("/keygroups")
      .post((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.apikeygroupController
          .createApikeyGroup(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private addMember(): void {
    this.getApp()
      .route("/keygroups/member")
      .post((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.apikeygroupController
          .addMember(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private addDomain(): void {
    this.getApp()
      .route("/keygroups/domain")
      .post((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.apikeygroupController
          .addDomain(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getGroupById(): void {
    this.getApp()
      .route("/keygroups/:id")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.apikeygroupController
          .getGroupById(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getAllGroups(): void {
    this.getApp()
      .route("/keygroups")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.apikeygroupController
          .getAllGroups()
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getGroupByKey(): void {
    this.getApp()
      .route("/keygroups/group/:id")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.apikeygroupController
          .getGroupById(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private removeMember(): void {
    this.getApp()
      .route("/keygroups/delete/member")
      .post((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.apikeygroupController
          .removeMember(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private removeDomain(): void {
    this.getApp()
      .route("/keygroups/delete/domain")
      .post((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.apikeygroupController
          .removeDomain(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private removeGroup(): void {
    this.getApp()
      .route("/keygroups/:id")
      .delete((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.apikeygroupController
          .removeGroup(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
