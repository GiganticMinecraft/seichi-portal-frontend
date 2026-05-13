'use client';

import { Box, Stack, Tab, Tabs } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import CreateLabelField from '@/app/(authed)/_components/CreateLabelField';
import Labels from '@/app/(authed)/_components/Labels';
import type {
  GetAnswerLabelsResponse,
  GetFormLabelsResponse,
} from '@/lib/api-types';

type TabValue = 'forms' | 'answers';

const isTabValue = (value: string | null): value is TabValue =>
  value === 'forms' || value === 'answers';

const LabelsTabs = (props: {
  formLabels: GetFormLabelsResponse;
  answerLabels: GetAnswerLabelsResponse;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab: TabValue = useMemo(() => {
    const tab = searchParams.get('tab');
    return isTabValue(tab) ? tab : 'forms';
  }, [searchParams]);

  const handleChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          aria-label="ラベル種類の切り替え"
        >
          <Tab label="フォーム用" value="forms" />
          <Tab label="回答用" value="answers" />
        </Tabs>
      </Box>
      {currentTab === 'forms' ? (
        <Stack spacing={2}>
          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <CreateLabelField labelType="forms" />
          </Stack>
          <Labels labels={props.formLabels} labelType="forms" />
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <CreateLabelField labelType="answers" />
          </Stack>
          <Labels labels={props.answerLabels} labelType="answers" />
        </Stack>
      )}
    </Stack>
  );
};

export default LabelsTabs;
