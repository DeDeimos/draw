import { createBrowserRouter } from "react-router-dom";
import { ChatPage } from "../pages/chat/ChatPage";
import { AuthPage } from "../pages/auth/AuthPage";

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <AuthPage />,
    },
    {
        path: "/chat",
        element: <ChatPage />
    }
]);
