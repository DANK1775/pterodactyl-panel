import React from 'react';
import { Actions, State, useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Field from '@/components/elements/Field';
import { httpErrorToHuman } from '@/api/http';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { useTranslation } from 'react-i18next';

interface Values {
    username: string;
    firstName: string;
    lastName: string;
}

const schema = Yup.object().shape({
    username: Yup.string().required('You must provide your username.'),
    firstName: Yup.string().required('You must provide your first name.'),
    lastName: Yup.string().required('You must provide your last name.'),
});

export default () => {
    const { t } = useTranslation('arix/account');
    const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
    const updateProfile = useStoreActions((state: Actions<ApplicationStore>) => state.user.updateUserProfile);

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const submit = (values: Values, { resetForm, setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('account:profile');

        updateProfile({ ...values })
            .then(() =>
                addFlash({
                    type: 'success',
                    key: 'account:profile',
                    message: t('profile.updated-success'),
                })
            )
            .catch((error) =>
                addFlash({
                    type: 'error',
                    key: 'account:profile',
                    title: 'Error',
                    message: httpErrorToHuman(error),
                })
            )
            .then(() => {
                resetForm();
                setSubmitting(false);
            });
    };

    return (
        <TitledGreyBox title={t('profile.update-profile')}>
            <React.Fragment>
                <Formik onSubmit={submit} validationSchema={schema} initialValues={{ username: user!.username, firstName: user!.firstName, lastName: user!.lastName }}>
                        {({ isSubmitting, isValid }) => (
                            <React.Fragment>
                                <SpinnerOverlay size={'large'} visible={isSubmitting} />
                                <Form css={tw`m-0`}>
                                    <div className='grid lg:grid-cols-2 gap-4 mb-6'>
                                        <Field 
                                            id={'firstName'}
                                            type={'text'} 
                                            name={'firstName'} 
                                            className={'privacy-blur'}
                                            label={t('profile.first-name')}
                                        />
                                        <Field 
                                            id={'lastName'}
                                            type={'text'} 
                                            name={'lastName'} 
                                            className={'privacy-blur'}
                                            label={t('profile.last-name')}
                                        />
                                    </div>
                                    <Field 
                                        id={'username'}
                                        type={'text'} 
                                        name={'username'} 
                                        className={'privacy-blur'}
                                        label={t('profile.username')}
                                    />
                                    <div css={tw`mt-6 text-right`}>
                                        <Button disabled={isSubmitting || !isValid}>{t('profile.update-profile')}</Button>
                                    </div>
                                </Form>
                            </React.Fragment>
                        )}
                </Formik>
            </React.Fragment>
        </TitledGreyBox>
    );
};
