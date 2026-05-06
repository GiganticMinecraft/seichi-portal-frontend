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
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useFormEditActions } from '@/hooks/useFormEditActions';
import { useFormLabelActions } from '@/hooks/useFormLabelActions';
import {
  fromFormResponseToEditorValues,
  toFormUpdateBody,
} from '../../../_lib/formRequestBuilders';
import { adminFormFieldSx } from '../../../_components/adminFormFieldSx';
import FormSettings from './FormSettings';
import QuestionComponent from './Question';
import type { GetFormLabelsResponse, GetFormResponse } from '@/lib/api-types';
import type { FormEditorValues } from '../../../_schema/formEditorSchema';

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
  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormEditorValues>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: fromFormResponseToEditorValues(props.form),
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
    defaultValue: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { updateForm } = useFormEditActions(props.form.id);
  const { updateLabels } = useFormLabelActions(props.form.id);

  const onSubmit = async (data: FormEditorValues) => {
    const body = toFormUpdateBody(data, true);
    const result = await updateForm(body);

    if (!result.ok) {
      setError('root', {
        type: 'manual',
        message: 'フォームの更新に失敗しました。',
      });
      return;
    }

    const labelResult = await updateLabels(
      data.labels.map((label) => label.id)
    );
    if (!labelResult.ok) {
      setError('root', {
        type: 'manual',
        message: 'フォームラベルの更新に失敗しました。',
      });
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={10}>
        <Container component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Card sx={adminFormFieldSx}>
              <CardContent>
                <FormSettings
                  register={register}
                  control={control}
                  has_response_period={hasResponsePeriod}
                  labelOptions={props.labelOptions}
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
                          choices: field.choices,
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
