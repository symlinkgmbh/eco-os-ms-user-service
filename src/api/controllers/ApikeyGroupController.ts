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



import { MsOverride, MsUser } from "@symlinkde/eco-os-pk-models";

export class ApikeyGroupController {
  public async createApikeyGroup(req: MsOverride.IRequest): Promise<MsUser.IApikeyGroup | null> {
    return null;
  }

  public async addMember(req: MsOverride.IRequest): Promise<MsUser.IApikeyGroup | null> {
    return null;
  }

  public async addDomain(req: MsOverride.IRequest): Promise<MsUser.IApikeyGroup | null> {
    return null;
  }

  public async getGroupById(req: MsOverride.IRequest): Promise<MsUser.IApikeyGroup | null> {
    return null;
  }

  public async getAllGroups(): Promise<Array<MsUser.IApikeyGroup> | null> {
    return null;
  }

  public async loadGroupByApikey(req: MsOverride.IRequest): Promise<MsUser.IApikeyGroup | null> {
    return null;
  }

  public async removeMember(req: MsOverride.IRequest): Promise<MsUser.IApikeyGroup | null> {
    return null;
  }

  public async removeDomain(req: MsOverride.IRequest): Promise<MsUser.IApikeyGroup | null> {
    return null;
  }

  public async removeGroup(req: MsOverride.IRequest): Promise<boolean | null> {
    return null;
  }
}
