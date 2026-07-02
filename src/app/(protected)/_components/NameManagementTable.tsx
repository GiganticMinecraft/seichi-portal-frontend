'use client';

import { Delete, Edit, Visibility } from '@mui/icons-material';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { ReactNode } from 'react';

type NameManagementItem = {
  id: string | number;
  name: string;
};

const NameManagementTable = <Item extends NameManagementItem>(props: {
  items: Item[];
  nameHeader: ReactNode;
  onView?: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}) => {
  const { items, nameHeader, onView, onEdit, onDelete } = props;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{nameHeader}</TableCell>
            <TableCell align="right">アクション</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell align="right">
                {onView ? (
                  <IconButton
                    color="default"
                    onClick={() => {
                      onView(item);
                    }}
                    aria-label="詳細"
                  >
                    <Visibility />
                  </IconButton>
                ) : null}
                <IconButton
                  color="primary"
                  onClick={() => {
                    onEdit(item);
                  }}
                  aria-label="編集"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    onDelete(item);
                  }}
                  aria-label="削除"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NameManagementTable;
