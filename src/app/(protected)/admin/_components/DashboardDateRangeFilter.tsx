'use client';

import { Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { Dayjs } from 'dayjs';

const DashboardDateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (value: Dayjs | null) => void;
  onEndDateChange: (value: Dayjs | null) => void;
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <DatePicker
          label="開始日"
          value={startDate}
          onChange={onStartDateChange}
          slotProps={{
            textField: { variant: 'standard', size: 'small' },
            field: { clearable: true },
          }}
          sx={{ minWidth: 160 }}
        />
        <DatePicker
          label="終了日"
          value={endDate}
          onChange={onEndDateChange}
          slotProps={{
            textField: { variant: 'standard', size: 'small' },
            field: { clearable: true },
          }}
          sx={{ minWidth: 160 }}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default DashboardDateRangeFilter;
