import { Elysia } from "elysia";
import { ListMachineDto, type IListMachine } from "./machines.interfaces";
import { MachineService } from "./machines.services";

const machineService = new MachineService();

export const machineRoutes = new Elysia({ prefix: "/machines" }).get(
  "/",
  ({ query }: { query: IListMachine }) => machineService.findAll(query),
  {
    query: ListMachineDto,
  }
);
