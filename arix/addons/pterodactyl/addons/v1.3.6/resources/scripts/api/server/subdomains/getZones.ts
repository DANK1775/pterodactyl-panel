import http from '@/api/http';

export interface DomainZones {
    data: string[];
}

const getZones = (): Promise<DomainZones> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/domain/zones`)
            .then((response) => {
                const zones = Object.values(response.data.data) as string[];
                resolve({ data: zones });
            })
            .catch(reject);
    });
};

export default getZones;