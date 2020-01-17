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
import { Application, Request, Response, NextFunction } from "express";
import { PkApi, MsUser } from "@symlinkde/eco-os-pk-models";
import { ImportControler } from "../controllers/ImportController";

@injectValidatorService
export class ImportRoute extends AbstractRoutes implements PkApi.IRoute {
  private importController: ImportControler;
  private validatorService!: PkApi.IValidator;
  private postCSVPattern: PkApi.IValidatorPattern = {
    file: "",
  };

  constructor(app: Application) {
    super(app);
    this.importController = new ImportControler();
    this.activate();
  }

  public activate(): void {
    this.import();
  }

  private import(): void {
    this.getApp()
      .route("/import")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postCSVPattern);
        this.importController
          .importUsersFromCSV(<MsUser.IImportRequest>req.body)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
