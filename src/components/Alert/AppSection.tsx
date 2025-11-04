import { Alert } from './Alert';

type AlertSectionProps = {
  isViewingHistory: boolean;
  isViewingSavedGame: boolean;
  handleContinueGame: () => void;
};

export function AlertSection({ isViewingHistory, isViewingSavedGame, handleContinueGame }: AlertSectionProps) {
  return (
    <>
      {isViewingHistory && !isViewingSavedGame && (
        <Alert
          button={{
            text: 'Continue Game',
            onClick: handleContinueGame,
            variant: 'primary',
          }}
          description="You are viewing a game history now"
        />
      )}

      {isViewingSavedGame && (
        <Alert
          button={{
            text: 'Exit Saved Game',
            onClick: handleContinueGame,
            variant: 'primary',
          }}
          description="You are viewing a saved game now"
        />
      )}
    </>
  );
}
