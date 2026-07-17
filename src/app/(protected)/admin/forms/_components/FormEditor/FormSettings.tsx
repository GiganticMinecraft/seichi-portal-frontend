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

import type {
  GetFormLabelsResponse,
  GetUserGroupsResponse,
} from '@/lib/api-types';

import type { FormEditorValues } from '../../_schema/formEditorSchema';

import FormGroupField from './FormGroupField';
import FormLabelField from './FormLabelField';

type FormSettingsProps = {
  register: UseFormRegister<FormEditorValues>;
  control: Control<FormEditorValues>;
  setValue: UseFormSetValue<FormEditorValues>;
  labelOptions: GetFormLabelsResponse;
  groupOptions: GetUserGroupsResponse;
};

const BasicFormSettings = ({
  register,
  control,
  labelOptions,
}: Pick<FormSettingsProps, 'register' | 'control' | 'labelOptions'>) => (
  <>
    <TextField {...register('title')} label="フォームタイトル" required />
    <TextField
      {...register('description')}
      label="フォームの説明"
      required
      multiline
      helperText="Markdown に対応しています。"
    />
    <FormLabelField control={control} labelOptions={labelOptions} />
  </>
);

const AcceptancePeriodSettings = ({
  register,
  control,
  setValue,
}: Pick<FormSettingsProps, 'register' | 'control' | 'setValue'>) => {
  const acceptancePeriod = useWatch({
    control,
    name: 'settings.acceptance_period',
  });

  const hasAcceptancePeriod = acceptancePeriod.kind === 'specified';

  const onAcceptancePeriodToggle = (checked: boolean) => {
    setValue(
      'settings.acceptance_period',
      checked ? { kind: 'specified', startAt: '', endAt: '' } : { kind: 'none' }
    );
  };

  return (
    <>
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
            {...register('settings.acceptance_period.startAt')}
            label="回答開始日"
            type="datetime-local"
            helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
          />
          <TextField
            {...register('settings.acceptance_period.endAt')}
            label="回答終了日"
            type="datetime-local"
            helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
          />
        </>
      )}
    </>
  );
};

const FormVisibilitySettings = ({
  control,
  groupOptions,
}: Pick<FormSettingsProps, 'control' | 'groupOptions'>) => {
  const { field: visibilityField } = useController({
    control,
    name: 'settings.visibility',
  });

  return (
    <>
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
      <FormGroupField
        control={control}
        name="settings.allowed_group_ids"
        label="フォームを閲覧できるユーザーグループ"
        helperText="指定すると、選択したグループに所属するユーザーのみがこのフォームを閲覧・回答できるようになります（公開設定が「公開」の場合に適用されます）。未指定の場合は全員が対象になります。"
        groupOptions={groupOptions}
      />
    </>
  );
};

const AnswerSettings = ({
  register,
  control,
  groupOptions,
}: Pick<FormSettingsProps, 'register' | 'control' | 'groupOptions'>) => {
  const { field: answerVisibilityField } = useController({
    control,
    name: 'settings.answer_visibility',
  });

  return (
    <>
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
      <FormGroupField
        control={control}
        name="settings.answer_group_ids"
        label="回答を投稿・閲覧できるユーザーグループ"
        helperText="指定すると、選択したグループに所属するユーザーのみがこのフォームに回答したり、回答（公開設定が「公開」の場合）を閲覧したりできるようになります。未指定の場合は全員が対象になります。"
        groupOptions={groupOptions}
      />
      <FormControlLabel
        label="未ログインユーザーの回答を許可する"
        control={<Checkbox {...register('settings.allow_temporary_answers')} />}
      />
      <TextField
        {...register('settings.discord_webhook_url')}
        label="Webhook URL"
        type="url"
      />
      <TextField
        {...register('settings.default_answer_title')}
        label="デフォルトの回答タイトル"
        helperText="回答送信時のタイトルを設定します。$<テンプレートキー> で指定の質問の回答を、$username で回答者名をタイトルに埋め込むことができます。例: $username さんの回答"
      />
    </>
  );
};

const FormSettings = (props: FormSettingsProps) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
        フォーム設定
      </Typography>
      <BasicFormSettings
        register={props.register}
        control={props.control}
        labelOptions={props.labelOptions}
      />
      <AcceptancePeriodSettings
        register={props.register}
        control={props.control}
        setValue={props.setValue}
      />
      <FormVisibilitySettings
        control={props.control}
        groupOptions={props.groupOptions}
      />
      <AnswerSettings
        register={props.register}
        control={props.control}
        groupOptions={props.groupOptions}
      />
    </Stack>
  );
};

export default FormSettings;
