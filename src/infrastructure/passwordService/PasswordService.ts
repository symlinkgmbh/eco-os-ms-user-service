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

import { IPasswordService } from "./IPasswordService";
import { PkCore } from "@symlinkde/eco-os-pk-models";
import { MsConf } from "@symlinkde/eco-os-pk-models";
import { serviceContainer, ECO_OS_PK_CORE_TYPES } from "@symlinkde/eco-os-pk-core";
import { SaticOneTimePasswordService, CryptionService } from "@symlinkde/eco-os-pk-crypt";
import { PasswordGenerator } from "@symlinkde/eco-os-pk-crypt";
import { injectable } from "inversify";

@injectable()
export class PasswordService implements IPasswordService {
  private configClient: PkCore.IEcoConfigClient;
  private saltRounds: number = 8;
  private cryptionService: CryptionService;

  constructor() {
    this.configClient = serviceContainer.get<PkCore.IEcoConfigClient>(ECO_OS_PK_CORE_TYPES.IEcoConfigClient);
    this.cryptionService = new CryptionService(this.saltRounds);
  }

  public getOtp(): string {
    return SaticOneTimePasswordService.generateToken(SaticOneTimePasswordService.generateSecret(), 0);
  }

  public comparePassword(password: string, confirmPassword: string): boolean {
    if (password !== confirmPassword) {
      return false;
    }

    return true;
  }

  public async encryptPassword(password: string): Promise<string> {
    return await this.cryptionService.hash(password);
  }

  public async checkPasswordPolicy(password: string): Promise<boolean> {
    const loadConf = await this.configClient.get("policies");
    const passwordPolicy: MsConf.IPoliciesConfig = <MsConf.IPoliciesConfig>Object(loadConf.data.policies);
    const regEx = RegExp(passwordPolicy.password);
    return regEx.test(password);
  }

  public async generatePassword(): Promise<string> {
    return await PasswordGenerator.generatePassword();
  }
}
