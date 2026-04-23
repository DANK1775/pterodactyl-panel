import * as React from 'react';
import { useStoreState } from 'easy-peasy';
import Md5 from 'md5';
import { ApplicationStore } from '@/state';
import Avatar from '@/components/Avatar';

interface Props{
    email?: string;
    user?: string;
    uuid?: string;
    width?: string;
    rounded?: string;
}

export default ({ email, user, uuid, width, rounded }: Props) => {
    const profileType = useStoreState((state: ApplicationStore) => state.settings.data!.arix.profileType);
    const username = useStoreState((state) => state.user.data?.username);
    const useremail = useStoreState(state => state.user.data?.email);

    return (
        profileType === 'boring'
        ? <div className={`${rounded ? rounded : 'rounded-full'} overflow-hidden flex items-center`} css={`width:${width ? width : '32px'};`}>{uuid ? <Avatar name={uuid} /> : <Avatar.User />}</div>
        : profileType === 'gravatar'
        ? <img src={`https://www.gravatar.com/avatar/${Md5(String(email ? email : useremail))}`} width={width ? width : '32px'} className={rounded ? rounded : 'rounded-full'} alt='Gravatar' />
        : profileType === 'avataaars'
        ? <img src={`https://api.dicebear.com/7.x/big-ears-neutral/svg?seed=${user ? user : username}`} width={width ? width : '32px'} className={rounded ? rounded : 'rounded-full'} alt='Dicebear Avatar' />
        : profileType === 'bottts'
        ? <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user ? user : username}`} width={width ? width : '32px'} className={rounded ? rounded : 'rounded-full'} alt='Dicebear Avatar' />
        : profileType === 'identicon'
        ? <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user ? user : username}`} width={width ? width : '32px'} className={rounded ? rounded : 'rounded-full'} alt='Dicebear Avatar' />
        : profileType === 'initials'
        ? <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user ? user : username}`} width={width ? width : '32px'} className={rounded ? rounded : 'rounded-full'} alt='Dicebear Avatar' />
        : <></>
    );
};
