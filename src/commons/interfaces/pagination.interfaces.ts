import { t } from "elysia";

export interface IPagination<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface IPaginationQuery {
  perPage: number;
  page: number;
}

export const PaginationQuerySchema = t.Object({
  perPage: t.Optional(t.Number({ default: 10 })),
  page: t.Optional(t.Number({ default: 1 })),
});
