import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLights } from '../services/hueApi';
import { fetchGroups, createGroup, updateGroup, deleteGroup } from '../services/groupApi';
import { LightTile } from './LightTile';
import { AllLightsControl } from './AllLightsControl';
import { GroupsSidebar } from './GroupsSidebar';
import { GroupControl } from './GroupControl';
import { GroupManagementModal } from './GroupManagementModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useState } from 'react';

export function LightsPage() {
    const queryClient = useQueryClient();
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

    const { data: lights, isLoading: lightsLoading, error: lightsError } = useQuery({
        queryKey: ['lights'],
        queryFn: fetchLights,
        refetchInterval: 5000,
    });

    const { data: groupsData, isLoading: groupsLoading } = useQuery({
        queryKey: ['groups'],
        queryFn: fetchGroups,
        refetchInterval: 10000,
    });

    const createMutation = useMutation({
        mutationFn: ({ name, lightIds }: { name: string; lightIds: string[] }) =>
            createGroup(name, lightIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            setCreateModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ groupId, name, lightIds }: { groupId: string; name: string; lightIds: string[] }) =>
            updateGroup(groupId, name, lightIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            setEditModalOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (groupId: string) => deleteGroup(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            setDeleteDialogOpen(false);
            if (selectedGroupId === deletingGroupId) {
                setSelectedGroupId(null);
            }
        },
    });

    const handleCreateGroup = (name: string, lightIds: string[]) => {
        createMutation.mutate({ name, lightIds });
    };

    const handleEditGroup = (groupId: string) => {
        setEditingGroupId(groupId);
        setEditModalOpen(true);
    };

    const handleUpdateGroup = (name: string, lightIds: string[]) => {
        if (editingGroupId) {
            updateMutation.mutate({ groupId: editingGroupId, name, lightIds });
        }
    };

    const handleDeleteGroup = (groupId: string) => {
        setDeletingGroupId(groupId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingGroupId) {
            deleteMutation.mutate(deletingGroupId);
        }
    };

    if (lightsLoading || groupsLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (lightsError) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Failed to load lights. Make sure the server is running.
            </Alert>
        );
    }

    // Convert groups object to array
    const groups = groupsData
        ? Object.entries(groupsData)
            .filter(([_, group]) => group.type === 'LightGroup') // Only show LightGroups
            .map(([id, group]) => ({
                id,
                name: group.name,
                lights: group.lights,
            }))
        : [];

    // Get selected group details
    const selectedGroup = selectedGroupId && groupsData?.[selectedGroupId];

    // Filter lights based on selected group
    const displayedLights = selectedGroupId && selectedGroup
        ? Object.entries(lights || {}).filter(([id]) => selectedGroup.lights.includes(id))
        : Object.entries(lights || {});

    // Get editing group details
    const editingGroup = editingGroupId ? groupsData?.[editingGroupId] : undefined;
    const deletingGroup = deletingGroupId ? groupsData?.[deletingGroupId] : undefined;

    return (
        <Box display="flex">
            {/* Sidebar */}
            <GroupsSidebar
                groups={groups}
                selectedGroupId={selectedGroupId}
                onGroupSelect={setSelectedGroupId}
                onCreateGroup={() => setCreateModalOpen(true)}
                onEditGroup={handleEditGroup}
                onDeleteGroup={handleDeleteGroup}
            />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, ml: '250px', p: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" component="h1" gutterBottom>
                        {selectedGroupId && selectedGroup ? selectedGroup.name : 'All Lights'}
                    </Typography>

                    {/* Group/All Lights Control */}
                    {selectedGroupId && selectedGroup ? (
                        <GroupControl groupId={selectedGroupId} groupName={selectedGroup.name} />
                    ) : (
                        <AllLightsControl />
                    )}

                    {/* Individual Lights */}
                    <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
                        Individual Lights
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Click any light to toggle it on or off
                    </Typography>

                    <Box display="flex" flexWrap="wrap" gap={3}>
                        {displayedLights.map(([id, light]) => (
                            <Box
                                key={id}
                                sx={{
                                    width: {
                                        xs: '100%',
                                        sm: 'calc(50% - 12px)',
                                        md: 'calc(33.33% - 16px)',
                                        lg: 'calc(25% - 18px)',
                                    },
                                }}
                            >
                                <LightTile
                                    id={id}
                                    name={light.name}
                                    isOn={light.state.on}
                                    brightness={light.state.bri}
                                    hue={light.state.hue}
                                    sat={light.state.sat}
                                    reachable={light.state.reachable}
                                />
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Modals */}
            <GroupManagementModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSave={handleCreateGroup}
                allLights={lights || {}}
                title="Create New Group"
            />

            <GroupManagementModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setEditingGroupId(null);
                }}
                onSave={handleUpdateGroup}
                allLights={lights || {}}
                initialName={editingGroup?.name ?? ''}
                initialLightIds={editingGroup?.lights ?? []}
                title="Edit Group"
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeletingGroupId(null);
                }}
                onConfirm={handleConfirmDelete}
                groupName={deletingGroup?.name ?? ''}
            />
        </Box>
    );
}