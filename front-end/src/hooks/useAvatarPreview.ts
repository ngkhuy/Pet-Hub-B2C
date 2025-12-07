import { useCallback, useReducer, useRef } from "react";

type AvatarState = { preview: string };
type AvatarAction =
  | { type: "FROM_URL"; url: string }
  | { type: "FROM_FILE"; file: File };

function avatarReducer(state: AvatarState, action: AvatarAction): AvatarState {
  switch (action.type) {
    case "FROM_URL":
      return { preview: action.url || state.preview };
    case "FROM_FILE":
      return { preview: URL.createObjectURL(action.file) };
    default:
      return state;
  }
}

export function useAvatarPreview(initialUrl: string) {
  const [state, dispatch] = useReducer(avatarReducer, {
    preview: initialUrl ?? "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setFromUrl = useCallback((url: string) => {
    dispatch({ type: "FROM_URL", url });
  }, []);

  const setFromFile = useCallback((file: File) => {
    dispatch({ type: "FROM_FILE", file });
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) setFromFile(file);
    },
    [setFromFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) setFromFile(file);
    },
    [setFromFile]
  );

  return {
    avatarPreview: state.preview,
    fileInputRef,
    setFromUrl,
    handleFileChange,
    handleDrop,
  };
}
