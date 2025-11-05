import { Alert } from '@/components/Alert';

type AlertSectionProps = {
  isViewingHistory: boolean;
  isViewingSavedGame: boolean;
  handleContinueGame: () => void;
};

const AlertSection = (props: AlertSectionProps) => {
  const { isViewingHistory, isViewingSavedGame, handleContinueGame } = props;

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
};

export default AlertSection;
