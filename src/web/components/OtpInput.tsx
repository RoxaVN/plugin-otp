import { Button, TextInput, TextInputProps } from '@mantine/core';
import { ApiError, useApi } from '@roxavn/core/web';
import { useEffect, useState } from 'react';

import { webModule } from '../module.js';
import { otpApi } from '../../base/index.js';

export function OtpInput({
  value,
  ...props
}: TextInputProps & { otp: { subject: string; type: string } }) {
  const { t } = webModule.useTranslation();
  const [countdown, setCountdown] = useState(0);
  const { data, error, loading, fetcher } = useApi(otpApi.create, undefined, {
    fetchOnMount: false,
  });

  useEffect(() => {
    if (data?.cooldown) {
      setCountdown(Math.floor(data.cooldown / 1000));
    }
  }, [data]);

  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
  }, [countdown]);

  return (
    <TextInput
      {...props}
      // fix warning "a component is changing an uncontrolled input to be controlled"
      value={value || ''}
      error={error ? <ApiError error={error} /> : props.error}
      rightSectionWidth={150}
      rightSection={
        <Button
          disabled={countdown > 0 || loading}
          onClick={() => fetcher(props.otp)}
          w={150}
        >
          {countdown > 0
            ? t('sendOtpWithCountdown', { countdown })
            : t('sendOtp')}
        </Button>
      }
    />
  );
}
