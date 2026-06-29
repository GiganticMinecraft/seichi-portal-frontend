'use client';

import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useController, useWatch } from 'react-hook-form';
import type {
  Control,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

import type { GetFormLabelsResponse } from '@/lib/api-types';

import type { FormEditorValues } from '../_schema/formEditorSchema';

import FormLabelField from './FormLabelField';

const FormSettings = (props: {
  register: UseFormRegister<FormEditorValues>;
  control: Control<FormEditorValues>;
  setValue: UseFormSetValue<FormEditorValues>;
  labelOptions: GetFormLabelsResponse;
}) => {
  const { field: visibilityField } = useController({
    control: props.control,
    name: 'settings.visibility',
  });

  const { field: answerVisibilityField } = useController({
    control: props.control,
    name: 'settings.answer_visibility',
  });

  const acceptancePeriod = useWatch({
    control: props.control,
    name: 'settings.acceptance_period',
  });

  const hasAcceptancePeriod = acceptancePeriod.kind === 'specified';

  const onAcceptancePeriodToggle = (checked: boolean) => {
    props.setValue(
      'settings.acceptance_period',
      checked ? { kind: 'specified', startAt: '', endAt: '' } : { kind: 'none' }
    );
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
        フォーム設定
      </Typography>
      <TextField
        {...props.register('title')}
        label="フォームタイトル"
        required
      />
      <TextField
        {...props.register('description')}
        label="フォームの説明"
        required
        multiline
      />
      <FormLabelField
        control={props.control}
        labelOptions={props.labelOptions}
      />
      <FormControlLabel
        label="回答開始日と回答終了日を設定する"
        control={
          <Checkbox
            checked={hasAcceptancePeriod}
            onChange={(_, checked) => {
              onAcceptancePeriodToggle(checked);
            }}
          />
        }
      />
      {hasAcceptancePeriod && (
        <>
          <TextField
            {...props.register('settings.acceptance_period.startAt')}
            label="回答開始日"
            type="datetime-local"
            helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
          />
          <TextField
            {...props.register('settings.acceptance_period.endAt')}
            label="回答終了日"
            type="datetime-local"
            helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
          />
        </>
      )}
      <TextField
        {...visibilityField}
        value={visibilityField.value}
        label="フォーム公開設定"
        helperText="この設定を公開にすると、一般ユーザーがこのフォームに回答できるようになります。"
        select
        required
      >
        <MenuItem value="PUBLIC">公開</MenuItem>
        <MenuItem value="PRIVATE">非公開</MenuItem>
      </TextField>
      <TextField
        {...answerVisibilityField}
        value={answerVisibilityField.value}
        label="回答の公開設定"
        helperText="この設定を公開にすると、すべての回答が一般ユーザーから確認できるようになります。"
        select
        required
      >
        <MenuItem value="PUBLIC">公開</MenuItem>
        <MenuItem value="PRIVATE">非公開</MenuItem>
      </TextField>
      <FormControlLabel
        label="未ログインユーザーの回答を許可する"
        control={
          <Checkbox {...props.register('settings.allow_temporary_answers')} />
        }
      />
      <TextField
        {...props.register('settings.discord_webhook_url')}
        label="Webhook URL"
        type="url"
      />
      <TextField
        {...props.register('settings.default_answer_title')}
        label="デフォルトの回答タイトル"
        helperText="回答送信時のタイトルを設定します。$<テンプレートキー> で指定の質問の回答を、$username で回答者名をタイトルに埋め込むことができます。例: $username さんの回答"
      />
    </Stack>
  );
};

export default FormSettings;
