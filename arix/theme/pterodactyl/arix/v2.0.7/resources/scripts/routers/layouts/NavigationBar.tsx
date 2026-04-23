import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import ClientDropdown from '@/routers/layouts/ClientDropdown';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import ServerSelector from '@/components/elements/ServerSelector';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

import { 
    HiOutlineUserCircle, HiOutlineServer, HiOutlineSupport,
    HiUserCircle, HiServer, HiSupport
 } from "react-icons/hi";
import { LuCircleUser, LuServer, LuLifeBuoy } from "react-icons/lu";
import {
    RiAccountCircle2Line, RiServerLine, RiLifebuoyLine,
    RiAccountCircle2Fill, RiServerFill, RiLifebuoyFill
} from "react-icons/ri";

import { FaDiscord } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

interface Props {
    children?: React.ReactNode;
}
const MobileLinks = styled.div`
    ${tw`flex flex-col gap-5 mb-2 mt-3`};

    & > div{
        ${tw`flex flex-col gap-1`};

        & > span{
            ${tw`text-sm text-gray-300`};
        }

        & > a{
            ${tw`flex items-center gap-x-1 text-gray-200 duration-300 py-1`};

            & > svg{
                ${tw`text-gray-300 duration-300 w-5`};
            }

            &:hover,
            &:focus,
            &.active{
                ${tw`text-gray-50`};

                & > svg{
                    ${tw`text-arix`}
                }
            }
        }
    }
`;
const RightNavigation = styled.div`
    ${tw`lg:flex items-center gap-x-5 hidden`}

    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center no-underline text-neutral-200 py-2 cursor-pointer transition-all duration-150 gap-x-1`};

        &:active,
        &:hover {
            ${tw`text-neutral-100`};
        }

        & > svg{
            ${tw`w-5`}
        }
    }
`;

export default ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [guildData, setGuildData] = useState<{ instant_invite: string } | null>(null);

    const { t } = useTranslation(['arix/navigation']);

    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const layout = useStoreState((state: ApplicationStore) => state.settings.data!.arix.layout);
    const logo = useStoreState((state: ApplicationStore) => state.settings.data!.arix.logo);
    const logoLight = useStoreState((state: ApplicationStore) => state.settings.data!.arix.logoLight);
    const logoHeight = useStoreState((state: ApplicationStore) => state.settings.data!.arix.logoHeight);
    const fullLogo = useStoreState((state: ApplicationStore) => state.settings.data!.arix.fullLogo);
    const searchComponent = useStoreState((state: ApplicationStore) => state.settings.data!.arix.searchComponent);
    const discord = useStoreState((state: ApplicationStore) => state.settings.data!.arix.discord);
    const support = useStoreState((state: ApplicationStore) => state.settings.data!.arix.support);
    const icon = useStoreState((state: ApplicationStore) => state.settings.data!.arix.icon);

    const darkMode = localStorage.getItem('darkMode') === 'true';

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

    useEffect(() => {
        isOpen ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden');
    }, [isOpen]);

    return (
        <>
        <div className={`w-full px-4 overflow-x-auto !overflow-visible z-20 relative ${layout == 3 ? 'bg-gray-700 backdrop !border-0' : ''}`}>
            <div className={`mx-auto w-full flex items-center justify-between max-w-[1200px] py-2`}>
                <div className="flex gap-x-10 items-center">
                    {layout == 3 &&
                    <div className={'lg:flex hidden gap-x-2 items-center'}>
                        <Link to={'/'} className='flex gap-x-2 items-center font-semibold text-lg text-gray-50 py-2'>
                            <img src={darkMode ? logoLight : logo} alt={name + 'logo'} css={`height:${logoHeight}px;`} />
                            {String(fullLogo) === 'false' && name}
                        </Link>
                    </div>
                    }
                    <div className={'lg:hidden flex gap-x-2 items-center'}>
                        <Link to={'/'} className='flex gap-x-2 items-center font-semibold text-lg text-gray-50 py-2'>
                            <img src={darkMode ? logoLight : logo} alt={name + 'logo'} css={`height:${logoHeight}px;`} />
                            {String(fullLogo) === 'false' && name}
                        </Link>
                    </div>
                    <div className={'sm:block hidden'}>
                        {searchComponent == 1  
                        ? <ServerSelector />
                        : <SearchContainer /> }
                    </div>
                </div>
                <RightNavigation>
                    {discord && <a href={guildData?.instant_invite}><FaDiscord /> Discord</a>}
                    {support && 
                        <a href={support}>
                            {icon === 'heroicons' ?
                                <HiOutlineSupport className={'text-lg'} />
                                : icon === 'heroiconsFilled' ?
                                    <HiSupport className={'text-lg'} />
                                    : icon === 'lucide' ?
                                        <LuLifeBuoy className={'text-lg'} />
                                        : icon === 'remixicon' ?
                                            <RiLifebuoyLine className={'text-lg'} />
                                            :
                                            <RiLifebuoyFill className={'text-lg'} />
                            }
                            {t`supportcenter`}
                        </a>
                    }
                    {layout == 3 && <ClientDropdown />}
                </RightNavigation>
                <button onClick={() => setIsOpen((isOpen) => !isOpen)} className='lg:hidden p-2 bg-secondary-200 border border-secondary-100 rounded'>
                    <MenuIcon className={'w-5'} />
                </button>
            </div>
        </div>
        <div className={`fixed top-0 ${isOpen ? 'left-0' : '-left-full'} duration-300 h-full w-full bg-gray-700 z-[99] backdrop-blur-xl px-4 py-2 flex flex-col overflow-y-auto text-xl`}>
            <div className={'flex justify-between items-center'}>
                <div className={'flex gap-x-2 items-center'} onClick={() => setIsOpen((isOpen) => !isOpen)}>
                    <Link to={'/'} className='flex gap-x-2 items-center font-semibold text-lg text-gray-50 py-2'>
                        <img src={darkMode ? logoLight : logo} alt={name + 'logo'} css={`height:${logoHeight}px;`} />
                        {String(fullLogo) === 'false' && name}
                    </Link>
                </div>
                <button onClick={() => setIsOpen((isOpen) => !isOpen)} className='p-2 bg-secondary-200 border border-secondary-100 rounded'>
                    <XIcon className={'w-5'} />
                </button>
            </div>
            <MobileLinks onClick={() => setIsOpen((isOpen) => !isOpen)}>
                <div>
                    <NavLink to={'/'} exact>
                        {icon === 'heroicons' ?
                            <HiOutlineServer />
                            : icon === 'heroiconsFilled' ?
                                <HiServer />
                                : icon === 'lucide' ?
                                    <LuServer />
                                    : icon === 'remixicon' ?
                                        <RiServerLine />
                                        :
                                        <RiServerFill />
                        }
                        {t`servers`}
                    </NavLink>
                    <NavLink to={'/account'} exact>
                        {icon === 'heroicons' ?
                            <HiOutlineUserCircle />
                            : icon === 'heroiconsFilled' ?
                                <HiUserCircle />
                                : icon === 'lucide' ?
                                    <LuCircleUser />
                                    : icon === 'remixicon' ?
                                        <RiAccountCircle2Line />
                                        :
                                        <RiAccountCircle2Fill />
                        }
                        {t`account`}
                    </NavLink>
                </div>
                {children}
            </MobileLinks>
            <div className={'mt-auto'}>
                <ClientDropdown sideBar={true}/>
            </div>
        </div>
        </>
    );
};
