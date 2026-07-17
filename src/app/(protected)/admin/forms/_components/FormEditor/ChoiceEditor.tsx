'use client';

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
import { Add, DragIndicator } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton, MenuItem, Stack, TextField } from '@mui/material';
import { useController, useFieldArray, useWatch } from 'react-hook-form';
import type { Control, UseFormRegister } from 'react-hook-form';

import {
  questionTypeSchema,
  type FormEditorQuestion,
  type FormEditorValues,
} from '../../_schema/formEditorSchema';

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
        onClick={() => {
          props.removeChoice(props.index);
        }}
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

type ChoiceEditorProps = {
  control: Control<FormEditorValues>;
  register: UseFormRegister<FormEditorValues>;
  questionIndex: number;
};

const QuestionTypeField = (props: {
  control: Control<FormEditorValues>;
  questionIndex: number;
  choiceCount: number;
  appendChoice: () => void;
  clearChoices: () => void;
}) => {
  const { field: questionTypeField } = useController({
    control: props.control,
    name: `questions.${props.questionIndex}.question_type`,
  });

  const handleQuestionTypeChange = (
    nextQuestionType: FormEditorQuestion['question_type']
  ) => {
    questionTypeField.onChange(nextQuestionType);
    ensureChoicesForQuestionType(
      nextQuestionType,
      props.choiceCount,
      props.appendChoice,
      props.clearChoices
    );
  };

  return (
    <TextField
      {...questionTypeField}
      value={questionTypeField.value}
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
  );
};

const SortableChoiceList = (props: {
  choiceFields: { id: string }[];
  questionIndex: number;
  register: UseFormRegister<FormEditorValues>;
  moveChoice: (oldIndex: number, newIndex: number) => void;
  removeChoice: (index: number) => void;
  appendChoice: () => void;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = props.choiceFields.findIndex(
      (field) => field.id === active.id
    );
    const newIndex = props.choiceFields.findIndex(
      (field) => field.id === over.id
    );
    props.moveChoice(oldIndex, newIndex);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={props.choiceFields.map((field) => field.id)}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing={1}>
          {props.choiceFields.map((field, index) => (
            <SortableChoiceItem
              key={field.id}
              id={field.id}
              index={index}
              questionIndex={props.questionIndex}
              register={props.register}
              removeChoice={props.removeChoice}
              canRemove={props.choiceFields.length > 1}
              onAppendChoice={props.appendChoice}
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
};

const ChoiceEditor = (props: ChoiceEditorProps) => {
  const {
    fields: choiceFields,
    append,
    remove,
    move,
  } = useFieldArray({
    control: props.control,
    name: `questions.${props.questionIndex}.choices`,
  });

  const questionType = useWatch({
    control: props.control,
    name: `questions.${props.questionIndex}.question_type`,
  });

  const appendChoice = () => {
    append({ id: null, choice: '' });
  };

  const clearChoices = () => {
    remove();
  };

  const removeChoice = (choiceIndex: number) => {
    if (choiceFields.length > 1) {
      remove(choiceIndex);
    }
  };

  return (
    <>
      <QuestionTypeField
        control={props.control}
        questionIndex={props.questionIndex}
        choiceCount={choiceFields.length}
        appendChoice={appendChoice}
        clearChoices={clearChoices}
      />
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={appendChoice}
        disabled={questionType === 'Text'}
      >
        選択肢の追加
      </Button>
      <SortableChoiceList
        choiceFields={choiceFields}
        questionIndex={props.questionIndex}
        register={props.register}
        moveChoice={move}
        removeChoice={removeChoice}
        appendChoice={appendChoice}
      />
    </>
  );
};

export default ChoiceEditor;
