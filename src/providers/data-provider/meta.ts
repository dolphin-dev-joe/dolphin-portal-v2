import { GraphQLQueryOptions } from "@refinedev/core";

export interface DataProviderMeta extends GraphQLQueryOptions {
    getEndpoint?: string;
    listEndpoint?: string;
    createEndpoint?: string;
    updateEndpoint?: string;
    deleteEndpoint?: string;
    params?: Record<string, unknown>;
}


export function defineMeta(meta: DataProviderMeta): DataProviderMeta {
    return meta;
}