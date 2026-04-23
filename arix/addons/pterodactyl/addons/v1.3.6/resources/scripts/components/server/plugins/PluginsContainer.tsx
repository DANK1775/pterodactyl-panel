import React, { useState, useEffect } from 'react';
import getPlugins from '@/api/server/plugins/getPlugins';
import getFilters from '@/api/server/plugins/getFilters';
import getInstalledPlugins from '@/api/server/plugins/getInstalledPlugins';
import { Plugin, QueryParams } from '@/api/server/plugins/Plugins';
import PluginRow from '@/components/server/plugins/PluginRow';
import PluginInstalledRow from '@/components/server/plugins/PluginInstalledRow';
import { ServerContext } from '@/state/server';
import useFlash from '@/plugins/useFlash';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import PaginationFooter from '@/components/elements/table/PaginationFooter';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { Button } from "@/components/elements/button/index"
import Input from '@/components/elements/Input';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import FlashMessageRender from '@/components/FlashMessageRender';
import { PaginatedResult } from '@/api/http';
import { useTranslation } from 'react-i18next';
import { ApplicationStore } from '@/state';
import { useStoreState } from 'easy-peasy';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { HiOutlineDocumentDownload, HiDocumentDownload } from "react-icons/hi";
import { LuFileSearch } from "react-icons/lu";
import { RiFileSearchLine, RiFileSearchFill } from "react-icons/ri";

type RadioProps = {
    id: string;
    target: keyof QueryParams;
    active?: string;
    updateFilter: (target: keyof QueryParams, value: string | number) => void;
};

type DropdownProps = {
    active?: string;
    main: string;
    count: string[];
    updateFilter: (target: keyof QueryParams, value: string | number) => void;
};

type McVersionsFiltersProps = {
    [parentVersion: string]: string[];
};

const RadioButton: React.FC<RadioProps> = ({ id, target, active, updateFilter }) => {
    return (
        <div className="flex items-center gap-x-1 cursor-pointer">
            <Input
                id={`${id}-${target}`}
                name={target}
                type="radio"
                checked={active === id}
                onClick={() => updateFilter(target, id)}
            />
            <label htmlFor={`${id}-${target}`} className={'capitalize'}>
                {id.toLowerCase()}
            </label>
        </div>
    );
};

const VersionDropdown: React.FC<DropdownProps> = ({ main, count, active, updateFilter}) => {
    const [isOpen, setOpen] = useState(false);

    return(
        <div>
            <div className={'flex items-center gap-x-2'}>
                <RadioButton id={main} active={active} target={'version'} updateFilter={updateFilter} />
                <button onClick={() => setOpen(!isOpen)}>
                    <ChevronDownIcon className={`${isOpen ? 'rotate-180' : ''} w-5 duration-300`} />
                </button>
            </div>
            <div className={`${isOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden duration-300 pl-4`}>
                {count.map((version) => (
                    <RadioButton 
                        key={version} 
                        id={version} 
                        active={active} 
                        target={'version'} 
                        updateFilter={updateFilter} 
                    />
                ))}
            </div>
        </div>
    )
}

const PluginsContainer = () => {
    const { t } = useTranslation('arix/server/addons/plugins');
    const [McVersionsFilters, setMcVersionsFilters] = useState<McVersionsFiltersProps | null>();
    const [showInstalled, setShowInstalled] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const [loading, setLoading] = useState<boolean>(true);
    const { addError, clearFlashes } = useFlash();
    const [filters, setFilters] = useState<QueryParams>({ page: 1, service: 'modrinth', version: '', loader: '', search: '' });
    const [plugins, setPlugins] = useState<PaginatedResult<Plugin>>();
    const setInstalledPlugins = ServerContext.useStoreActions((state) => state.plugins.setPlugins);
    const installedPlugins = useDeepMemoize(ServerContext.useStoreState((state) => state.plugins.data));
    const iconStyle = useStoreState((state: ApplicationStore) => state.settings.data!.arix.icon);

    const resetFilters = () => {
        setSearchTerm('');
        setFilters({ page: 1, service: 'modrinth', version: '', loader: '', search: '' });
    }

    const updateFilter = (target: keyof QueryParams, value: string | number): void => {
        if(target==='service') {
            setSearchTerm('');
            setFilters((prevFilters) => ({
                ...prevFilters,
                page: 1,
                version: '',
                loader: '',
                search: '',
                [target]: String(value) 
            }));
        } else {
            if(filters[target] === value){
                setFilters((prevFilters) => ({
                ...prevFilters,
                page: 1,
                [target]: ''
              }));
            } else {
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    page: 1,
                    [target]: value
                }));
            }
        }
    };

    useEffect(() => {
        if (searchTerm === filters.search) return; 
        const handler = setTimeout(() => {
            updateFilter('search', searchTerm);
        }, 1000);

        return () => clearTimeout(handler);
    }, [searchTerm, filters.search, updateFilter]);


    useEffect(() => {
        setLoading(true);
        clearFlashes('plugins');

        getPlugins({id, ...filters })
            .then((response: PaginatedResult<Plugin>) => {
                setPlugins(response);
            })
            .catch((error) => {
                addError({ key: 'plugins', message: error.message });
            })
            .finally(() => {
                setLoading(false); 
            });
    }, [id, filters]);

    useEffect(() => {
        clearFlashes('plugins');

        getInstalledPlugins({id})
            .then((response) => {
                setInstalledPlugins(response);
            })
            .catch((error) => {
                addError({ key: 'plugins', message: error.message });
            })
    }, [id]);

    useEffect(() => {
        clearFlashes('plugins');
    
        getFilters({id })
            .then((response: string[]) => {
                const grouped = response.reduce((acc: McVersionsFiltersProps, version) => {
                    if(version.split(".").length < 3) {
                        return acc;
                    }

                    const [major, minor] = version.split('.');
                    const key = `${major}.${minor}`;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(version);
                    
                    return acc;
                }, {});
                setMcVersionsFilters(grouped);

                console.log(grouped);
            })
            .catch((error) => {
                addError({ key: 'plugins', message: error.message });
            })

    }, [])

    return (
        <ServerContentBlock 
            title={t('plugins')} 
            icon={
                iconStyle === 'heroicons'
                    ? HiOutlineDocumentDownload
                    : iconStyle === 'heroiconsFilled'
                    ? HiDocumentDownload
                    : iconStyle === 'lucide'
                    ? LuFileSearch
                    : iconStyle === 'remixicon'
                    ? RiFileSearchLine
                    : RiFileSearchFill
            }
        >
            <SpinnerOverlay visible={loading} fixed={true} size={'large'} />
            <FlashMessageRender byKey={'plugins'} />
            {!showInstalled ?
            <div className={'grid lg:grid-cols-4 gap-4'}>
                <div className={'lg:col-span-3'}>
                    <div className={'flex gap-x-2 mb-4'}>
                        <Input
                            name="search"
                            type="text"
                            placeholder={t('search-for-a-plugin')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button.Text onClick={() => setShowInstalled(!showInstalled)} className={'whitespace-nowrap'}>
                            {t('installed-plugins')}
                        </Button.Text>
                    </div>
                    <div className={'grid lg:grid-cols-2 gap-4'}>
                        {(plugins?.items?.length ?? 0) > 0 ? (
                            plugins?.items?.map((plugin: Plugin) => (
                                <PluginRow
                                    plugin={plugin}
                                    filters={filters}
                                />
                            ))
                        ) : (
                            <div className={'lg:col-span-2'}>
                                {t('no-plugins-found')}
                            </div>
                        )}
                    </div>
                    {plugins && (
                        <PaginationFooter
                            pagination={plugins.pagination}
                            onPageSelect={(page) => setFilters((value) => ({ ...value, page }))}
                        />
                    )}
                </div>
                <div>
                    <div className={'sticky top-4 bg-gray-700 rounded-box backdrop p-5 flex flex-col gap-5'}>
                        <div className={'flex flex-col gap-1'}>
                            <div className={'flex items-center justify-between'}>
                                <p className={'font-medium'}>{t('platform')}</p>
                                {JSON.stringify(filters) !== JSON.stringify({ 
                                    page: 1, 
                                    service: 'modrinth', 
                                    version: '', 
                                    loader: '', 
                                    search: '' 
                                }) && (
                                    <button onClick={() => resetFilters()} className={'text-sm text-gray-300 font-medium'}>
                                        ({t('reset-filters')})
                                    </button>
                                )}
                            </div>
                            <RadioButton id="modrinth" active={filters.service} target={'service'} updateFilter={updateFilter} />
                            <RadioButton id="curseforge" active={filters.service} target={'service'} updateFilter={updateFilter} />
                            <RadioButton id="hangar" active={filters.service} target={'service'} updateFilter={updateFilter} />
                            <RadioButton id="spigot" active={filters.service} target={'service'} updateFilter={updateFilter} />
                        </div>
                        {filters.service !== 'spigot' &&
                            <div className={'flex flex-col gap-1'}>
                                <p className={'font-medium'}>{t('version')}</p>
                                <div className={'flex flex-col gap-1 max-h-48 overflow-auto'}>
                                    {Object.entries(McVersionsFilters ?? {}).map(([key, versions]: [string, string[]]) => (
                                        <VersionDropdown
                                            key={key}
                                            main={key}
                                            count={versions}
                                            active={filters.version}
                                            updateFilter={updateFilter}
                                        />
                                    ))}
                                </div>
                            </div>
                        }
                        {(filters.service === 'hangar' || filters.service === 'modrinth') &&
                            <div className={'flex flex-col gap-1'}>
                                <p className={'font-medium'}>{t('loader')}</p>
                                {filters.service === 'hangar' &&
                                    <>
                                    <RadioButton id="PAPER" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="WATERFALL" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="VELOCITY" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    </>
                                }
                                {filters.service === 'modrinth' &&
                                    <>
                                    <RadioButton id="bukkit" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="bungeecord" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="folia" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="paper" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="purpur" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="spigot" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="sponge" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="velocity" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="waterfall" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    <RadioButton id="fabric" active={filters.loader} target={'loader'} updateFilter={updateFilter} />
                                    </>
                                }
                            </div>
                        }

                    </div>
                </div>
            </div>
            :
            <div className={'grid lg:grid-cols-3 gap-4'}>
                <div className={'lg:col-span-3 flex gap-x-2'}>
                    <Input
                        name="search"
                        type="text"
                        placeholder={t('search-for-a-plugin')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button.Text onClick={() => setShowInstalled(!showInstalled)} className={'whitespace-nowrap'}>
                        {t('browse-plugins')}
                    </Button.Text>
                </div>
                {installedPlugins
                    .filter((plugin) => 
                        plugin.plugin_name.toLowerCase().replace(/-/g, ' ')
                            .includes(searchTerm.toLowerCase().replace(/-/g, ' '))
                    )
                    .map((plugin) => (
                    <PluginInstalledRow 
                        {...plugin}
                    />
                ))}
            </div>
            }
        </ServerContentBlock>
    )
}

export default PluginsContainer