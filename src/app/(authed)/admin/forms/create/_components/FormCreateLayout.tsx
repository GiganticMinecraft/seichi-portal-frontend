import { Add } from '@mui/icons-material';
import { Button, Card, CardContent, Grid } from '@mui/material';
import type { ReactNode } from 'react';

const FormCreateLayout = (props: {
  formContent: ReactNode;
  onAddQuestion: () => void;
}) => {
  return (
    <Grid container spacing={2}>
      <Grid size={10}>{props.formContent}</Grid>
      <Grid size={2}>
        <Card sx={{ position: 'fixed' }}>
          <CardContent>
            <Button
              type="button"
              aria-label="質問の追加"
              onClick={props.onAddQuestion}
              endIcon={<Add />}
            >
              質問の追加
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FormCreateLayout;
