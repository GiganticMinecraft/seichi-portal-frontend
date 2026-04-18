'use client';

import InputMessageField from '@/app/(authed)/_components/InputMessageField';

const StandardInputMessageField = (props: {
  form_id: string;
  answer_id: number;
}) => (
  <InputMessageField
    form_id={props.form_id}
    answer_id={props.answer_id}
    textFieldSx={{
      '& .MuiFormLabel-root': { color: 'white' },
      '& .MuiFormHelperText-root': { color: 'white' },
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'white' },
        '&:hover fieldset': { borderColor: 'white' },
        '&.Mui-focused fieldset': { borderColor: 'white' },
      },
    }}
  />
);

export default StandardInputMessageField;
