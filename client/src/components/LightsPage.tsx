import { Container, Typography, CircularProgress, Alert, Box, Button } from '@mui/material';
import { Info } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLights, fetchBridgeConfig } from '../services/hueApi';
import { fetchGroups, createGroup, updateGroup, deleteGroup } from '../services/groupApi';
import { LightTile } from './LightTile';
import { AllLightsControl } from './AllLightsControl';
import { GroupsSidebar } from './GroupsSidebar';
import { GroupControl } from './GroupControl';
import { GroupManagementModal } from './GroupManagementModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { BridgeInfoModal } from './BridgeInfoModal';
import { useState } from 'react';

export function LightsPage() {
    const queryClient = useQueryClient();
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
    const [bridgeInfoOpen, setBridgeInfoOpen] = useState(false);

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

    const { data: bridgeConfig } = useQuery({
        queryKey: ['bridgeConfig'],
        queryFn: fetchBridgeConfig,
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

    const groups = groupsData
        ? Object.entries(groupsData)
            .filter(([_, group]) => group.type === 'LightGroup')
            .map(([id, group]) => ({
                id,
                name: group.name,
                lights: group.lights,
            }))
        : [];

    const selectedGroup = selectedGroupId && groupsData?.[selectedGroupId];
    const displayedLights = selectedGroupId && selectedGroup
        ? Object.entries(lights || {}).filter(([id]) => selectedGroup.lights.includes(id))
        : Object.entries(lights || {});

    const editingGroup = editingGroupId ? groupsData?.[editingGroupId] : undefined;
    const deletingGroup = deletingGroupId ? groupsData?.[deletingGroupId] : undefined;

    return (
        <Box display="flex">
            <GroupsSidebar
                groups={groups}
                selectedGroupId={selectedGroupId}
                onGroupSelect={setSelectedGroupId}
                onCreateGroup={() => setCreateModalOpen(true)}
                onEditGroup={handleEditGroup}
                onDeleteGroup={handleDeleteGroup}
            />

            <Box sx={{ flexGrow: 1, ml: '250px', p: 4 }}>
                <Container maxWidth="lg">
                    {/* Header with Bridge Info Button */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h3" component="h1">
                            {selectedGroupId && selectedGroup ? selectedGroup.name : 'All Lights'}
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Info />}
                            onClick={() => setBridgeInfoOpen(true)}
                        >
                            Bridge Info
                        </Button>
                    </Box>

                    {selectedGroupId && selectedGroup ? (
                        <GroupControl groupId={selectedGroupId} groupName={selectedGroup.name} />
                    ) : (
                        <AllLightsControl />
                    )}

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
                                    lightData={light}
                                />
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

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

            <BridgeInfoModal
                open={bridgeInfoOpen}
                onClose={() => setBridgeInfoOpen(false)}
                config={bridgeConfig || null}
            />
        </Box>
    );
}