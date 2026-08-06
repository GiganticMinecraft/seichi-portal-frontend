'use client';

import PersonOffOutlined from '@mui/icons-material/PersonOffOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useWatch } from 'react-hook-form';
import type { Control, UseFormSetValue } from 'react-hook-form';

import type { GetUserGroupsResponse } from '@/lib/api-types';

import type { FormEditorValues } from '../../_schema/formEditorSchema';

const UNAUTHENTICATED_OPTION_ID = '__unauthenticated__';
const ALL_AUTHENTICATED_OPTION_ID = '__all_authenticated__';

const unauthenticatedOption = {
  id: UNAUTHENTICATED_OPTION_ID,
  name: '未サインインユーザー',
};

const allAuthenticatedOption = {
  id: ALL_AUTHENTICATED_OPTION_ID,
  name: 'ログイン済みユーザー（全員）',
};

const GROUP_DISABLED_BY_UNAUTHENTICATED_TOOLTIP =
  '未サインインユーザーの回答を許可している間は、グループによる制限はできません。';

type GroupOption = GetUserGroupsResponse[number] | typeof unauthenticatedOption;

const AnswerGroupField = (props: {
  control: Control<FormEditorValues>;
  setValue: UseFormSetValue<FormEditorValues>;
  groupOptions: GetUserGroupsResponse;
}) => {
  const answerGroupIds = useWatch({
    control: props.control,
    name: 'settings.answer_group_ids',
  });
  const allowTemporaryAnswers = useWatch({
    control: props.control,
    name: 'settings.allow_temporary_answers',
  });

  const options: GroupOption[] = [unauthenticatedOption, ...props.groupOptions];

  const value: (GroupOption | typeof allAuthenticatedOption)[] = [
    ...(answerGroupIds.length === 0 ? [allAuthenticatedOption] : []),
    ...(allowTemporaryAnswers ? [unauthenticatedOption] : []),
    ...props.groupOptions.filter((group) => answerGroupIds.includes(group.id)),
  ];

  const allAuthenticatedTooltip = allowTemporaryAnswers
    ? GROUP_DISABLED_BY_UNAUTHENTICATED_TOOLTIP
    : 'グループを1つも指定していないため、ログイン済みユーザーは全員回答できます。特定のグループのみに絞るには、上記からグループを追加してください。';

  return (
    <Autocomplete<GroupOption | typeof allAuthenticatedOption, true>
      multiple
      id="settings.answer_group_ids"
      options={options}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      getOptionDisabled={(option) =>
        allowTemporaryAnswers && option.id !== UNAUTHENTICATED_OPTION_ID
      }
      value={value}
      isOptionEqualToValue={(option, current) => option.id === current.id}
      renderOption={(renderProps, option) => {
        const { key, ...optionProps } = renderProps;
        const isUnauthenticated = option.id === UNAUTHENTICATED_OPTION_ID;
        const isDisabled = Boolean(optionProps['aria-disabled']);

        const box = (
          <Box
            {...optionProps}
            key={key}
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              ...(isDisabled && { pointerEvents: 'none', opacity: 0.5 }),
            }}
          >
            {isUnauthenticated && <PersonOffOutlined fontSize="small" />}
            {option.name}
          </Box>
        );

        if (isDisabled) {
          return (
            <Tooltip
              key={key}
              title={GROUP_DISABLED_BY_UNAUTHENTICATED_TOOLTIP}
            >
              {box}
            </Tooltip>
          );
        }

        return box;
      }}
      renderValue={(renderedValue, getItemProps) =>
        renderedValue.map((option, index) => {
          const { key, onDelete, ...itemProps } = getItemProps({ index });
          const isUnauthenticated = option.id === UNAUTHENTICATED_OPTION_ID;
          const isAllAuthenticated = option.id === ALL_AUTHENTICATED_OPTION_ID;

          if (isAllAuthenticated) {
            return (
              <Tooltip key={key} title={allAuthenticatedTooltip}>
                <Chip {...itemProps} label={option.name} variant="outlined" />
              </Tooltip>
            );
          }

          return (
            <Chip
              key={key}
              {...itemProps}
              onDelete={onDelete}
              label={option.name}
              icon={isUnauthenticated ? <PersonOffOutlined /> : undefined}
              color={isUnauthenticated ? 'warning' : 'default'}
              variant="filled"
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="回答を投稿できるユーザーグループ"
          helperText="指定したグループに所属するユーザーのみがこのフォームに回答できるようになります。「未サインインユーザー」を選ぶと、グループによる制限はできなくなり、サインインしていない訪問者も含め全員が回答できるようになります。"
        />
      )}
      onChange={(_event, newValue) => {
        const hasUnauthenticated = newValue.some(
          (option) => option.id === UNAUTHENTICATED_OPTION_ID
        );
        const groupIds = hasUnauthenticated
          ? []
          : newValue
              .filter(
                (option) =>
                  option.id !== UNAUTHENTICATED_OPTION_ID &&
                  option.id !== ALL_AUTHENTICATED_OPTION_ID
              )
              .map((option) => option.id);

        props.setValue('settings.answer_group_ids', groupIds);
        props.setValue('settings.allow_temporary_answers', hasUnauthenticated);
      }}
    />
  );
};

export default AnswerGroupField;
