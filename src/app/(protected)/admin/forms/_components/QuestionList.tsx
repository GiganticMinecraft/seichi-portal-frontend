'use client';

import { DragIndicator } from '@mui/icons-material';
import { Box, CardContent, IconButton, Stack } from '@mui/material';
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
import type { ReactNode } from 'react';

type QuestionListItem = {
  dndId: string;
  content: ReactNode;
};

const SortableQuestionWrapper = (props: {
  id: string;
  children: ReactNode;
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
    <CardContent ref={setNodeRef} style={style}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
        <IconButton size="small" {...attributes} {...listeners}>
          <DragIndicator fontSize="small" />
        </IconButton>
        <Box sx={{ flex: 1 }}>{props.children}</Box>
      </Stack>
    </CardContent>
  );
};

const QuestionList = (props: {
  items: QuestionListItem[];
  onMove: (oldIndex: number, newIndex: number) => void;
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

    const oldIndex = props.items.findIndex((item) => item.dndId === active.id);
    const newIndex = props.items.findIndex((item) => item.dndId === over.id);
    props.onMove(oldIndex, newIndex);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={props.items.map((item) => item.dndId)}
        strategy={verticalListSortingStrategy}
      >
        {props.items.map((item) => (
          <SortableQuestionWrapper key={item.dndId} id={item.dndId}>
            {item.content}
          </SortableQuestionWrapper>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default QuestionList;
