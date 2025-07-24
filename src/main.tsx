import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { AvatarProvider } from './context/AvatarContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        
        <BrowserRouter basename='/client'>
         {/* <BrowserRouter basename='/'> */}
            <AuthProvider>
                <AvatarProvider>
                <App />
                </AvatarProvider>
            </AuthProvider>
            
        </BrowserRouter>

    </StrictMode>,
)