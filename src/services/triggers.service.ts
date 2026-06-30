import { httpClientAxios } from "@/http/api";
import type {
  ICreateTriggers,
  ITriggers,
  ITriggersFilters,
  ITriggersListResponse,
  IUpdateTriggers,
} from "@/types/ITriggers.type";

export class TriggersService {
  static async getAll(
    filters?: ITriggersFilters,
  ): Promise<ITriggersListResponse> {
    const { data } = await httpClientAxios.get<ITriggersListResponse>(
      `/whatsapp/message-dispatch-configs`,
      { params: filters },
    );
    return data;
  }

  static async getById(id: number): Promise<ITriggers> {
    const { data } = await httpClientAxios.get<ITriggers>(
      `/whatsapp/message-dispatch-configs/${id}`,
    );
    return data;
  }

  static async create(entity: ICreateTriggers): Promise<ITriggers> {
    const { data } = await httpClientAxios.post<ITriggers>(
      `/whatsapp/message-dispatch-configs`,
      entity,
    );
    return data;
  }

  static async update(entity: IUpdateTriggers): Promise<void> {
    const { id, ...body } = entity;
    await httpClientAxios.patch(
      `/whatsapp/message-dispatch-configs/${id}`,
      body,
    );
  }

  static async deleteById(id: number): Promise<void> {
    await httpClientAxios.delete(`/whatsapp/message-dispatch-configs/${id}`);
  }
}
