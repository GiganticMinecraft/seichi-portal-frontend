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
import { useController, useFormState, useWatch } from 'react-hook-form';
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
import { answerViewAudience } from './answerViewAudience';
import AnswerViewAudienceField from './AnswerViewAudienceField';
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
}: Pick<FormSettingsProps, 'register' | 'control' | 'labelOptions'>) => {
  const { errors } = useFormState({ control });

  return (
    <>
      <Stack spacing={0.5}>
        <FieldLabel label="フォームタイトル" required />
        <TextField
          {...register('title')}
          fullWidth
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          slotProps={{ htmlInput: { 'aria-label': 'フォームタイトル' } }}
        />
      </Stack>
      <Stack spacing={0.5}>
        <FieldLabel label="フォームの説明" required />
        <TextField
          {...register('description')}
          multiline
          fullWidth
          error={Boolean(errors.description)}
          helperText={
            errors.description?.message ?? 'Markdown に対応しています。'
          }
          slotProps={{ htmlInput: { 'aria-label': 'フォームの説明' } }}
        />
      </Stack>
      <FormLabelField control={control} labelOptions={labelOptions} />
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
      {!isPrivate && (
        <FormGroupField
          control={control}
          name="settings.allowed_group_ids"
          label="フォームを閲覧できるユーザーグループ"
          helperText="指定すると、選択したグループに所属するユーザーのみがこのフォームを閲覧・回答できるようになります。未指定の場合は全員が対象になります。"
          groupOptions={groupOptions}
        />
      )}
    </>
  );
};

const AcceptancePeriodSettings = ({
  control,
  setValue,
}: Pick<FormSettingsProps, 'control' | 'setValue'>) => {
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

  const { field: startAtField, fieldState: startAtFieldState } = useController({
    control,
    name: 'settings.acceptance_period.startAt',
  });
  const { field: endAtField, fieldState: endAtFieldState } = useController({
    control,
    name: 'settings.acceptance_period.endAt',
  });

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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <FieldLabel label="回答開始日" required />
            <TextField
              {...startAtField}
              type="datetime-local"
              fullWidth
              error={Boolean(startAtFieldState.error)}
              helperText={startAtFieldState.error?.message}
              slotProps={{ htmlInput: { 'aria-label': '回答開始日' } }}
            />
          </Stack>
          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <FieldLabel label="回答終了日" required />
            <TextField
              {...endAtField}
              type="datetime-local"
              fullWidth
              error={Boolean(endAtFieldState.error)}
              helperText={endAtFieldState.error?.message}
              slotProps={{ htmlInput: { 'aria-label': '回答終了日' } }}
            />
          </Stack>
        </Stack>
      )}
    </>
  );
};

const DefaultAnswerTitleField = ({
  register,
}: Pick<FormSettingsProps, 'register'>) => (
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
);

const AnswerVisibilitySettings = ({
  control,
  setValue,
  groupOptions,
}: Pick<FormSettingsProps, 'control' | 'setValue' | 'groupOptions'>) => {
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

  const canHideAuthor = answerVisibility !== 'PRIVATE';

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
      <AnswerViewAudienceField
        members={answerViewAudience(
          answerVisibility,
          answerGroupIds,
          groupOptions
        )}
      />
      {canHideAuthor && (
        <Stack spacing={0}>
          <FormControlLabel
            label="回答者を隠して公開する"
            control={
              <Checkbox
                checked={hideAuthor}
                onChange={(_, checked) => {
                  setValue('settings.hide_author', checked);
                }}
              />
            }
          />
          <Typography variant="caption" color="textSecondary">
            一般ユーザーには回答者を匿名として表示します。管理者には従来どおり回答者情報が表示されます。
          </Typography>
        </Stack>
      )}
    </>
  );
};

const AnswerResponseVisibilitySettings = ({
  control,
  setValue,
}: Pick<FormSettingsProps, 'control' | 'setValue'>) => {
  const answerResponseVisibility = useWatch({
    control,
    name: 'settings.answer_response_visibility',
  });
  const isRestricted = answerResponseVisibility === 'RESTRICTED';

  return (
    <Stack spacing={0}>
      <FormControlLabel
        label="回答者本人には対応状況・ラベルなどの詳細を非公開にする"
        control={
          <Checkbox
            checked={isRestricted}
            onChange={(_, checked) => {
              setValue(
                'settings.answer_response_visibility',
                checked ? 'RESTRICTED' : 'FULL'
              );
            }}
          />
        }
      />
      <Typography variant="caption" color="textSecondary">
        回答者本人が自分の回答を閲覧する際、対応状況・ラベル・投稿者・回答日時を隠して回答内容のみ表示します。管理者には従来どおりすべて表示されます。
      </Typography>
    </Stack>
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

      <SectionHeading label="フォームの公開設定" />
      <FormVisibilitySettings
        control={props.control}
        groupOptions={props.groupOptions}
      />

      <SectionHeading label="回答設定" />
      <AcceptancePeriodSettings
        control={props.control}
        setValue={props.setValue}
      />
      <DefaultAnswerTitleField register={props.register} />
      <AnswerGroupField
        control={props.control}
        setValue={props.setValue}
        groupOptions={props.groupOptions}
      />
      <AnswerVisibilitySettings
        control={props.control}
        setValue={props.setValue}
        groupOptions={props.groupOptions}
      />
      <AnswerResponseVisibilitySettings
        control={props.control}
        setValue={props.setValue}
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
