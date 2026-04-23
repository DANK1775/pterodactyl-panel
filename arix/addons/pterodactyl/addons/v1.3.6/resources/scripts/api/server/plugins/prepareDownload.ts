import http from '@/api/http';

const prepareDownload = ({ id, url, name, version }: { id: string, url: string, name: string, version: string }): Promise<string> => {
    return new Promise((resolve, reject) => {
        console.log(id, url, name, version);
        
        http.post(`/api/client/${id}/plugin/file/prepare`, {
                url,
                name: `${name.replace(/[^a-zA-Z0-9._-]/g, '')}.jar`,
                version: version.replace(/[^a-zA-Z0-9._-]/g, '')
            })
            .then(({ data }) => {
                console.log(data)
                resolve(data.url);
            })
            .catch(reject);
    });
};

export default prepareDownload;