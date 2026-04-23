import React, { useEffect, useState } from 'react';
import Modal, { RequiredModalProps } from '@/components/elements/Modal';
import { Field as FormikField, Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { boolean, object, string } from 'yup';
import Field from '@/components/elements/Field';
import useFlash from '@/plugins/useFlash';
import getZones from '@/api/server/subdomains/getZones';
import createSubdomain from '@/api/server/subdomains/createSubdomain';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Button } from '@/components/elements/button/index';
import Select from '@/components/elements/Select';
import tw from 'twin.macro';
import { ServerContext } from '@/state/server';
import getServerAllocations from '@/api/swr/getServerAllocations';
import isEqual from 'react-fast-compare';
import { useDeepCompareEffect } from '@/plugins/useDeepCompareEffect';
import { useTranslation } from 'react-i18next';

interface RequestParameters {
    domain: string;
    subdomain: string;
    allocation: number;
}

const ModalContent = ({ ...props }: RequiredModalProps) => {
    const { t } = useTranslation('arix/server/addons/subdomains');
    const { isSubmitting } = useFormikContext<RequestParameters>();  
    const [zones, setZones] = useState<string[]>([]);
    const { addError, clearFlashes } = useFlash();
    const [loading, setLoading] = useState(true);

    const allocations = ServerContext.useStoreState((state) => state.server.data!.allocations, isEqual);

    useEffect(() => {
        setLoading(!zones.length);
        clearFlashes('domains:create');

        getZones()
            .then((response) => {
                setZones(response.data);
            })
            .catch((error) => {
                addError({ key: 'domains:create', message: error.message });
            })
            .finally(() => {
                setLoading(false); 
            });
    }, []);

    return (
        <Modal {...props} showSpinnerOverlay={isSubmitting}>
            {(!loading) &&
                <Form>
                    <h2 css={tw`font-header text-xl font-medium mb-2 text-gray-50`}>{t('create.create-subdomain')}</h2>
                    <div className={'grid lg:grid-cols-2 items-end'}>
                        <Field name={'subdomain'} label={t('subdomain')} className={'lg:mb-0 lg:!rounded-r-none mb-4'} />
                        {zones.length > 0 && 
                            <FormikField name="domain">
                                {({ field, form }: any) => (
                                    <Select {...field} className={'lg:!rounded-l-none lg!border-l-0'}>
                                        <option value={''} disabled className={'hidden'}>
                                            {t('create.select-a-domain')}
                                        </option>
                                        {zones.map((zone: string, index: number) => (
                                            <option key={index} value={zone}>
                                                .{zone}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </FormikField>
                        }
                    </div>
                    <FormikField name="allocation">
                        {({ field, form }: any) => (
                            <Select {...field} className={'mt-4'}>
                                <option value={0} disabled className={'hidden'}>
                                    {t('create.select-a-allocation')}
                                </option>
                                {allocations.map((allocation) => (
                                    <option key={allocation.id} value={allocation.id}>
                                        {allocation.alias ?? allocation.ip}:{allocation.port} {allocation.isDefault && `(${t('create.primary')})`}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </FormikField>
                    <div css={tw`flex justify-end mt-6`}>
                        <Button type={'submit'} disabled={isSubmitting}>
                            {t('create.create-subdomain')}
                        </Button>
                    </div>
                </Form>
            }
        </Modal>
    );
}


export default () => {
    const { t } = useTranslation('arix/server/addons/subdomains');
    const appendSubdomain = ServerContext.useStoreActions((actions) => actions.subdomains.appendSubdomain);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const [visible, setVisible] = useState(false);
    const allocations = ServerContext.useStoreState((state) => state.server.data!.allocations, isEqual);
    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);
    const { data, error, mutate } = getServerAllocations();

    useDeepCompareEffect(() => {
        if (!data) return;

        setServerFromState((state) => ({ ...state, allocations: data }));
    }, [data]);

    useEffect(() => {
        mutate(allocations);
    }, []);

    useEffect(() => {
        clearFlashes('domains:create');
    }, [visible]);

    const submit = (values: RequestParameters, { setSubmitting }: FormikHelpers<RequestParameters>) => {
        clearFlashes('domains:create');
        createSubdomain(id, values)
            .then((domain) => {
                const allocation = data?.find((allocation) => allocation.id === Number(values.allocation)) ?? null;
                
                appendSubdomain({ 
                    key: domain.id, 
                    domain: {
                        full_domain: `${values.subdomain.toLocaleLowerCase()}.${values.domain}`,
                        ip: allocation?.alias ?? allocation?.ip?.toString() ?? '0', 
                        port: allocation?.port ?? 0, 
                    }
                });
                setVisible(false);
            })
            .catch((error) => {
                clearAndAddHttpError({ key: 'domains:create', error });
                setSubmitting(false);
            });
    };

    return (
        <>
            <FlashMessageRender byKey={'domains:create'} css={tw`mb-4`} />
            {visible && (
                <Formik
                    onSubmit={submit}
                    initialValues={{ domain: '', subdomain: '', allocation: 0 }}
                    validationSchema={object().shape({
                        domain: string().max(200),
                        subdomain: string().max(200)
                    })}
                >
                    <ModalContent appear visible={visible} onDismissed={() => setVisible(false)} />
                </Formik>
            )}
            <Button css={tw`w-full sm:w-auto`} onClick={() => setVisible(true)}>
                {t('create.create-subdomain')}
            </Button>
        </>
    );
};