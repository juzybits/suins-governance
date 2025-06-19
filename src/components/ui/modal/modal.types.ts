export interface ModalFooterProps {
  actionText: string;
  onClose: () => void;
  onAction: () => void;
  disabled?: boolean;
}

export interface ModalProps {
  title?: string;
  subtitle?: string;
  onClose: () => void;
}
