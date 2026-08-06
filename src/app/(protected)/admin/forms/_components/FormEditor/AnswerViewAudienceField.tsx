'use client';

import LockOutlined from '@mui/icons-material/LockOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import type { AudienceMember } from './answerViewAudience';

const AnswerViewAudienceField = (props: { members: AudienceMember[] }) => (
  <Autocomplete<AudienceMember, true, true>
    multiple
    disabled
    disableClearable
    forcePopupIcon={false}
    options={[]}
    value={props.members}
    getOptionLabel={(option) => option.name}
    getOptionKey={(option) => option.id}
    isOptionEqualToValue={(option, current) => option.id === current.id}
    sx={{
      cursor: 'not-allowed',
      '&[aria-disabled="true"]': {
        opacity: 1,
      },
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'action.hover',
        cursor: 'not-allowed',
      },
      '& .MuiChip-root': {
        cursor: 'not-allowed',
      },
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="回答を閲覧できる人"
        slotProps={{
          ...params.slotProps,
          input: {
            ...params.slotProps.input,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <LockOutlined fontSize="small" color="disabled" />
                </InputAdornment>
                {params.slotProps.input.startAdornment}
              </>
            ),
          },
        }}
      />
    )}
    renderValue={(renderedValue, getItemProps) =>
      renderedValue.map((option, index) => {
        const { key, ...itemProps } = getItemProps({ index });

        return <Chip key={key} {...itemProps} label={option.name} />;
      })
    }
  />
);

export default AnswerViewAudienceField;
