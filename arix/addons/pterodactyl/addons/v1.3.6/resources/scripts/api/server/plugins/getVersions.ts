import http from '@/api/http';
import { Versions } from '@/api/server/plugins/Plugins';

const getVersions = ({ id, service, pluginId }: { id: string, service: string, pluginId: string  }): Promise<Versions> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/${id}/plugin/${service}/${pluginId}`)
            .then(({ data }) =>
                resolve({
                    versions: data.versions
                })
            )
            .catch(reject);
    });
};

export default getVersions;