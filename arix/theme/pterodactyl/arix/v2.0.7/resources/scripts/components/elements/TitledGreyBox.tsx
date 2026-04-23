import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div className={`rounded-box bg-neutral-700 backdrop ${className ? className : ''}`}>
        <div css={tw`px-6 pt-5 font-medium text-gray-300`}>
            {typeof title === 'string' ? (
                <p className={'font-medium text-gray-300'}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-neutral-300`} />}
                    {title}
                </p>
            ) : (
                title
            )}
        </div>
        <div css={tw`px-6 py-5`}>{children}</div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
