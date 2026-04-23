import { action, Action } from 'easy-peasy';
import { InstalledPlugin } from '@/api/server/plugins/Plugins';

export interface ServerPluginsStore {
    data: InstalledPlugin[]; 
    setPlugins: Action<ServerPluginsStore, InstalledPlugin[]>; 
    appendPlugin: Action<ServerPluginsStore, InstalledPlugin>; 
    removePlugin: Action<ServerPluginsStore, number>;
}

const plugins: ServerPluginsStore = {
    data: [],

    setPlugins: action((state, payload) => {
        state.data = payload;
    }),

    appendPlugin: action((state, payload) => {
        const exists = state.data.find(plugin => plugin.id === payload.id);
        if (!exists) {
            state.data.push(payload); 
        }
    }),

    removePlugin: action((state, payload) => {
        state.data = state.data.filter(plugin => plugin.id !== payload);
    }),
};

export default plugins;