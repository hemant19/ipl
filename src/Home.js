import React from 'react';
import MatchList from './MatchList';

export default function Home(props) {
  const { matches, onMatchListUpdated, user } = props;
  const onMatchUpdated = (id, match) => {

    onMatchListUpdated({
      ...matches,
      [id]: match
    });
  };

  return (
    <MatchList matches={matches} onMatchUpdated={onMatchUpdated} user={user} />
  );
}