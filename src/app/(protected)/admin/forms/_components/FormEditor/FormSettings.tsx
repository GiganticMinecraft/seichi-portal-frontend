'use client';

import {
  Checkbox,
  Divider,
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

import WebhookUrlField from '@/app/(protected)/admin/_components/WebhookUrlField';
import FieldLabel from '@/app/_components/FieldLabel';
import type {
  GetFormLabelsResponse,
  GetUserGroupsResponse,
} from '@/lib/api-types';

import type { FormEditorValues } from '../../_schema/formEditorSchema';

import AnswerGroupField from './AnswerGroupField';
import FormGroupField from './FormGroupField';
import FormLabelField from './FormLabelField';

type FormSettingsProps = {
  register: UseFormRegister<FormEditorValues>;
  control: Control<FormEditorValues>;
  setValue: UseFormSetValue<FormEditorValues>;
  labelOptions: GetFormLabelsResponse;
  groupOptions: GetUserGroupsResponse;
  discordWebhookEnabled: boolean;
  webhookSectionResetKey?: number;
};

const SectionHeading = ({ label }: { label: string }) => (
  <Stack spacing={1}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
      {label}
    </Typography>
    <Divider />
  </Stack>
);

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

const FormVisibilitySettings = ({
  control,
  groupOptions,
}: Pick<FormSettingsProps, 'control' | 'groupOptions'>) => {
  const { field: visibilityField } = useController({
    control,
    name: 'settings.visibility',
  });

  const visibility = useWatch({ control, name: 'settings.visibility' });
  const isPrivate = visibility === 'PRIVATE';

  return (
    <>
      <Stack spacing={0.5}>
        <FieldLabel label="フォーム公開設定（誰が回答できるか）" required />
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
        helperText={
          isPrivate
            ? 'フォーム公開設定が「非公開」のため、この設定は適用されません。'
            : '指定すると、選択したグループに所属するユーザーのみがこのフォームを閲覧・回答できるようになります。未指定の場合は全員が対象になります。'
        }
        groupOptions={groupOptions}
        disabled={isPrivate}
      />
    </>
  );
};

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

const AnswerSettings = ({
  register,
  control,
  setValue,
  groupOptions,
}: Pick<
  FormSettingsProps,
  'register' | 'control' | 'setValue' | 'groupOptions'
>) => {
  const hideAuthor = useWatch({
    control,
    name: 'settings.hide_author',
  });
  const { field: answerVisibilityField } = useController({
    control,
    name: 'settings.answer_visibility',
  });

  const answerVisibility = useWatch({
    control,
    name: 'settings.answer_visibility',
  });
  const answerGroupIds = useWatch({
    control,
    name: 'settings.answer_group_ids',
  });

  const hideAuthorHasNoEffect =
    answerVisibility === 'PRIVATE' && answerGroupIds.length === 0;

  return (
    <>
      <Stack spacing={0.5}>
        <FieldLabel
          label="回答の公開設定（回答結果を誰が見られるか）"
          required
        />
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
      <Stack spacing={0}>
        <FormControlLabel
          label="回答者を隠して公開する"
          control={
            <Checkbox
              checked={hideAuthor}
              onChange={(_, checked) => {
                setValue('settings.hide_author', checked);
              }}
              disabled={hideAuthorHasNoEffect}
            />
          }
        />
        <Typography variant="caption" color="textSecondary">
          {hideAuthorHasNoEffect
            ? '回答の公開設定が「非公開」で、回答を閲覧できるユーザーグループも指定されていないため、この設定は適用されません（管理者以外は回答を閲覧できません）。'
            : '一般ユーザーには回答者を匿名として表示します。管理者には従来どおり回答者情報が表示されます。'}
        </Typography>
      </Stack>
      <AnswerGroupField
        control={control}
        setValue={setValue}
        groupOptions={groupOptions}
      />
      <Stack spacing={0.5}>
        <FieldLabel label="デフォルトの回答タイトル" />
        <TextField
          {...register('settings.default_answer_title')}
          helperText="回答送信時のタイトルを設定します。$テンプレートキー で指定の質問の回答を、$username で回答者名を、$form_name でフォームタイトルをタイトルに埋め込むことができます。例: [$form_name] $username さんの回答"
          slotProps={{
            htmlInput: { 'aria-label': 'デフォルトの回答タイトル' },
          }}
        />
      </Stack>
    </>
  );
};

const NotificationSettings = ({
  control,
  discordWebhookEnabled,
}: Pick<FormSettingsProps, 'control' | 'discordWebhookEnabled'>) => {
  const { field: urlField } = useController({
    control,
    name: 'settings.discord_webhook_url',
  });
  const { field: disabledField } = useController({
    control,
    name: 'settings.discord_webhook_disabled',
  });

  return (
    <WebhookUrlField
      enabled={discordWebhookEnabled}
      value={urlField.value}
      onChange={urlField.onChange}
      isPendingDelete={disabledField.value}
      onPendingDeleteChange={disabledField.onChange}
    />
  );
};

const FormSettings = (props: FormSettingsProps) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
        フォーム設定
      </Typography>

      <SectionHeading label="基本情報" />
      <BasicFormSettings
        register={props.register}
        control={props.control}
        labelOptions={props.labelOptions}
      />

      <SectionHeading label="公開設定" />
      <FormVisibilitySettings
        control={props.control}
        groupOptions={props.groupOptions}
      />

      <SectionHeading label="回答設定" />
      <AcceptancePeriodSettings
        register={props.register}
        control={props.control}
        setValue={props.setValue}
      />
      <AnswerSettings
        register={props.register}
        control={props.control}
        setValue={props.setValue}
        groupOptions={props.groupOptions}
      />

      <SectionHeading label="通知設定" />
      <NotificationSettings
        key={props.webhookSectionResetKey ?? 0}
        control={props.control}
        discordWebhookEnabled={props.discordWebhookEnabled}
      />
    </Stack>
  );
};

export default FormSettings;
