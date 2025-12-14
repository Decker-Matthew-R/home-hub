import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import type { Light } from '../services/hueApi';

interface GroupManagementModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (name: string, lightIds: string[]) => void;
    allLights: { [id: string]: Light };
    initialName?: string;
    initialLightIds?: string[];
    title: string;
}

export function GroupManagementModal({
                                         open,
                                         onClose,
                                         onSave,
                                         allLights,
                                         initialName = '',
                                         initialLightIds = [],
                                         title,
                                     }: GroupManagementModalProps) {
    const [name, setName] = useState(initialName);
    const [selectedLights, setSelectedLights] = useState<Set<string>>(
        new Set(initialLightIds)
    );

    useEffect(() => {
        if (open) {
            setName(initialName);
            setSelectedLights(new Set(initialLightIds));
        }
    }, [open]);

    const handleToggleLight = (lightId: string) => {
        const newSelected = new Set(selectedLights);
        if (newSelected.has(lightId)) {
            newSelected.delete(lightId);
        } else {
            newSelected.add(lightId);
        }
        setSelectedLights(newSelected);
    };

    const handleSave = () => {
        if (name.trim() && selectedLights.size > 0) {
            onSave(name.trim(), Array.from(selectedLights));
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Group Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <Typography variant="subtitle2" gutterBottom>
                    Select Lights ({selectedLights.size} selected)
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    <FormGroup>
                        {Object.entries(allLights).map(([id, light]) => (
                            <FormControlLabel
                                key={id}
                                control={
                                    <Checkbox
                                        checked={selectedLights.has(id)}
                                        onChange={() => handleToggleLight(id)}
                                    />
                                }
                                label={`${light.name}${!light.state.reachable ? ' (Unreachable)' : ''}`}
                            />
                        ))}
                    </FormGroup>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!name.trim() || selectedLights.size === 0}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}