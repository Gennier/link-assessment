import prisma from "../../../prisma/prisma";
import type { IListUser } from "./users.interfaces";

export class UserService {
  async findAll(query: IListUser) {
    const { page, perPage, email } = query;

    const whereQuery = {
      ...(email && { email: { contains: email } }),
    };

    const users = await prisma.user.findMany({
      where: whereQuery,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.user.count({
      where: whereQuery,
    });

    return {
      data: users,
      metadata: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
}
