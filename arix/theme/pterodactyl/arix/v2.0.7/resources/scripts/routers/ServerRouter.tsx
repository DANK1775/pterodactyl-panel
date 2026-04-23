import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ApplicationStore } from '@/state';
import Announcement from '@/components/elements/Announcement';
import { ServerContext } from '@/state/server';
import Spinner from '@/components/elements/Spinner';
import { ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';

import InformationBar from '@/routers/layouts/InformationBar';
import SideBar from '@/routers/layouts/SideBar';
import IconBar from '@/routers/layouts/IconBar';
import NavigationBar from '@/routers/layouts/NavigationBar';

import LowResourcesAlert from '@/components/server/LowResourcesAlert';
import PanelSounds from '@/components/server/PanelSounds';
import InstallListener from '@/components/server/InstallListener';
import NodeAlert from '@/components/server/NodeAlert';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router';
import PowerButtons from '@/components/server/console/PowerButtons';
import CopyOnClick from '@/components/elements/CopyOnClick';
import Can from '@/components/elements/Can';
import { useTranslation } from 'react-i18next';
import ConflictStateRenderer from '@/components/server/ConflictStateRenderer';
import { Navigation, ComponentLoader } from '@/routers/RouterElements';
import { GlobeIcon } from '@heroicons/react/outline';
import { ip } from '@/lib/formatters';
import { useFloating } from '@/context/FloatingContext';

/*
        ██╗██╗  ░██╗░░░░░░░██╗░█████╗░██████╗░███╗░░██╗  ██╗██╗
        ██║██║  ░██║░░██╗░░██║██╔══██╗██╔══██╗████╗░██║  ██║██║
        ██║██║  ░╚██╗████╗██╔╝███████║██████╔╝██╔██╗██║  ██║██║
        ╚═╝╚═╝  ░░████╔═████║░██╔══██║██╔══██╗██║╚████║  ╚═╝╚═╝
        ██╗██╗  ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░╚███║  ██╗██╗
        ╚═╝╚═╝  ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝  ╚═╝╚═╝


        Read this before doing addon modifications

        Arix Theme has already handled many panel 
        modifications for you, so there's no need for 
        any changes in the "ServerRouter.tsx" file.
*/

export default () => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();
    const { floating: isFloating, setFloating } = useFloating();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('floating') === 'true') {
            setFloating(true);
        }
    }, [location.search]);

    const { t } = useTranslation('arix/navigation');

    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const layout = useStoreState((state: ApplicationStore) => state.settings.data!.arix.layout);
    const background = useStoreState((state: ApplicationStore) => state.settings.data!.arix.background);
    const backgroundFaded = useStoreState((state: ApplicationStore) => state.settings.data!.arix.backgroundFaded);
    const [error, setError] = useState('');

    const name = ServerContext.useStoreState((state) => state.server.data?.name);
    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const inConflictState = ServerContext.useStoreState((state) => state.server.inConflictState);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);
    const status = ServerContext.useStoreState((state) => state.status.value);

    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data?.allocations.find((allocation) => allocation.isDefault);

        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    useEffect(
        () => () => {
            clearServerState();
        },
        []
    );

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    return (
        <React.Fragment key={'server-router'}>
            <div className={`min-h-screen h-full relative z-10`}>
                {String(background) === 'true' && !isFloating &&
                    <div className={`absolute top-0 left-0 w-full h-full bg-center bg-no-repeat bg-cover bg-fixed -z-10 
                        ${backgroundFaded === 'translucent' ? 'opacity-50' : 'opacity-100'}
                        ${backgroundFaded === 'faded' ? `after:content-[''] after:bg-center after:bg-cover after:bg-fixed after:absolute after:inset-0 after:bg-gradient-to-b from-transparent to-gray-800` : ''}
                    `} 
                        css={`background-image:var(--image);`}
                    />
                }
                <PanelSounds />
                {!uuid || !id ? (
                    error ? (
                        <ServerError message={error} />
                    ) : (
                        <Spinner size={'large'} centered />
                    )
                ) : (
                    isFloating ? (
                        <div className="w-full">
                            <InstallListener />
                            <TransferListener />
                            <WebsocketHandler />
                            {inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                                <ConflictStateRenderer />
                            ) : (
                                <ErrorBoundary>
                                    <ComponentLoader />
                                </ErrorBoundary>
                            )}
                        </div>
                    ) : (
                        <div className="flex">

                            {(layout == 1 || layout == 5) &&
                            <SideBar>
                                <Navigation />
                                {rootAdmin && (
                                    // eslint-disable-next-line react/jsx-no-target-blank
                                    <a href={`/admin/servers/view/${serverId}`} target={'_blank'} className={'mt-3'}>
                                        <FontAwesomeIcon icon={faExternalLinkAlt} /> {t`admin-view`}
                                    </a>
                                )}
                            </SideBar>}

                            {layout == 2 &&
                            <SideBar type>
                                <div className={'px-5 pt-3'}>
                                    <div className="flex items-center gap-x-2">
                                        <div className={`w-6 h-6 rounded opacity-50
                                            ${status === 'offline'
                                            ? 'bg-danger-200' 
                                            : status === 'running' 
                                            ? 'bg-success-200'
                                            : status === 'starting' 
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                            }
                                        `}/>
                                        <span className="font-semibold text-lg text-gray-50">{name}</span>
                                    </div>
                                    <CopyOnClick text={allocation}>
                                        <p className="text-sm flex gap-x-1 items-center privacy:blur-sm hover:privacy:blur-none duration-300">
                                            <GlobeIcon className="w-4 text-gray-300" />
                                            {allocation}
                                        </p>
                                    </CopyOnClick>
                                    <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                                        <PowerButtons className="w-full grid grid-cols-3 gap-2 mt-3" icons />
                                    </Can>
                                    <hr className={'border-b border-gray-500 mt-3'}/>
                                </div>
                                <Navigation />
                                {rootAdmin && (
                                    // eslint-disable-next-line react/jsx-no-target-blank
                                    <a href={`/admin/servers/view/${serverId}`} target={'_blank'} className={'mt-3'}>
                                        <FontAwesomeIcon icon={faExternalLinkAlt} /> {t`admin-view`}
                                    </a>
                                )}
                            </SideBar>}

                            {layout == 4 &&
                                <IconBar>
                                    <Navigation />
                                </IconBar>
                            }

                            <div className="w-full">
                                <NavigationBar>
                                    <Navigation />
                                </NavigationBar>
                                <InstallListener />
                                <TransferListener />
                                <WebsocketHandler />
                                {inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                                    <ConflictStateRenderer />
                                ) : (
                                    <ErrorBoundary>
                                        <div className={'lg:block hidden'}>
                                            {(layout == 3 || layout == 1 || layout == 4 || layout == 5) &&
                                                <InformationBar />
                                            }
                                        </div>
                                        <div className={'lg:hidden block'}>
                                            <InformationBar />
                                        </div>
                                        <LowResourcesAlert />
                                        <NodeAlert />
                                        <Announcement />
                                        <ComponentLoader />
                                    </ErrorBoundary>
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        </React.Fragment>
    );
};
