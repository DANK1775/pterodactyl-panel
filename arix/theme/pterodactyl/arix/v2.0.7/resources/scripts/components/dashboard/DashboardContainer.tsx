import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import { ApplicationStore } from '@/state';
import getServers from '@/api/getServers';
import ServerCard from '@/components/dashboard/ServerCard';
import ServerCardBanner from '@/components/dashboard/ServerCardBanner';
import ServerCardGradient from '@/components/dashboard/ServerCardGradient';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { 
    LuChevronRight, 
    LuCreditCard, 
    LuLifeBuoy, 
    LuRouter,
    LuTwitter,
    LuInstagram,
    LuLinkedin,
    LuYoutube,
    LuGithub

} from "react-icons/lu";
import { RxDiscordLogo } from "react-icons/rx";
import { FaDiscord } from "react-icons/fa";
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getServerOrder, updateServerOrder } from '@/api/serverOrder';

// Sortable Item Component
const SortableServerCard = ({ server, index, renderServerCard }: { server: Server, index: number, renderServerCard: (server: Server, index: number) => React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: server.uuid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-move">
      {renderServerCard(server, index)}
    </div>
  );
};

export default () => {
    const { t } = useTranslation('arix/dashboard');
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');
    const [guildData, setGuildData] = useState<{ instant_invite: string, presence_count: number } | null>(null);

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);
    const discordBox = useStoreState((state: ApplicationStore) => state.settings.data!.arix.discordBox);
    const discord = useStoreState((state: ApplicationStore) => state.settings.data!.arix.discord);
    const socials = useStoreState((state: ApplicationStore) => state.settings.data!.arix.socials);
    const socialButtons = useStoreState((state: ApplicationStore) => state.settings.data!.arix.socialButtons);
    const serverRow = useStoreState((state: ApplicationStore) => state.settings.data!.arix.serverRow);

    const [sortedServers, setSortedServers] = useState<Server[]>([]);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    const getStoredOrder = async (): Promise<string[]> => {
        return await getServerOrder();
    };

    const saveOrder = (servers: Server[]) => {
        const order = servers.map(server => server.uuid);

        updateServerOrder({
            server_ordered: order,
        }).catch((error) => {
            console.error('Failed to save server order:', error);
        });
    };

    useEffect(() => {
        const updateSortedServers = async () => {
            if (servers?.items) {
                const storedOrder = await getStoredOrder();
                const currentServerIds = servers.items.map(server => server.uuid);
                
                const validStoredOrder = storedOrder.filter(id => currentServerIds.includes(id));
                
                if (validStoredOrder.length > 0 && validStoredOrder.length === currentServerIds.length) {
                    const orderedServers = validStoredOrder.map(id => 
                        servers.items.find(server => server.uuid === id)!
                    );
                    setSortedServers(orderedServers);
                } else {
                    setSortedServers([...servers.items]);
                }
            }
        };

        updateSortedServers();
    }, [servers?.items, uuid]);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://discord.com/api/guilds/${discord}/widget.json`);

                if (!response.ok) {
                    throw new Error('Failed to fetch guild data');
                }

            const data = await response.json();
                setGuildData(data);
            } catch (error) {
                console.error('Error fetching guild data:', error);
            }
        };

        fetchData();
    }, []);

    // Handle drag end
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setSortedServers((items) => {
          const oldIndex = items.findIndex((item) => item.uuid === active.id);
          const newIndex = items.findIndex((item) => item.uuid === over?.id);
          
          const newOrder = arrayMove(items, oldIndex, newIndex);
          saveOrder(newOrder);
          return newOrder;
        });
      }
    };

    // Render server card based on serverRow setting
    const renderServerCard = (server: Server, index: number) => {
        const cardProps = {
            key: server.uuid,
            server: server,
            css: index > 0 ? tw`mt-2` : undefined,
            count: index
        };

        switch (Number(serverRow)) {
            case 1:
                return <ServerCardGradient {...cardProps} />;
            case 2:
                return <ServerCardBanner {...cardProps} />;
            case 3:
            default:
                return <ServerCard {...cardProps} />;
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            {String(socialButtons) == 'true' &&
                <div className={'flex lg:gap-4 gap-2 lg:flex-row flex-col mb-4'}>
                    {socials.map((social, index) => {
                        let IconComponent;
                        switch (social.icon) {
                            case 'billing':
                                IconComponent = LuCreditCard;
                                break;
                            case 'status':
                                IconComponent = LuRouter;
                                break;
                            case 'support':
                                IconComponent = LuLifeBuoy;
                                break;
                            case 'discord':
                                IconComponent = RxDiscordLogo;
                                break;
                            case 'twitter':
                                IconComponent = LuTwitter;
                                break;
                            case 'instagram':
                                IconComponent = LuInstagram;
                                break;
                            case 'linkedin':
                                IconComponent = LuLinkedin;
                                break;
                            case 'youtube':
                                IconComponent = LuYoutube;
                                break;
                            case 'github':
                                IconComponent = LuGithub;
                                break;
                            default:
                                return null;
                        }
                        return (
                            <a
                                key={index}
                                href={social.link}
                                target="_blank"
                                className={'group w-full bg-gray-700 backdrop rounded-box flex items-center justify-between px-6 py-5'}
                            >
                                <div>
                                    <p className={'font-medium text-gray-100 flex items-center'}>
                                        {social.title}
                                        <LuChevronRight className={'opacity-0 ml-0 group-hover:opacity-75 group-hover:ml-2 duration-300'} />
                                    </p>
                                    <span className={'font-light text-sm text-gray-200'}>{social.description}</span>
                                </div>
                                <IconComponent className={'text-[2.5rem] text-arix'}/>
                            </a>
                        );
                    })}
                </div>
            }
            <div className={'flex gap-4 md:flex-nowrap flex-wrap mb-6'}>
                <div className={'bg-gray-700 backdrop rounded-box px-6 py-5 w-full flex items-center justify-between'}>
                    <div>
                        <p className={'text-gray-50'}>{t('welcome-back')}</p>
                        <p className={'font-light'}>{t('all-servers-you-have-access-to')}</p>
                    </div>
                    {rootAdmin && (
                        <div css={tw`flex justify-end items-center`}>
                            <p css={tw`uppercase text-xs text-neutral-400 mr-2`}>
                                {showOnlyAdmin ? t('others-servers') : t('your-servers')}
                            </p>
                            <Switch
                                name={'show_all_servers'}
                                defaultChecked={showOnlyAdmin}
                                onChange={() => setShowOnlyAdmin((s) => !s)}
                            />
                        </div>
                    )}
                </div>
                {String(discordBox) == 'true' &&
                <a href={guildData ? guildData.instant_invite : ''} target="_blank" className={'group lg:max-w-[275px] w-full border border-[#6374AC] hover:border-[#97A8E0] rounded-box flex items-center justify-between px-6 py-5 duration-300'} css={'background-image:radial-gradient(circle, rgba(27,43,104,1) 0%, rgba(9,39,78,1) 100%);'}>
                    <div>
                        <span className={'font-light text-sm text-white/70'}>{guildData ? guildData.presence_count : '000'} {t('members-online')}</span>
                        <p className={'font-medium text-white'}>{t('join-our-discord')}</p>
                    </div>
                    <FaDiscord className={'text-[2.5rem] text-white/70 group-hover:text-white duration-300'}/>
                </a>}
            </div>
            {!servers ? (
                <Spinner centered size={'large'} />
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                        {({ items }) =>
                            items.length > 0 ? (
                                <DndContext 
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragEnd={handleDragEnd}
                                >
                                  <SortableContext 
                                    items={sortedServers.map(server => server.uuid)}
                                    strategy={rectSortingStrategy}
                                  >
                                    <div className="grid lg:grid-cols-2 gap-4">
                                      {sortedServers.map((server, index) => (
                                        <SortableServerCard
                                          key={server.uuid}
                                          server={server}
                                          index={index}
                                          renderServerCard={renderServerCard}
                                        />
                                      ))}
                                    </div>
                                  </SortableContext>
                                </DndContext>
                            ) : (
                                <p css={tw`text-center text-sm text-neutral-400 lg:col-span-2 col-span-1`}>
                                    {showOnlyAdmin
                                        ? t('there-are-no-servers')
                                        : t('there-are-no-servers-associated')}
                                </p>
                            )
                        }
                </Pagination>
            )}
        </PageContentBlock>
    );
};