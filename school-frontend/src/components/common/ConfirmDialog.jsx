// src/components/common/ConfirmDialog.jsx
const ConfirmDialog = ({
  isOpen, onConfirm, onCancel,
  message, title = 'Are you sure?',
  confirmText = 'Yes, Delete',
  confirmClass = 'btn-danger'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="bg-white rounded-2xl shadow-2xl p-6 
                      w-full max-w-sm animate-bounce-in text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full 
                        flex items-center justify-center 
                        mx-auto mb-4 text-3xl">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="btn-secondary px-6">
            Cancel
          </button>
          <button onClick={onConfirm} className={`${confirmClass} px-6`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;