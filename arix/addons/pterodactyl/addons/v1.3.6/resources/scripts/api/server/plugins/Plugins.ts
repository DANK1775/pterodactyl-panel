export interface Plugin {
    id:          string;
    icon:        string;
    name:        string;
    description: string;
    stats:       Stats;
    project:     Project;
}

export interface Project {
    author:     string;
    authorUrl:  string;
    projectUrl: string;
}

export interface Stats {
    downloads:   number;
    likes:       number;
    lastUpdated: Date;
}

export interface QueryParams {
    service: string;
    version?: string;
    loader?: string;
    page?: number;
    search?: string;
}

export interface Versions {
    versions: Version[];
}

export interface Version {
    name: string;
    url:  string;
}

export interface InstalledPlugin {
    id:                number;
    plugin_service:    string;
    plugin_version:    string;
    plugin_service_id: string;
    server_id:         number;
    plugin_name:       string;
    file_name:         string;
    plugin_icon:       string;
    created_at:        Date;
    updated_at:        Date;
}
