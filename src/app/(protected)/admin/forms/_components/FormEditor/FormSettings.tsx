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

import FieldLabel from './FieldLabel';
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
    <Stack spacing={0.5}>
      <FieldLabel label="フォームタイトル" required />
      <TextField
        {...register('title')}
        fullWidth
        slotProps={{ htmlInput: { 'aria-label': 'フォームタイトル' } }}
      />
    </Stack>
    <Stack spacing={0.5}>
      <FieldLabel label="フォームの説明" required />
      <TextField
        {...register('description')}
        multiline
        fullWidth
        helperText="Markdown に対応しています。"
        slotProps={{ htmlInput: { 'aria-label': 'フォームの説明' } }}
      />
    </Stack>
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
          <Stack spacing={0.5}>
            <FieldLabel label="回答開始日" />
            <TextField
              {...register('settings.acceptance_period.startAt')}
              type="datetime-local"
              helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
              slotProps={{ htmlInput: { 'aria-label': '回答開始日' } }}
            />
          </Stack>
          <Stack spacing={0.5}>
            <FieldLabel label="回答終了日" />
            <TextField
              {...register('settings.acceptance_period.endAt')}
              type="datetime-local"
              helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
              slotProps={{ htmlInput: { 'aria-label': '回答終了日' } }}
            />
          </Stack>
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
      <Stack spacing={0.5}>
        <FieldLabel label="フォーム公開設定" required />
        <TextField
          {...visibilityField}
          value={visibilityField.value}
          helperText="この設定を公開にすると、一般ユーザーがこのフォームに回答できるようになります。"
          select
          fullWidth
          slotProps={{ select: { 'aria-label': 'フォーム公開設定' } }}
        >
          <MenuItem value="PUBLIC">公開</MenuItem>
          <MenuItem value="PRIVATE">非公開</MenuItem>
        </TextField>
      </Stack>
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
      <Stack spacing={0.5}>
        <FieldLabel label="回答の公開設定" required />
        <TextField
          {...answerVisibilityField}
          value={answerVisibilityField.value}
          helperText="この設定を公開にすると、すべての回答が一般ユーザーから確認できるようになります。"
          select
          fullWidth
          slotProps={{ select: { 'aria-label': '回答の公開設定' } }}
        >
          <MenuItem value="PUBLIC">公開</MenuItem>
          <MenuItem value="PRIVATE">非公開</MenuItem>
        </TextField>
      </Stack>
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
      <Stack spacing={0.5}>
        <FieldLabel label="Webhook URL" />
        <TextField
          {...register('settings.discord_webhook_url')}
          type="url"
          slotProps={{ htmlInput: { 'aria-label': 'Webhook URL' } }}
        />
      </Stack>
      <Stack spacing={0.5}>
        <FieldLabel label="デフォルトの回答タイトル" />
        <TextField
          {...register('settings.default_answer_title')}
          helperText="回答送信時のタイトルを設定します。$<テンプレートキー> で指定の質問の回答を、$username で回答者名を、$form_name でフォームタイトルをタイトルに埋め込むことができます。例: [$form_name] $username さんの回答"
          slotProps={{
            htmlInput: { 'aria-label': 'デフォルトの回答タイトル' },
          }}
        />
      </Stack>
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
