'use client';

import { Add, DragIndicator } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
} from '@mui/material';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { z } from 'zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { fromStringToJSTDateTime } from '@/generic/DateFormatter';
import { useFormEditActions } from '@/hooks/useFormEditActions';
import { toFormUpdateBody } from '../../../_lib/formRequestBuilders';

const questionTypeSchema = z.enum(['Text', 'SingleChoice', 'MultipleChoice']);
const formVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE']);
import FormSettings from './FormSettings';
import QuestionComponent from './Question';
import type { Form } from '../_schema/editFormSchema';
import type { GetFormLabelsResponse, GetFormResponse } from '@/lib/api-types';

const SortableQuestionWrapper = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <CardContent ref={setNodeRef} style={style}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <IconButton size="small" {...attributes} {...listeners}>
          <DragIndicator fontSize="small" />
        </IconButton>
        <Box sx={{ flex: 1 }}>{children}</Box>
      </Stack>
    </CardContent>
  );
};

const FormEditForm = (props: {
  form: GetFormResponse;
  labelOptions: GetFormLabelsResponse;
}) => {
  const start_at =
    props.form.settings.answer_settings?.response_period?.start_at;
  const end_at = props.form.settings.answer_settings?.response_period?.end_at;

  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<Form>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      ...props.form,
      questions: props.form.questions.map((question) => ({
        id: question.id ?? null,
        title: question.title,
        description: question.description ?? '',
        question_type: (() => {
          const result = questionTypeSchema.safeParse(question.question_type);
          return result.success ? result.data : 'Text';
        })(),
        is_required: question.is_required,
        position: question.position,
        template_key: question.template_key,
        choices:
          'choices' in question
            ? (question as { choices: { label: string }[] }).choices.map(
                (choice) => ({ choice: choice.label })
              )
            : [],
      })),
      settings: {
        has_response_period: start_at && end_at ? true : false,
        response_period: {
          start_at: start_at ? fromStringToJSTDateTime(start_at) : null,
          end_at: end_at ? fromStringToJSTDateTime(end_at) : null,
        },
        webhook_url: props.form.settings.webhook_url ?? null,
        visibility: (() => {
          const result = formVisibilitySchema.safeParse(
            props.form.settings.visibility
          );
          return result.success ? result.data : 'PUBLIC';
        })(),
        default_answer_title:
          props.form.settings.answer_settings?.default_answer_title ?? null,
        answer_visibility: (() => {
          const result = formVisibilitySchema.safeParse(
            props.form.settings.answer_settings?.visibility
          );
          return result.success ? result.data : 'PUBLIC';
        })(),
      },
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    keyName: 'reacthookform-id',
    name: 'questions',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(
        (field) => field['reacthookform-id'] === active.id
      );
      const newIndex = fields.findIndex(
        (field) => field['reacthookform-id'] === over.id
      );
      move(oldIndex, newIndex);
    }
  };

  const hasResponsePeriod = useWatch({
    control,
    name: 'settings.has_response_period',
    defaultValue: start_at && end_at ? true : false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { updateForm } = useFormEditActions(props.form.id);

  const onSubmit = async (data: Form) => {
    const body = toFormUpdateBody(data, true);

    // edit 固有: 既存質問のみ id を保持、新規は null
    if (body.questions) {
      body.questions = body.questions.map((question, index) => ({
        ...question,
        id: data.questions[index]?.id ?? null,
      }));
    }

    const result = await updateForm(body);

    if (!result.ok) {
      setError('root', {
        type: 'manual',
        message: 'フォームの更新に失敗しました。',
      });
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={10}>
        <Container component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <FormSettings
                  register={register}
                  control={control}
                  has_response_period={hasResponsePeriod}
                  formId={props.form.id}
                  labelOptions={props.labelOptions}
                  currentLabels={props.form.labels}
                />
              </CardContent>
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={fields.map((field) => field['reacthookform-id'])}
                  strategy={verticalListSortingStrategy}
                >
                  {fields.map((field, index) => (
                    <SortableQuestionWrapper
                      key={field['reacthookform-id']}
                      id={field['reacthookform-id']}
                    >
                      <QuestionComponent
                        control={control}
                        register={register}
                        removeQuestion={remove}
                        question={{
                          id: field.id,
                          title: field.title,
                          description: field.description,
                          question_type: field.question_type,
                          is_required: field.is_required,
                          choices: field.choices.map((choice) => choice.choice),
                          position: field.position,
                          template_key: field.template_key,
                        }}
                        index={index}
                      />
                    </SortableQuestionWrapper>
                  ))}
                </SortableContext>
              </DndContext>
            </Card>
            {errors.root && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}
            {isSubmitted && (
              <Alert severity="success">フォームの編集に成功しました。</Alert>
            )}
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              設定内容を保存
            </Button>
          </Stack>
        </Container>
      </Grid>
      <Grid size={2}>
        <Card sx={{ position: 'fixed' }}>
          <CardContent>
            <Button
              type="button"
              aria-label="質問の追加"
              onClick={() => {
                append({
                  id: null,
                  title: '',
                  description: '',
                  question_type: 'Text',
                  choices: [],
                  is_required: false,
                  position: 0,
                  template_key: '',
                });
              }}
              endIcon={<Add />}
            >
              質問の追加
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FormEditForm;
