import React from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import Input, { Textarea } from '@/components/elements/Input';
import styled from 'styled-components/macro';
import { useFlashKey } from '@/plugins/useFlash';
import { createSSHKey, useSSHKeys } from '@/api/account/ssh-keys';
import { useTranslation } from 'react-i18next';

interface Values {
    name: string;
    publicKey: string;
}

const CustomTextarea = styled(Textarea)`
    ${tw`h-32`}
`;

export default () => {
    const { t } = useTranslation('arix/account');
    const { clearAndAddHttpError } = useFlashKey('account');
    const { mutate } = useSSHKeys();

    const submit = (values: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearAndAddHttpError();

        createSSHKey(values.name, values.publicKey)
            .then((key) => {
                resetForm();
                mutate((data) => (data || []).concat(key));
            })
            .catch((error) => clearAndAddHttpError(error))
            .then(() => setSubmitting(false));
    };

    return (
        <>
            <Formik
                onSubmit={submit}
                initialValues={{ name: '', publicKey: '' }}
                validationSchema={object().shape({
                    name: string().required(),
                    publicKey: string().required(),
                })}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <SpinnerOverlay visible={isSubmitting} />
                        <FormikFieldWrapper label={t('sshKey.createForm.key-name')} name={'name'} css={tw`mb-6`}>
                            <Field name={'name'} placeholder={t('sshKey.createForm.key-name')} as={Input} />
                        </FormikFieldWrapper>
                        <FormikFieldWrapper
                            label={t('sshKey.createForm.public-key')}
                            name={'publicKey'}
                            description={t('sshKey.createForm.public-key-desc')}
                        >
                            <Field name={'publicKey'} as={CustomTextarea} />
                        </FormikFieldWrapper>
                        <div css={tw`flex justify-end mt-6`}>
                            <Button>{t('sshKey.createForm.save')}</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};
