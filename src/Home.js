import React from 'react';
import MatchList from './MatchList';
import { LinearProgress } from 'material-ui/Progress';

function Home({ matches, onMatchListUpdated, user, onError }) {
  const onMatchUpdated = (id, match) => {
    onMatchListUpdated({
      ...matches,
      [id]: match
    });
  };

  return (
    <div>
      {matches && Object.keys(matches).length !== 0 ? (
        <MatchList
          matches={matches}
          onError={onError}
          onMatchUpdated={onMatchUpdated}
          user={user}
        />
      ) : (
        <LinearProgress />
      )}
    </div>
  );
}

export default Home;
