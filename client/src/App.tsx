import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography } from '@mui/material';

const queryClient = new QueryClient();

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Home Hub
                    </Typography>
                    {/* Components will go here */}
                </Container>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;