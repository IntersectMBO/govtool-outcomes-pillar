import { createContext, useContext, useMemo, useReducer } from "react";
import { MuiModalChildren } from "../Components/modal/Modal";
import { ExternalLinkModal } from "../Components/modal/ExternalLinkModal";
import { callAll } from "../lib/callAll";
import { basicReducer, BasicReducer } from "../lib/basicReducer";

interface ProviderProps {
  children: React.ReactNode;
}

interface ContextModal {
  component: MuiModalChildren | null;
  variant?: "modal" | "popup";
  preventDismiss?: boolean;
  onClose?: () => void;
}

export type ModalType = "none" | "externalLink";

const modals: Record<ModalType, ContextModal> = {
  none: {
    component: null,
  },
  externalLink: {
    component: <ExternalLinkModal />,
  },
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface ModalState<T> {
  type: ModalType;
  state: T | null;
}

interface ModalContextType<T> {
  modal: ModalState<T>;
  modals: Record<ModalType, ContextModal>;
  state: T | null;
  openModal: (modal: Optional<ModalState<T>, "state">) => void;
  closeModal: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModalContext = createContext<ModalContextType<any>>(
  {} as ModalContextType<unknown>
);
ModalContext.displayName = "ModalContext";

// eslint-disable-next-line react/function-component-definition
function ModalProvider<T>({ children, ...props }: ProviderProps) {
  const [modal, openModal] = useReducer<BasicReducer<ModalState<T>>>(
    basicReducer,
    {
      state: null,
      type: "none",
    }
  );

  const value = useMemo(
    () => ({
      modals,
      modal,
      state: modal.state,
      openModal,
      closeModal: callAll(modals[modal.type]?.onClose, () =>
        openModal({ type: "none", state: null })
      ),
    }),
    [modal, openModal]
  );

  return (
    <ModalContext.Provider value={value} {...props}>
      {children}
    </ModalContext.Provider>
  );
}

function useModal<T>() {
  const context = useContext<ModalContextType<T>>(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

export { ModalProvider, useModal };
