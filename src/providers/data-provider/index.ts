import { API_URL, axiosInstance } from "@providers/axios";
import type {
    DataProvider,
    BaseRecord,
    GetListParams,
    GetOneParams,
    CreateParams,
    UpdateParams,
    DeleteOneParams,
    GetManyParams,
    CreateManyParams,
    UpdateManyParams,
    DeleteManyParams,
    CustomParams,
    Pagination,
} from "@refinedev/core";
import { DataProviderMeta } from "./meta";


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Maps POS resource names to their API path.
 * "pos-service-categories" → "pos/service-categories"
 * All other resources are returned as-is.
 */
function resolveEndpoint(resource: string): string {
    if (resource.startsWith("pos-")) {
        return "pos/" + resource.slice(4);
    }
    return resource;
}

function resolvePagination(pagination: Pagination | undefined) {
    const { currentPage = 1, pageSize = 10 } = pagination ?? {};
    return { page: currentPage, pageSize };
}

function normalizeRecords(records: any[]): BaseRecord[] {
    return records.map((record) => {
        if (record.id) return record;
        const idField = Object.entries(record).find(
            ([key]) => key.endsWith("Id") && !key.startsWith("_"),
        );
        return idField ? { ...record, id: idField[1] } : record;
    });
}

function buildSortParam(sorters: GetListParams["sorters"]) {
    if (!sorters?.length) return undefined;
    return sorters.map((s) => `${s.field}:${s.order}`).join(",");
}

function buildFiltersParam(filters: GetListParams["filters"]) {
    if (!filters?.length) return undefined;
    return JSON.stringify(filters);
}

type WithMeta<T> = Omit<T, "meta"> & {
    meta?: DataProviderMeta; 
};

// ---------------------------------------------------------------------------
// Data Provider
// ---------------------------------------------------------------------------

export const dataProvider = {
    getList: async ({ resource, pagination, sorters, filters, meta }: WithMeta<GetListParams>) => {
        const { page, pageSize } = resolvePagination(pagination);

        const params: Record<string, unknown> = {
            page: String(page),
            limit: String(pageSize),
        };

        const sort = buildSortParam(sorters);
        if (sort) params.sort = sort;

        const filtersParam = buildFiltersParam(filters);
        if (filtersParam) params.filters = filtersParam;

        // Merge any extra query params passed via meta
        if (meta?.params) Object.assign(params, meta.params);

        const endpoint = meta?.listEndpoint ?? resolveEndpoint(resource);
        const { data: envelope } = await axiosInstance.get(`/${endpoint}`, { params });

        let dataArray = envelope.data ?? envelope;
        if (!Array.isArray(dataArray)) {
            const arrayProperty = Object.values(dataArray ?? {}).find(Array.isArray);
            dataArray = Array.isArray(arrayProperty) ? arrayProperty : [];
        }

        const normalizedData = normalizeRecords(dataArray);

        return {
            data: normalizedData,
            total: envelope.total ?? normalizedData.length,
        };
    },

    getOne: async ({ resource, id, meta }: WithMeta<GetOneParams>) => {
        const endpoint = meta?.getEndpoint ?? resolveEndpoint(resource);
        const { data } = await axiosInstance.get(`/${endpoint}/${id}`);
        return { data: data.data ?? data };
    },

    create: async ({ resource, variables, meta }: WithMeta<CreateParams>) => {
        const endpoint = meta?.createEndpoint ?? resolveEndpoint(resource);
        const { data } = await axiosInstance.post(`/${endpoint}`, variables);
        return { data: data.data ?? data };
    },

    update: async ({ resource, id, variables, meta }: WithMeta<UpdateParams>) => {
        const endpoint = meta?.updateEndpoint ?? meta?.getEndpoint ?? resolveEndpoint(resource);
        const { data } = await axiosInstance.patch(`/${endpoint}/${id}`, variables);
        return { data: data.data ?? data };
    },

    deleteOne: async ({ resource, id, meta }: WithMeta<DeleteOneParams>) => {
        const endpoint = meta?.deleteEndpoint ?? meta?.getEndpoint ?? resolveEndpoint(resource);
        await axiosInstance.delete(`/${endpoint}/${id}`);
        return { data: {} as BaseRecord };
    },

    getApiUrl: () => API_URL,

    getMany: async ({ resource, ids, meta }: WithMeta<GetManyParams>) => {
        const endpoint = meta?.getEndpoint ?? resolveEndpoint(resource);
        const { data } = await axiosInstance.get(`/${endpoint}`, {
            params: { ids: ids.join(",") },
        });
        return { data: data.data ?? data ?? [] };
    },

    createMany: async ({ resource, variables, meta }: WithMeta<CreateManyParams>) => {
        const endpoint = meta?.createEndpoint ?? resolveEndpoint(resource);
        const { data } = await axiosInstance.post(`/${endpoint}/bulk`, variables);
        return { data: data.data ?? data };
    },

    updateMany: async ({ resource, ids, variables, meta }: WithMeta<UpdateManyParams>) => {
        const endpoint = meta?.updateEndpoint ?? resolveEndpoint(resource);
        const { data } = await axiosInstance.patch(`/${endpoint}/bulk`, { ids, ...variables });
        return { data: data.data ?? data };
    },

    deleteMany: async ({ resource, ids, meta }: WithMeta<DeleteManyParams>) => {
        const endpoint = meta?.deleteEndpoint ?? resolveEndpoint(resource);
        await axiosInstance.delete(`/${endpoint}/bulk`, { data: { ids } });
        return { data: [] };
    },

    custom: async ({ url, method, payload, query, headers }: CustomParams) => {
        const config = { params: query, headers };
        switch (method) {
            case "get": return { data: (await axiosInstance.get(url, config)).data };
            case "post": return { data: (await axiosInstance.post(url, payload, config)).data };
            case "put": return { data: (await axiosInstance.put(url, payload, config)).data };
            case "patch": return { data: (await axiosInstance.patch(url, payload, config)).data };
            case "delete": return { data: (await axiosInstance.delete(url, config)).data };
            default: throw new Error(`Unsupported method: ${method}`);
        }
    },
} as unknown as DataProvider;