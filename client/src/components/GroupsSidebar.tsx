import { Box, List, ListItem, ListItemButton, ListItemText, Button, IconButton, Menu, MenuItem, Typography, Divider } from '@mui/material';
import { Add, MoreVert } from '@mui/icons-material';
import { useState } from 'react';

interface Group {
    id: string;
    name: string;
    lights: string[];
}

interface GroupsSidebarProps {
    groups: Group[];
    selectedGroupId: string | null;
    onGroupSelect: (groupId: string | null) => void;
    onCreateGroup: () => void;
    onEditGroup: (groupId: string) => void;
    onDeleteGroup: (groupId: string) => void;
}

export function GroupsSidebar({
                                  groups,
                                  selectedGroupId,
                                  onGroupSelect,
                                  onCreateGroup,
                                  onEditGroup,
                                  onDeleteGroup,
                              }: GroupsSidebarProps) {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [menuGroupId, setMenuGroupId] = useState<string | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, groupId: string) => {
        event.stopPropagation();
        setMenuAnchor(event.currentTarget);
        setMenuGroupId(groupId);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setMenuGroupId(null);
    };

    const handleEdit = () => {
        if (menuGroupId) {
            onEditGroup(menuGroupId);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (menuGroupId) {
            onDeleteGroup(menuGroupId);
        }
        handleMenuClose();
    };

    return (
        <Box
            sx={{
                width: 250,
                backgroundColor: 'background.paper',
                borderRight: 1,
                borderColor: 'divider',
                height: '100vh',
                position: 'fixed',
                overflowY: 'auto',
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Groups
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    fullWidth
                    onClick={onCreateGroup}
                    sx={{ mb: 2 }}
                >
                    New Group
                </Button>
            </Box>

            <Divider />

            <List>
                {/* All Lights Option */}
                <ListItem disablePadding>
                    <ListItemButton
                        selected={selectedGroupId === null}
                        onClick={() => onGroupSelect(null)}
                    >
                        <ListItemText primary="All Lights" />
                    </ListItemButton>
                </ListItem>

                <Divider />

                {/* Groups */}
                {groups.map((group) => (
                    <ListItem
                        key={group.id}
                        disablePadding
                        secondaryAction={
                            <IconButton
                                edge="end"
                                onClick={(e) => handleMenuOpen(e, group.id)}
                                size="small"
                            >
                                <MoreVert />
                            </IconButton>
                        }
                    >
                        <ListItemButton
                            selected={selectedGroupId === group.id}
                            onClick={() => onGroupSelect(group.id)}
                        >
                            <ListItemText
                                primary={group.name}
                                secondary={`${group.lights.length} lights`}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Context Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    Delete
                </MenuItem>
            </Menu>
        </Box>
    );
}