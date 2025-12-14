import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    groupName: string;
}

export function DeleteConfirmDialog({
                                        open,
                                        onClose,
                                        onConfirm,
                                        groupName,
                                    }: DeleteConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Group?</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete "{groupName}"? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}