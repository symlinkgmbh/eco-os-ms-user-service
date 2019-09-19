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



import { CSVParser } from "@symlinkde/eco-os-pk-parse";
import { User } from "@symlinkde/eco-os-pk-storage-user";
import { MsUser } from "@symlinkde/eco-os-pk-models";
import { UserController } from "./UserController";

export class ImportControler {
  private userService: UserController;

  constructor() {
    this.userService = new UserController();
  }

  public async importUsersFromCSV(obj: MsUser.IImportRequest): Promise<Array<MsUser.IUser>> {
    const users: Array<string> = await CSVParser.parseCSVFromBase64(obj.file, true);
    const createdUsers: Array<User> = [];

    // tslint:disable-next-line:forin
    for (const index in users) {
      const user: MsUser.ICreateUserModel = {
        email: String(users[index]),
      };

      const createdUser = await this.userService.createUser(user);
      if (createdUser instanceof User) {
        createdUsers.push(createdUser);
      }
    }
    return createdUsers;
  }
}
