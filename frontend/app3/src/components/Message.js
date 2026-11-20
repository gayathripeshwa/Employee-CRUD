import './Message.css';

// Shows a success or error message inside the page (instead of alert()).
//
// Usage:
//   const [message, setMessage] = useState(null);
//   setMessage({ type: 'success', text: 'Saved!' });
//   <Message message={message} onClose={() => setMessage(null)} />
function Message({ message, onClose }) {
    if (!message) {
        return null; // nothing to show
    }

    return (
        <div className={`message message-${message.type}`} role="alert">
            <span>{message.text}</span>
            {onClose && (
                <button
                    type="button"
                    className="message-close"
                    onClick={onClose}
                    aria-label="Close message"
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default Message;
