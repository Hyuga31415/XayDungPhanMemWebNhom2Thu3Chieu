import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';

function ComingSoon({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <span style={{ fontSize: 64, lineHeight: 1 }}>🚧</span>
      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-primary)' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Tính năng đang được phát triển</p>
    </div>
  );
}
function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRouter />
    </>
  );
}

export default App;