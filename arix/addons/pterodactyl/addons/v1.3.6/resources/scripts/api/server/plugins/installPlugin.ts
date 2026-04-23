import http from '@/api/http';
import pullFile from '@/api/server/files/pullFile';
import { InstalledPlugin } from '@/api/server/plugins/Plugins';
import prepareDownload from '@/api/server/plugins/prepareDownload';

export interface InstallProps {
    id: string, 
    uuid: string, 
    service: string, 
    plugin_id: string, 
    plugin_name: string, 
    plugin_icon: string, 
    version: string, 
    download: string
}

const installPlugin = async ({ 
    id, 
    uuid, 
    service, 
    plugin_id, 
    plugin_name, 
    plugin_icon, 
    version, 
    download
}: InstallProps ): Promise<InstalledPlugin> => {
    const formatedVersion = version.replace(/[^a-zA-Z0-9._-]/g, '');
    const formatedName = plugin_name.replace(/[^a-zA-Z0-9._-]/g, '');
    const formatFile = `${service.slice(0,1)}-${formatedVersion}-${formatedName.slice(0, 5)}.jar`;

    const PrepareDownload = async (): Promise<string> => {
        if (service !== 'spigot') {
            return download;
        } else {
            try {
                const rep: string = await prepareDownload({
                    id,
                    url: download,
                    name: formatedName,
                    version: formatedVersion
                });

                return `https://arix.gg/arix-api/v1/${rep}`;
            } catch (error) {
                throw new Error(`Failed to prepare download: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };

    try {
        const downloadUrl = await PrepareDownload();
        await pullFile(uuid, downloadUrl, '/plugins', formatFile);
    } catch (error) {
        throw new Error(`Plugin installation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return new Promise((resolve, reject) => {
        http.post(`/api/client/${id}/plugin/install`, {
            plugin_icon,
            plugin_name,
            plugin_service: service,
            plugin_version: version,
            plugin_service_id: plugin_id,
            file_name: formatFile
        })
        .then(({ data }) => resolve(data))
        .catch(reject);
    });
};

export default installPlugin;