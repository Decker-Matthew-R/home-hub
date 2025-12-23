import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { Close, CheckCircle, Cancel } from '@mui/icons-material';
import { getLightCapabilities, getLightHealth } from '../utils/lightCapabilities';

interface LightDetailsModalProps {
    open: boolean;
    onClose: () => void;
    light: any;
    lightName: string;
}

export function LightDetailsModal({ open, onClose, light, lightName }: LightDetailsModalProps) {
    if (!light) return null;

    const capabilities = getLightCapabilities(light);
    const health = getLightHealth(light);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{lightName} - Details</Typography>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {/* Status */}
                <Box mb={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                    </Typography>
                    <Chip
                        icon={health.reachable ? <CheckCircle /> : <Cancel />}
                        label={health.reachable ? 'Online' : 'Offline'}
                        color={health.reachable ? 'success' : 'error'}
                        size="small"
                    />
                    {health.updateAvailable && (
                        <Chip
                            label="Update Available"
                            color="warning"
                            size="small"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Device Info */}
                <Box mb={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Device Information
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText
                                primary="Model"
                                secondary={health.model}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Product"
                                secondary={health.productName}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Manufacturer"
                                secondary={health.manufacturer}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Firmware Version"
                                secondary={health.firmwareVersion}
                            />
                        </ListItem>
                        {health.lastUpdate && (
                            <ListItem>
                                <ListItemText
                                    primary="Last Updated"
                                    secondary={new Date(health.lastUpdate).toLocaleDateString()}
                                />
                            </ListItem>
                        )}
                        <ListItem>
                            <ListItemText
                                primary="Unique ID"
                                secondary={health.uniqueId}
                            />
                        </ListItem>
                    </List>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Capabilities */}
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Capabilities
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText
                                primary="RGB Color"
                                secondary={capabilities.hasColor ? '✓ Supported' : '✗ Not Supported'}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Color Temperature"
                                secondary={
                                    capabilities.hasColorTemp
                                        ? `✓ ${capabilities.colorTempRange?.min}K - ${capabilities.colorTempRange?.max}K`
                                        : '✗ Not Supported'
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Dimmable"
                                secondary={capabilities.isDimmable ? '✓ Yes' : '✗ No'}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Entertainment Streaming"
                                secondary={capabilities.supportsStreaming ? '✓ Supported' : '✗ Not Supported'}
                            />
                        </ListItem>
                        {capabilities.maxLumen > 0 && (
                            <ListItem>
                                <ListItemText
                                    primary="Max Brightness"
                                    secondary={`${capabilities.maxLumen} lumens`}
                                />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </DialogContent>
        </Dialog>
    );
}