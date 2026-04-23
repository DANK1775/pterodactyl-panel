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
import { KeyIcon, AtSymbolIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';


interface Values {
    email: string;
    password: string;
}

const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required('You must provide your current account password.'),
});

export default () => {
    const { t } = useTranslation('arix/account');
    const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
    const updateEmail = useStoreActions((state: Actions<ApplicationStore>) => state.user.updateUserEmail);

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const submit = (values: Values, { resetForm, setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('account:email');

        updateEmail({ ...values })
            .then(() =>
                addFlash({
                    type: 'success',
                    key: 'account:email',
                    message: t('update-email.isUpdated'),
                })
            )
            .catch((error) =>
                addFlash({
                    type: 'error',
                    key: 'account:email',
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
        <div className={'px-6 py-5'}>
            <p className={'font-medium text-gray-300 mb-5'}>{t('update-email.update')}</p>
            <Formik onSubmit={submit} validationSchema={schema} initialValues={{ email: user!.email, password: '' }}>
                    {({ isSubmitting, isValid }) => (
                        <React.Fragment>
                            <SpinnerOverlay size={'large'} visible={isSubmitting} />
                            <Form css={tw`m-0`}>
                                <Field 
                                    id={'current_email'} 
                                    icon={AtSymbolIcon} 
                                    type={'email'} 
                                    name={'email'} 
                                    className={'privacy-blur'}
                                    label={t('update-email.email')}
                                />
                                <div css={tw`mt-6`}>
                                    <Field
                                        icon={KeyIcon}
                                        id={'confirm_password'}
                                        type={'password'}
                                        name={'password'}
                                        placeholder={t('update-email.confirm')}
                                        label={t('update-email.confirm')}
                                    />
                                </div>
                                <div css={tw`mt-6 text-right`}>
                                    <Button disabled={isSubmitting || !isValid}>{t('update-email.update')}</Button>
                                </div>
                            </Form>
                        </React.Fragment>
                    )}
            </Formik>
        </div>
    );
};
