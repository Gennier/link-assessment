import { Elysia } from "elysia";
import { ListMachineDto, type IListMachine } from "./machines.interfaces";
import { MachineService } from "./machines.services";
import { authenticateMiddleware } from "../../commons/middlewares/auth.middlewares";

const machineService = new MachineService();

export const machineRoutes = new Elysia({ prefix: "/machines" })
  .derive(async (context) => {
    return await authenticateMiddleware(context);
  })
  .get(
    "/",
    ({ query }: { query: IListMachine }) => machineService.findAll(query),
    {
      query: ListMachineDto,
    }
  );
