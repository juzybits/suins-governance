export interface ModalFooterProps {
  loading?: boolean;
  disabled?: boolean;
  actionText: string;
  onClose: () => void;
  onAction: () => void;
}

export interface ModalProps {
  title?: string;
  subtitle?: string;
  onClose: () => void;
}
