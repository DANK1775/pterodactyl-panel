import http, { getPaginationSet, PaginatedResult } from '@/api/http';
import { Plugin, QueryParams } from '@/api/server/plugins/Plugins';

const getPlugins = ({ id, service, ...params }: QueryParams & { id: string }): Promise<PaginatedResult<Plugin>> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/${id}/plugin/${service}`, {
            params: {
                ...params,
            },
        })
            .then(({ data }) =>
                resolve({
                    items: data.data,
                    pagination: getPaginationSet(data.meta.pagination),
                })
            )
            .catch(reject);
    });
};

export default getPlugins;