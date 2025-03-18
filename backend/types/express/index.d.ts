import { UserViewModel } from "../../api/models/user/UserViewModel.ts";

// Adds the user type to express requests
declare global {
  declare namespace Express {
    interface Request {
      user: UserViewModel | null;
    }
  }
}
