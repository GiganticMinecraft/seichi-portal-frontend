import { Form } from '@/api/@types';

export type FormInfo = Omit<Form, 'questions'>;
