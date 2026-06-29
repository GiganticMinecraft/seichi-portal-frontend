'use client';

import { Add, DragIndicator } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton, MenuItem, Stack, TextField } from '@mui/material';
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
import { useController, useFieldArray } from 'react-hook-form';
import {
  questionTypeSchema,
  type FormEditorQuestion,
  type FormEditorValues,
} from '../_schema/formEditorSchema';
import type { Control, UseFormRegister } from 'react-hook-form';

const SortableChoiceItem = (props: {
  id: string;
  index: number;
  questionIndex: number;
  register: UseFormRegister<FormEditorValues>;
  removeChoice: (index: number) => void;
  canRemove: boolean;
  onAppendChoice: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

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
      sx={{ alignItems: 'center' }}
    >
      <IconButton size="small" {...attributes} {...listeners}>
        <DragIndicator fontSize="small" />
      </IconButton>
      <TextField
        {...props.register(
          `questions.${props.questionIndex}.choices.${props.index}.choice`
        )}
        label={`選択肢${props.index + 1}`}
        required
        fullWidth
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            event.preventDefault();
            props.onAppendChoice();
          }
        }}
      />
      <IconButton
        size="small"
        onClick={() => props.removeChoice(props.index)}
        disabled={!props.canRemove}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};

const ensureChoicesForQuestionType = (
  questionType: FormEditorQuestion['question_type'],
  choiceCount: number,
  appendChoice: () => void,
  clearChoices: () => void
) => {
  if (questionType === 'Text') {
    clearChoices();
    return;
  }

  if (choiceCount === 0) {
    appendChoice();
  }
};

const ChoiceEditor = (props: {
  control: Control<FormEditorValues>;
  register: UseFormRegister<FormEditorValues>;
  questionIndex: number;
}) => {
  const {
    fields: choiceFields,
    append,
    remove,
    move,
  } = useFieldArray({
    control: props.control,
    name: `questions.${props.questionIndex}.choices`,
  });

  const { field: questionTypeField } = useController({
    control: props.control,
    name: `questions.${props.questionIndex}.question_type`,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const appendChoice = () => append({ choice: '' });

  const clearChoices = () => remove();

  const handleQuestionTypeChange = (
    nextQuestionType: FormEditorQuestion['question_type']
  ) => {
    questionTypeField.onChange(nextQuestionType);
    ensureChoicesForQuestionType(
      nextQuestionType,
      choiceFields.length,
      appendChoice,
      clearChoices
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = choiceFields.findIndex((field) => field.id === active.id);
    const newIndex = choiceFields.findIndex((field) => field.id === over.id);
    move(oldIndex, newIndex);
  };

  const removeChoice = (choiceIndex: number) => {
    if (choiceFields.length > 1) {
      remove(choiceIndex);
    }
  };

  const questionType = questionTypeField.value ?? 'Text';

  return (
    <>
      <TextField
        {...questionTypeField}
        value={questionType}
        label="質問の種類"
        select
        required
        helperText="質問の種類を選択してください。"
        onChange={(event) => {
          const parsed = questionTypeSchema.safeParse(event.target.value);
          if (parsed.success) {
            handleQuestionTypeChange(parsed.data);
          }
        }}
      >
        <MenuItem value="Text">テキスト</MenuItem>
        <MenuItem value="SingleChoice">単一選択</MenuItem>
        <MenuItem value="MultipleChoice">複数選択</MenuItem>
      </TextField>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={appendChoice}
        disabled={questionType === 'Text'}
      >
        選択肢の追加
      </Button>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={choiceFields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={1}>
            {choiceFields.map((field, index) => (
              <SortableChoiceItem
                key={field.id}
                id={field.id}
                index={index}
                questionIndex={props.questionIndex}
                register={props.register}
                removeChoice={removeChoice}
                canRemove={choiceFields.length > 1}
                onAppendChoice={appendChoice}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default ChoiceEditor;
