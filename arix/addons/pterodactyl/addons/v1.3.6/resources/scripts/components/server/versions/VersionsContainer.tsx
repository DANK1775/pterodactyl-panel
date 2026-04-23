import React, { useState, useEffect } from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import { ExclamationIcon } from '@heroicons/react/outline';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { Actions, useStoreActions } from 'easy-peasy';
import getEngines from '@/api/server/versions/getEngines';
import getVersions from '@/api/server/versions/getVersions';
import setVersion from '@/api/server/versions/setVersion';
import Select from "@/components/elements/Select";
import { ServerContext } from '@/state/server';
import Input from '@/components/elements/Input';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import Can from '@/components/elements/Can';
import Spinner from '@/components/elements/Spinner';
import { useTranslation } from 'react-i18next';
import { ApplicationStore } from '@/state';
import { useStoreState } from 'easy-peasy';
import { HiOutlineCollection, HiCollection } from "react-icons/hi";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { RiGitBranchLine, RiGitBranchFill } from "react-icons/ri";

const VersionsContainer = () => {
    const { t } = useTranslation('arix/server/addons/versions');
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [engines, setEngines] = useState<string[]>([]);
    const [versions, setVersions] = useState<{ version: string; download_url: string }[]>([]);
    const [uninstall, setUninstall] = useState<boolean>(false);
    const [isInstalling, setIsInstalling] = useState<boolean>(false);
    const [selectedEngine, setSelectedEngine] = useState<string>('');
    const [selectedVersion, setSelectedVersion] = useState<string>('');
    const [current, setCurrent] = useState<{ service: string; version: string }>({ service: '', version: '' });
    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);
    const [loading, setLoading] = useState(true);
    const iconStyle = useStoreState((state: ApplicationStore) => state.settings.data!.arix.icon);

    useEffect(() => {
        setLoading(!engines.length);
        clearFlashes('versions');

        getEngines(id)
            .then((response) => {
                setEngines(response.data);
                setCurrent(response.current);
                if(response.data.includes('Paper')){
                    setSelectedEngine('Paper');
                } else {
                    setSelectedEngine(response.data[0]);
                }
            })
            .catch((error) => {
                addFlash({
                    type: 'error',
                    key: 'versions',
                    message: error,
                });
            })
            .finally(() => {
                setLoading(false); 
            });
    }, []);

    useEffect(() => {
        clearFlashes('versions');

        getVersions(id, selectedEngine)
            .then((response) => {
                setVersions(response.data);
            })
            .catch((error) => {
                addFlash({
                    type: 'error',
                    key: 'versions',
                    message: error,
                });
            });
    }, [selectedEngine]);

    const Install = () => {
        clearFlashes('versions');
        setIsInstalling(true)

        const version = selectedVersion;
        const download = versions.find((v) => v.version === selectedVersion)?.download_url;

        if(!download){
            return;
        }

        setVersion({ uuid, id, engine: selectedEngine, version, download, uninstall })
            .then(() => {
                addFlash({
                    type: 'success',
                    key: 'versions',
                    message: `${selectedEngine} ${version} ${t('succesfully-installed')}.`,
                });
                setCurrent({ service: selectedEngine, version })
            })
            .catch((error) => {
                addFlash({
                    type: 'error',
                    key: 'versions',
                    message: error,
                });
            })
            .finally(() => {
                setIsInstalling(false);
            })
    }

    const changeEngine = (engine: string) => {
        setSelectedEngine(engine);
        setSelectedVersion('');
    }

    return (
        <ServerContentBlock 
            title={t('versions')} 
            icon={
                iconStyle === 'heroicons'
                    ? HiOutlineCollection
                    : iconStyle === 'heroiconsFilled'
                    ? HiCollection
                    : iconStyle === 'lucide'
                    ? LuGalleryVerticalEnd
                    : iconStyle === 'remixicon'
                    ? RiGitBranchLine
                    : RiGitBranchFill
            }
        >
            <FlashMessageRender byKey={'versions'} />

            {(!loading && engines) && (
                <TitledGreyBox title={t('version-changer')} className={'max-w-xl mx-auto'}>
                    <p>{t('easily-switch-version')}</p>
                    {current.service &&
                        <p>
                            {t('you-currently-on')}: {current.service} {current.version}
                        </p>
                    }
                    <div className='mt-4 relative'>
                        <img 
                            src={`/addons/${selectedEngine.split(' ')[0].toLowerCase()}.png`} 
                            width={24} 
                            height={24} 
                            alt={selectedEngine}
                            className='absolute top-3 left-4' 
                        />
                        <Select onChange={(e) => changeEngine(e.target.value)} value={selectedEngine} className={'!pl-12'}>
                            {engines.map((engine) => (
                                <option key={engine} value={engine.split(' ')[0]}>
                                    {engine}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <Select onChange={(e) => setSelectedVersion(e.target.value)} value={selectedVersion} className={'mt-2'}>
                        <option className='hidden'>{t('select-a-version')}</option>
                        {versions.map(({ version }) => (
                            <option key={version} value={version}>
                                {version}
                            </option>
                        ))}
                    </Select>

                    <label
                        className='flex gap-x-3 items-center px-4 py-3 bg-neutral-600 !border-neutral-500 hover:border-neutral-400 text-neutral-200 duration-300 rounded-component mt-2' 
                        style={{ border: "var(--borderInput)" }}
                    >
                        <Input
                            type="checkbox"
                            checked={uninstall}
                            onChange={(e) => setUninstall(e.target.checked)}
                        />
                        <div>
                            <p className='flex items-center gap-x-2 font-medium'>
                                <ExclamationIcon className={'w-5 text-danger-100'} />
                                {t('danger-zone')}
                            </p>
                            <p>{t('reset-your-server')}</p>
                        </div>
                    </label>
                    <div className={'mt-4 flex justify-between items-center'}>
                        <p className='text-sm text-grey-400 flex items-center gap-x-2'>
                            {t('powered-by')}
                            <img src={'/addons/mcutils.svg'} width={80} height={17.6} alt='McUtils' />
                        </p>
                        <Can action={'file.update'}>
                            <Button
                                onClick={() => Install()}
                                disabled={!selectedVersion || isInstalling}
                                className={'flex items-center gap-x-2'}
                            >
                                {isInstalling && <Spinner size={'small'} />}
                                {t('install')}
                            </Button>
                        </Can>
                    </div>
                </TitledGreyBox>
            )}
        </ServerContentBlock>
    );
};

export default VersionsContainer;