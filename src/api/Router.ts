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



import { Application } from "express";
import { PkApi } from "@symlinkde/eco-os-pk-models";
import {
  Heartbeat,
  UserRoute,
  PasswordRoute,
  ImportRoute,
  ActivationRoute,
  MetricsRoute,
  LicenseBeat,
  KeyRoute,
} from "./routes";
import { TokenRoute } from "./routes/Token";

export class Router implements PkApi.IRouter {
  protected heartbeat: Heartbeat | undefined;
  protected licenseBeat: LicenseBeat | undefined;
  protected userRoute: UserRoute | undefined;
  protected passwordRoute: PasswordRoute | undefined;
  protected importRoute: ImportRoute | undefined;
  protected activationRoute: ActivationRoute | undefined;
  protected metrics: MetricsRoute | undefined;
  protected tokenRoute: TokenRoute | undefined;
  protected keyRoute: KeyRoute | undefined;

  private app: Application;

  constructor(_app: Application) {
    this.app = _app;
  }

  public initRoutes(): void {
    this.heartbeat = new Heartbeat(this.app);
    this.userRoute = new UserRoute(this.app);
    this.passwordRoute = new PasswordRoute(this.app);
    this.importRoute = new ImportRoute(this.app);
    this.activationRoute = new ActivationRoute(this.app);
    this.metrics = new MetricsRoute(this.app);
    this.licenseBeat = new LicenseBeat(this.app);
    this.tokenRoute = new TokenRoute(this.app);
    this.keyRoute = new KeyRoute(this.app);
    return;
  }
}
