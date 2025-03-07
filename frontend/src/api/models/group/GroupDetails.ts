import UserViewModel from "../user/UserViewModel";

export interface GroupDetails {
  id: number;
  name: string;
  description: string;
  users: UserViewModel[];
}
