import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { LuPartyPopper, LuMegaphone, LuInfo, LuCircleAlert, LuTriangleAlert, LuCircleCheck, LuCircleX, LuLifeBuoy, LuFlame } from "react-icons/lu";
import Markdown from 'markdown-to-jsx';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const MyAlert = styled.div<{ $color: string }>`
    ${tw`mx-auto w-full flex items-center gap-x-2 max-w-[1200px] px-4 py-3 mt-4 rounded-component text-gray-100 !border-t-0 !border-r-0 !border-b-0`};
    border-left:var(--radiusInput) solid;
    background-color: ${({ $color }) => `${$color}33`};
    border-color: ${({ $color }) => `${$color}`} !important;

    & > svg{
        font-size: 1.2rem;
    }
`;

const Alert = () => {
    const [isOpen, setIsOpen] = useState(true);

    const announcement = useStoreState((state: ApplicationStore) => state.settings.data!.arix.announcement);
    const announcementColor = useStoreState((state: ApplicationStore) => state.settings.data!.arix.announcementColor);
    const announcementIcon = useStoreState((state: ApplicationStore) => state.settings.data!.arix.announcementIcon);
    const announcementMessage = useStoreState((state: ApplicationStore) => state.settings.data!.arix.announcementMessage);
    const announcementCta = useStoreState((state: ApplicationStore) => state.settings.data!.arix.announcementCta);
    const announcementCtaTitle = useStoreState((state: ApplicationStore) => state.settings.data!.arix.announcementCtaTitle);
    const announcementCtaLink = useStoreState((state: ApplicationStore) => state.settings.data!.arix.announcementCtaLink);
    const announcementDismissable = useStoreState((state: ApplicationStore) => state.settings.data!.arix.announcementDismissable);

    useEffect(() => {
        const announcementKey = `${announcementMessage?.slice(0, 5)}-${announcementMessage?.slice(-5)}`;
        const closedKey = localStorage.getItem('closedAnnouncementKey');

        if (closedKey && closedKey === announcementKey) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
            if (String(announcement) === 'false' || closedKey !== announcementKey) {
                localStorage.removeItem('closedAnnouncementKey');
            }
        }
    }, [announcementMessage, announcement]);

    const handleClose = () => {
        setIsOpen(false);
        const announcementKey = `${announcementMessage?.slice(0, 5)}-${announcementMessage?.slice(-5)}`;
        localStorage.setItem('closedAnnouncementKey', announcementKey);
    };

    return (
        <div className={'px-4'}>
            {String(announcement) === "true" && isOpen &&
            <MyAlert className={'backdrop'} $color={announcementColor}>
                {announcementIcon === 'party-popper'
                    ? <LuPartyPopper />
                    : announcementIcon === 'megaphone'
                    ? <LuMegaphone />
                    : announcementIcon === 'info'
                    ? <LuInfo />
                    : announcementIcon === 'circle-check'
                    ? <LuCircleCheck />
                    : announcementIcon === 'circle-alert'
                    ? <LuCircleAlert />
                    : announcementIcon === 'triangle-alert'
                    ? <LuTriangleAlert />
                    : announcementIcon === 'life-buoy'
                    ? <LuLifeBuoy />
                    : announcementIcon === 'flame'
                    ? <LuFlame />
                    : ''
                }

                <div>
                    <Markdown>{announcementMessage}</Markdown>
                </div>


                <div className='ml-auto flex items-center gap-x-4'>
                    {String(announcementCta) === 'true' &&
                        <>
                            <a
                                href={announcementCtaLink} 
                                className='rounded-full border border-white/40 px-4 py-2 hover:bg-white/20 duration-300'
                            >
                                {announcementCtaTitle}
                            </a>

                            {String(announcementDismissable) === 'true' &&
                                <hr className='w-[1px] h-8 bg-white/20' />
                            }
                        </>
                    }
                    {String(announcementDismissable) === 'true' &&
                        <button className={'p-2 hover:bg-white/20 duration-300 rounded'} onClick={handleClose}>
                            <LuCircleX />
                        </button>
                    }
                </div>
            </MyAlert>
            }
        </div>
    );
};

export default Alert;
