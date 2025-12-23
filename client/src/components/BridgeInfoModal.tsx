import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { BridgeConfig } from '../services/hueApi';

interface BridgeInfoModalProps {
    open: boolean;
    onClose: () => void;
    config: BridgeConfig | null;
}

export function BridgeInfoModal({ open, onClose, config }: BridgeInfoModalProps) {
    if (!config) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Hue Bridge Information</Typography>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {/* Bridge Info */}
                <Box mb={3}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Bridge Details
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText
                                primary="Bridge Name"
                                secondary={config.name}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Model"
                                secondary={config.modelid}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Bridge ID"
                                secondary={config.bridgeid}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="IP Address"
                                secondary={config.ipaddress}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="MAC Address"
                                secondary={config.mac}
                            />
                        </ListItem>
                    </List>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Software Info */}
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Software Information
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText
                                primary="Software Version"
                                secondary={config.swversion}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="API Version"
                                secondary={config.apiversion}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Datastore Version"
                                secondary={config.datastoreversion}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Factory New"
                                secondary={config.factorynew ? 'Yes' : 'No'}
                            />
                        </ListItem>
                    </List>
                </Box>
            </DialogContent>
        </Dialog>
    );
}