
const Notification = ({ message, type }) => {
  if (!message) return null;

  const notificationTypes = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
  };

  return (
    <div className="toast toast-top toast-center">
      <div className={`alert ${notificationTypes[type] || 'alert-info'}`}>
        <div>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Notification;
