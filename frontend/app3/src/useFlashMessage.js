import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Lets one page leave a message for the next page, e.g. after adding an employee:
//   navigate('/employees/5', { state: { message: { type: 'success', text: 'Added!' } } })
// The next page calls:  const [message, setMessage] = useFlashMessage();
// The message is then removed from the history, so refreshing doesn't show it again.
export function useFlashMessage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState(location.state?.message ?? null);

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
            navigate(location.pathname + location.search, { replace: true, state: null });
        }
    }, [location, navigate]);

    return [message, setMessage];
}
