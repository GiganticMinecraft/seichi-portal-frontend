'use client';

import { DragIndicator } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
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
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { GetFormLabelsResponse } from '@/lib/api-types';
import type { FormEditorValues } from '../../_schema/formEditorSchema';
import { useCreateForm } from '../_hooks/useCreateForm';
import FormCreateLayout from './FormCreateLayout';
import FormSettings from './FormSettings';
import QuestionComponent from './Question';

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
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
        <IconButton size="small" {...attributes} {...listeners}>
          <DragIndicator fontSize="small" />
        </IconButton>
        <Box sx={{ flex: 1 }}>{children}</Box>
      </Stack>
    </CardContent>
  );
};

const FormCreateForm = (props: { labelOptions: GetFormLabelsResponse }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormEditorValues>({
    mode: 'onSubmit',
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
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
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const visibility = useWatch({
    control,
    name: 'settings.visibility',
    defaultValue: 'PUBLIC',
  });

  const has_response_period = useWatch({
    control,
    name: 'settings.has_response_period',
    defaultValue: false,
  });

  const { createForm, isSubmitted, submitError } = useCreateForm();

  const addQuestion = () => {
    append({
      title: '',
      description: '',
      question_type: 'Text',
      choices: [],
      is_required: false,
      position: 0,
      template_key: '',
    });
  };

  const formContent = (
    <Container component="form" onSubmit={handleSubmit(createForm)}>
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <FormSettings
              control={control}
              register={register}
              visibility={visibility}
              has_response_period={has_response_period}
              labelOptions={props.labelOptions}
            />
          </CardContent>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={fields.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <SortableQuestionWrapper key={field.id} id={field.id}>
                  <QuestionComponent
                    control={control}
                    register={register}
                    removeQuestion={remove}
                    questionId={index}
                  />
                </SortableQuestionWrapper>
              ))}
            </SortableContext>
          </DndContext>
        </Card>
        {(errors.root || submitError) && (
          <Alert severity="error">
            {errors.root?.message ?? submitError?.message}
          </Alert>
        )}
        {isSubmitted && (
          <Alert severity="success">フォームを作成しました。</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={isSubmitting}
        >
          フォーム作成
        </Button>
      </Stack>
    </Container>
  );

  return (
    <FormCreateLayout formContent={formContent} onAddQuestion={addQuestion} />
  );
};

export default FormCreateForm;
