import { UserViewModel } from "../user/UserViewModel.js";

export interface GroupDetails {
  id: number;
  name: string;
  description: string;
  users: UserViewModel[];
}
