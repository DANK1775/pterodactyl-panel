import http from '@/api/http';

const getFilters = ({ id }: { id: string }): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/${id}/plugin/filters`)
            .then(({ data }) => resolve(data.versions))
            .catch(reject);
    });
};

export default getFilters;