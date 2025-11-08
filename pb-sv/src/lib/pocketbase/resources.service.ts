import { pb } from '$lib';
import {
    Collections,
    type RecordIdString,
    type ResourcesRecord,
    type ResourcesResponse
} from '$lib/types/pocketbase-types';

export type ResourceResponse = ResourcesResponse<unknown>;
export type ResourceCreateInput = Omit<ResourcesRecord, 'id' | 'created' | 'updated'>;
export type ResourceUpdateInput = Partial<Omit<ResourcesRecord, 'id' | 'created' | 'updated'>>;

export const resourcesService = {
    get: async (id: RecordIdString) => {
        return pb.collection(Collections.Resources).getOne<ResourceResponse>(id);
    },
    getMany: async (ids: RecordIdString[]) => {
        return Promise.all(ids.map((id) => resourcesService.get(id)));
    },
    create: async (data: ResourceCreateInput) => {
        return pb.collection(Collections.Resources).create<ResourceResponse>(data);
    },
    update: async (id: RecordIdString, data: ResourceUpdateInput) => {
        return pb.collection(Collections.Resources).update<ResourceResponse>(id, data);
    },
    remove: async (id: RecordIdString) => {
        await pb.collection(Collections.Resources).delete(id);
    }
};
