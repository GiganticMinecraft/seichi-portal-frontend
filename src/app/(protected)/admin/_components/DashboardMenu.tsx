'use client';

import {
  ExpandLess,
  ExpandMore,
  Groups,
  Label,
  Star,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  MenuList,
  MenuItem,
  ListItemIcon,
  IconButton,
  Collapse,
  Divider,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { AUTCHED_DRAWER_WIDTH_PX } from '../../layoutConstants';

type MenuChild = {
  label: string;
  url: string;
  icon: ReactNode;
};

type MenuNode = {
  label: string;
  url: string;
  icon: ReactNode;
  children?: MenuChild[];
};

const MENU_ITEMS: MenuNode[] = [
  { label: 'Dashboard', url: '/admin', icon: <Star /> },
  {
    label: 'Forms',
    url: '/admin/forms',
    icon: <Star />,
    children: [
      {
        label: 'ラベルの管理',
        url: '/admin/labels?tab=forms',
        icon: <Label fontSize="small" />,
      },
    ],
  },
  {
    label: 'Users',
    url: '/admin/users',
    icon: <Star />,
    children: [
      {
        label: 'グループの管理',
        url: '/admin/groups',
        icon: <Groups fontSize="small" />,
      },
    ],
  },
  { label: 'Webhooks', url: '/admin/webhooks', icon: <Star /> },
];

type DashboardMenuProps = {
  variant: 'permanent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
};

const DashboardMenu = ({ variant, open, onClose }: DashboardMenuProps) => {
  const [expandedUrls, setExpandedUrls] = useState<ReadonlySet<string>>(
    new Set()
  );

  const toggleExpanded = (url: string) => {
    setExpandedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={variant === 'temporary' ? { keepMounted: true } : undefined}
      sx={(theme) => ({
        ...(variant === 'permanent' && { width: AUTCHED_DRAWER_WIDTH_PX }),
        [`& .MuiDrawer-paper`]: {
          width: AUTCHED_DRAWER_WIDTH_PX,
          boxSizing: 'border-box',
          boxShadow: theme.shadows[16],
        },
      })}
    >
      <Typography sx={{ mt: 4, mb: 2, px: 2 }} variant="h6" component="div">
        Menu
      </Typography>
      <MenuList>
        {MENU_ITEMS.map((item) => {
          const expanded = expandedUrls.has(item.url);

          return (
            <Box key={item.url}>
              <MenuItem sx={{ color: 'text.primary', padding: 0 }}>
                <Box
                  component={NextLink}
                  href={item.url}
                  onClick={() => {
                    onClose?.();
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    minWidth: 0,
                    color: 'inherit',
                    textDecoration: 'none',
                    px: 2,
                    py: '6px',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'text.secondary',
                      pr: 4,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {item.label}
                </Box>
                {item.children && (
                  <IconButton
                    size="small"
                    aria-label={`${item.label}のメニューを${
                      expanded ? '折りたたむ' : '展開する'
                    }`}
                    aria-expanded={expanded}
                    onClick={() => {
                      toggleExpanded(item.url);
                    }}
                    sx={{ mr: 1 }}
                  >
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </MenuItem>
              {item.children && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <MenuList disablePadding>
                    {item.children.map((child) => (
                      <MenuItem
                        key={child.url}
                        component={NextLink}
                        href={child.url}
                        onClick={() => {
                          onClose?.();
                        }}
                        sx={{
                          color: 'text.primary',
                          textDecoration: 'none',
                          pl: 4,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: 'text.secondary',
                            pr: 4,
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        {child.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Collapse>
              )}
            </Box>
          );
        })}
      </MenuList>
      <Divider />
    </Drawer>
  );
};

export default DashboardMenu;
