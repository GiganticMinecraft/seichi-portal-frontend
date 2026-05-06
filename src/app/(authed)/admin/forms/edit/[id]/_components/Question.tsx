'use client';

import { Add, DragIndicator } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
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
import { useCallback } from 'react';
import { useController, useFieldArray, useWatch } from 'react-hook-form';
import type {
  FormEditorQuestion,
  FormEditorValues,
} from '../../../_schema/formEditorSchema';
import type { Control, UseFormRegister } from 'react-hook-form';

const SortableChoiceItem = ({
  id,
  index,
  questionIndex,
  register,
  removeChoice,
  defaultValue,
}: {
  id: string;
  index: number;
  questionIndex: number;
  register: UseFormRegister<FormEditorValues>;
  removeChoice: (index: number) => void;
  defaultValue: string;
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
    <Stack
      direction="row"
      ref={setNodeRef}
      style={style}
      spacing={1}
      alignItems="center"
    >
      <IconButton size="small" {...attributes} {...listeners}>
        <DragIndicator fontSize="small" />
      </IconButton>
      <TextField
        {...register(
          `questions.${questionIndex}.choices.${index}.choice` as const
        )}
        label={`選択肢${index + 1}`}
        defaultValue={defaultValue}
        required
        fullWidth
      />
      <IconButton size="small" onClick={() => removeChoice(index)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};

const QuestionComponent = ({
  control,
  register,
  removeQuestion,
  question,
  index,
}: {
  control: Control<FormEditorValues>;
  register: UseFormRegister<FormEditorValues>;
  removeQuestion: (index: number) => void;
  question: FormEditorQuestion;
  index: number;
}) => {
  const {
    fields: choicesField,
    append: appendChoices,
    remove: removeChoices,
    move: moveChoices,
  } = useFieldArray({
    control: control,
    name: `questions.${index}.choices`,
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
      const oldIndex = choicesField.findIndex(
        (field) => field.id === active.id
      );
      const newIndex = choicesField.findIndex((field) => field.id === over.id);
      moveChoices(oldIndex, newIndex);
    }
  };

  const { field } = useController({
    control,
    name: `questions.${index}.question_type`,
  });

  const useWatchQuestionType = useWatch({
    control,
    name: `questions.${index}.question_type`,
  });

  const addChoice = useCallback(() => {
    if (useWatchQuestionType !== 'Text') {
      appendChoices({ choice: '' });
    }
  }, [useWatchQuestionType, appendChoices]);

  const removeChoice = (choiceIndex: number) => {
    if (choicesField.length > 1) {
      removeChoices(choiceIndex);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        {...register(`questions.${index}.id` as const)}
        type="hidden"
      />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        質問{index + 1}
      </Typography>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={() => removeQuestion(index)}
      >
        質問の削除
      </Button>
      <TextField
        {...register(`questions.${index}.title` as const)}
        label="質問タイトル"
        defaultValue={question ? question.title : ''}
        required
      />
      <TextField
        {...register(`questions.${index}.description` as const)}
        label="質問の説明"
        defaultValue={question ? question.description : ''}
        multiline
        helperText="Markdown に対応しています。"
      />
      <TextField
        {...register(`questions.${index}.template_key` as const)}
        label="テンプレートキー"
        defaultValue={question ? question.template_key : ''}
        helperText="テンプレートで識別するためのキーです。空欄のままでも構いません。"
      />
      <TextField
        {...field}
        label="質問の種類"
        select
        required
        helperText="質問の種類を選択してください。"
        onChange={(event) => {
          field.onChange(event);

          if (event.target.value === 'Text') {
            removeChoices();
          } else if (choicesField.length === 0) {
            // NOTE: choicesField.lengthが0であることを確認しないと
            // 単一選択 -> 複数選択 -> 単一選択のように変更した場合に選択肢の入力欄が増加してしまう
            appendChoices({ choice: '' });
          }
        }}
      >
        <MenuItem onSelect={() => removeChoices()} value="Text">
          テキスト
        </MenuItem>
        <MenuItem value="SingleChoice">単一選択</MenuItem>
        <MenuItem value="MultipleChoice">複数選択</MenuItem>
      </TextField>
      <FormControlLabel
        label="この質問への回答を必須にする"
        control={
          <Checkbox {...register(`questions.${index}.is_required` as const)} />
        }
      />
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() => addChoice()}
        disabled={useWatchQuestionType === 'Text'}
      >
        選択肢の追加
      </Button>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={choicesField.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          {choicesField.map((field, choiceFieldIndex) => (
            <SortableChoiceItem
              key={field.id}
              id={field.id}
              index={choiceFieldIndex}
              questionIndex={index}
              register={register}
              removeChoice={removeChoice}
              defaultValue={field.choice}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Stack>
  );
};

export default QuestionComponent;
