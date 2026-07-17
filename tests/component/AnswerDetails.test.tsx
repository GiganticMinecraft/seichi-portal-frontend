import { describe, expect, it } from 'vitest';

import AnswerDetails from '@/app/(protected)/(standard)/forms/[formId]/answers/[answerId]/_components/AnswerDetails';
import type { GetAnswerResponse, GetQuestionsResponse } from '@/lib/api-types';

import { renderWithProviders, screen } from './render';

const questions: GetQuestionsResponse = [
  {
    id: 'text-question-id',
    template_key: '',
    title: '感想',
    description: '',
    is_required: false,
    position: 1,
    question_type: 'Text',
  },
  {
    id: 'choice-question-id',
    template_key: '',
    title: '選択式の質問',
    description: '',
    is_required: false,
    position: 2,
    question_type: 'SingleChoice',
    choices: [
      { id: 1, label: '**太字**', position: 1 },
      { id: 2, label: '普通の選択肢', position: 2 },
    ],
  },
];

const answer: GetAnswerResponse = {
  id: 'answer-id',
  form_id: 'form-id',
  timestamp: '2024-01-01T00:00:00Z',
  title: null,
  labels: [],
  author: {
    type: 'AUTHENTICATED_USER',
    user: { name: 'Alice', role: 'STANDARD_USER', uuid: 'user-1' },
  },
  answers: [
    { question_id: 'text-question-id', answer: '**太字の回答**' },
    { question_id: 'choice-question-id', answer: '**太字**' },
  ],
};

describe('AnswerDetails', () => {
  it('Text 型の質問への回答は Markdown として解釈され、強調記法が実際の要素になる', () => {
    renderWithProviders(
      <AnswerDetails answer={answer} questions={questions} />
    );

    const strong = screen.getByText('太字の回答');
    expect(strong.tagName).toBe('STRONG');
  });

  it('選択式(SingleChoice)の回答は Markdown として解釈されず、記法がそのまま文字列で表示される', () => {
    renderWithProviders(
      <AnswerDetails answer={answer} questions={questions} />
    );

    // 選択式の回答値がそのまま(**が展開されずに)表示されている
    expect(screen.getByText('**太字**')).toBeVisible();
    expect(screen.queryByText('太字', { selector: 'strong' })).toBeNull();
  });
});
