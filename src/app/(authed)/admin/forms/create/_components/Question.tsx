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
import type { FormEditorValues } from '../../_schema/formEditorSchema';
import type { Control, UseFormRegister } from 'react-hook-form';

const SortableChoiceItem = ({
  id,
  index,
  questionId,
  register,
  removeChoice,
}: {
  id: string;
  index: number;
  questionId: number;
  register: UseFormRegister<FormEditorValues>;
  removeChoice: (index: number) => void;
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
        {...register(`questions.${questionId}.choices.${index}.choice`)}
        label={`選択肢${index + 1}`}
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
  questionId,
}: {
  control: Control<FormEditorValues>;
  register: UseFormRegister<FormEditorValues>;
  removeQuestion: (index: number) => void;
  questionId: number;
}) => {
  const {
    fields: choicesField,
    append: appendChoices,
    remove: removeChoices,
    move: moveChoices,
  } = useFieldArray({
    control: control,
    name: `questions.${questionId}.choices`,
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
    name: `questions.${questionId}.question_type`,
  });

  const useWatchQuestionType = useWatch({
    control,
    name: `questions.${questionId}.question_type`,
  });

  const addChoice = useCallback(() => {
    if (useWatchQuestionType !== 'Text') {
      appendChoices({ choice: '' });
    }
  }, [useWatchQuestionType, appendChoices]);

  const removeChoice = (index: number) => {
    if (choicesField.length > 1) {
      removeChoices(index);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        質問{questionId + 1}
      </Typography>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={() => removeQuestion(questionId)}
      >
        質問の削除
      </Button>
      <TextField
        {...register(`questions.${questionId}.title`)}
        label="質問タイトル"
        required
      />
      <TextField
        {...register(`questions.${questionId}.description`)}
        label="質問の説明"
        multiline
        helperText="Markdown に対応しています。"
      />
      <TextField
        {...register(`questions.${questionId}.template_key`)}
        label="テンプレートキー"
        helperText="テンプレートで識別するためのキーです。空欄のままでも構いません。"
      />
      <TextField
        {...register(`questions.${questionId}.question_type`)}
        label="質問の種類"
        select
        required
        defaultValue="Text"
        helperText="質問の種類を選択してください。"
        onChange={(event) => {
          // NOTE: 単純に onChange 書くと useWatchQuestionType が動作しないので field.onChangeを呼び出す必要がある
          // ref: https://github.com/orgs/react-hook-form/discussions/9144
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
          <Checkbox {...register(`questions.${questionId}.is_required`)} />
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
          {choicesField.map((field, index) => (
            <SortableChoiceItem
              key={field.id}
              id={field.id}
              index={index}
              questionId={questionId}
              register={register}
              removeChoice={removeChoice}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Stack>
  );
};

export default QuestionComponent;
