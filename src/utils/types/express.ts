import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
        id: string;
        name: string;
        email: string;
        emailVerified?: Date;
        image?: string;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    }

    interface Request {
      user?: User;
    }
  }
}