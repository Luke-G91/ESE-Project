import { UserViewModel } from "../../api/models/user/UserViewModel.ts";

declare global {
  declare namespace Express {
    interface Request {
      user: UserViewModel | null;
    }
  }
}
