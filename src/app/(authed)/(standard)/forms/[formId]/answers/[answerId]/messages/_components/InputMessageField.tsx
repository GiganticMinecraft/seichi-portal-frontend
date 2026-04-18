'use client';

import InputMessageField from '@/app/(authed)/_components/InputMessageField';

const StandardInputMessageField = (props: { answer_id: number }) => (
  <InputMessageField
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
