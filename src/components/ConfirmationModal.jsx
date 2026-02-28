const ConfirmationModal = ({ id, title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
            <button className="btn btn-ghost mr-2" onClick={() => document.getElementById(id).close()}>{cancelText}</button>
            <button className="btn btn-error" onClick={() => { onConfirm(); document.getElementById(id).close(); }}>{confirmText}</button>
        </div>
      </div>
       <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ConfirmationModal;
