import { createContext } from 'svelte';
import {
    resourcesService,
    type ResourceCreateInput,
    type ResourceResponse,
    type ResourceUpdateInput
} from '$lib/pocketbase/resources.service';
import type { RecordIdString } from '$lib/types/pocketbase-types';

export class ResourcesStore {
    private resourceCache = $state<Record<RecordIdString, ResourceResponse>>({});
    private resourceIdsByUnit = $state<Record<RecordIdString, RecordIdString[]>>({});

    private writeResource(resource: ResourceResponse) {
        this.resourceCache = {
            ...this.resourceCache,
            [resource.id]: resource
        };
    }

    private linkResource(unitId: RecordIdString, resourceId: RecordIdString) {
        const existing = this.resourceIdsByUnit[unitId] ?? [];
        if (existing.includes(resourceId)) return;

        this.resourceIdsByUnit = {
            ...this.resourceIdsByUnit,
            [unitId]: [...existing, resourceId]
        };
    }

    private unlinkResource(unitId: RecordIdString, resourceId: RecordIdString) {
        const existing = this.resourceIdsByUnit[unitId];
        if (!existing?.length) return;

        const filtered = existing.filter((id) => id !== resourceId);
        const next = { ...this.resourceIdsByUnit };

        if (filtered.length) {
            next[unitId] = filtered;
        } else {
            delete next[unitId];
        }

        this.resourceIdsByUnit = next;

        if (!this.isResourceReferenced(resourceId)) {
            const { [resourceId]: _omit, ...rest } = this.resourceCache;
            this.resourceCache = rest;
        }
    }

    private unlinkResourceFromAll(resourceId: RecordIdString) {
        const next: Record<RecordIdString, RecordIdString[]> = {};

        for (const [unitId, ids] of Object.entries(this.resourceIdsByUnit)) {
            if (!ids.includes(resourceId)) {
                next[unitId as RecordIdString] = [...ids];
                continue;
            }

            const filtered = ids.filter((id) => id !== resourceId);
            if (filtered.length) {
                next[unitId as RecordIdString] = filtered;
            }
        }

        this.resourceIdsByUnit = next;

        if (!this.isResourceReferenced(resourceId)) {
            const { [resourceId]: _omit, ...rest } = this.resourceCache;
            this.resourceCache = rest;
        }
    }

    private isResourceReferenced(resourceId: RecordIdString) {
        return Object.values(this.resourceIdsByUnit).some((ids) => ids.includes(resourceId));
    }

    getResource(resourceId: RecordIdString) {
        return this.resourceCache[resourceId] ?? null;
    }

    getResources(unitId: RecordIdString) {
        const ids = this.resourceIdsByUnit[unitId] ?? [];
        return ids
            .map((id) => this.resourceCache[id])
            .filter((resource): resource is ResourceResponse => !!resource);
    }

    hydrate(unitId: RecordIdString, resources: ResourceResponse[] = []) {
        let nextCache = { ...this.resourceCache };

        for (const resource of resources) {
            nextCache[resource.id] = resource;
        }

        this.resourceCache = nextCache;
        this.resourceIdsByUnit = {
            ...this.resourceIdsByUnit,
            [unitId]: resources.map((resource) => resource.id)
        };

        return this.getResources(unitId);
    }

    async hydrateFromIds(unitId: RecordIdString, resourceIds: RecordIdString[]) {
        this.resourceIdsByUnit = {
            ...this.resourceIdsByUnit,
            [unitId]: [...resourceIds]
        };

        const missing = resourceIds.filter((id) => !this.resourceCache[id]);
        if (missing.length) {
            const fetched = await resourcesService.getMany(missing);

            let nextCache = { ...this.resourceCache };
            for (const resource of fetched) {
                nextCache[resource.id] = resource;
            }
            this.resourceCache = nextCache;
        }

        return this.getResources(unitId);
    }

    async fetch(resourceId: RecordIdString, unitId?: RecordIdString) {
        const record = await resourcesService.get(resourceId);
        this.writeResource(record);

        if (unitId) {
            this.linkResource(unitId, record.id);
        }

        return record;
    }

    async createResource(data: ResourceCreateInput, unitId?: RecordIdString) {
        const created = await resourcesService.create(data);
        this.writeResource(created);

        if (unitId) {
            this.linkResource(unitId, created.id);
        }

        return created;
    }

    async updateResource(id: RecordIdString, data: ResourceUpdateInput) {
        const updated = await resourcesService.update(id, data);
        this.writeResource(updated);
        return updated;
    }

    async deleteResource(id: RecordIdString, unitId?: RecordIdString) {
        await resourcesService.remove(id);

        if (unitId) {
            this.unlinkResource(unitId, id);
        } else {
            this.unlinkResourceFromAll(id);
        }
    }

    linkResourceToUnit(unitId: RecordIdString, resourceId: RecordIdString) {
        if (this.resourceCache[resourceId]) {
            this.linkResource(unitId, resourceId);
            return;
        }

        void this.fetch(resourceId, unitId);
    }

    unlinkResourceFromUnit(unitId: RecordIdString, resourceId: RecordIdString) {
        this.unlinkResource(unitId, resourceId);
    }
}

const [getResourcesContextInternal, setResourcesContextInternal] = createContext<ResourcesStore>();

let resourcesStoreSingleton: ResourcesStore | null = null;
let resourcesContextRegistered = false;

const getOrCreateResourcesStore = () => {
    if (!resourcesStoreSingleton) {
        resourcesStoreSingleton = new ResourcesStore();
    }

    return resourcesStoreSingleton;
};

export const setResourcesContext = () => {
    const store = getOrCreateResourcesStore();
    resourcesContextRegistered = true;
    setResourcesContextInternal(store);
    return store;
};

export const getResourcesContext = () => {
    if (!resourcesContextRegistered) {
        return getOrCreateResourcesStore();
    }

    return getResourcesContextInternal();
};

export type {
    ResourceCreateInput,
    ResourceUpdateInput,
    ResourceResponse
} from '$lib/pocketbase/resources.service';
