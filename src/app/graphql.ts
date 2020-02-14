import gql from 'graphql-tag';

export const HORSES_QUERY = gql`
  query { 
    horses {
      horse_name,
      trainer,
      regular_jockey,
      owner,
      age,
      gender,
      bred
      sire,
      form,
      races,
      wins,
      places,
      win_percentage,
      place_percentage,
      type,
      distance,
      ground,
      track,
      comments,
      link
    }
  }
`

export const HORSE_BY_NAME_QUERY = gql`
  query HorsesByName($horse_names: [String!]){ 
    horsesByName(horse_names: $horse_names) {
      horse_name,
      trainer,
      regular_jockey,
      owner,
      age,
      gender,
      bred,
      sire,
      form,
      races,
      wins,
      places,
      win_percentage,
      place_percentage,
      type,
      distance,
      ground,
      track,
      comments,
      link
    }
  }
`

export const ADD_HORSE_MUTATION = gql`
  mutation addHorseMutation(
    $horse_name: String!,
    $trainer: String!,
    $regular_jockey: String!,
    $owner: String!,
    $age: String!,
    $gender: String!,
    $bred: String!,
    $sire: String!,
    $form: String,
    $races: String,
    $wins: String,
    $places: String,
    $win_percentage: String,
    $place_percentage: String,
    $type: String,
    $distance: String,
    $ground: String,
    $track: String,
    $comments: String,
    $link: String,
  ) {
    addHorse(
      horse_name: $horse_name,
      trainer: $trainer,
      regular_jockey: $regular_jockey,
      owner: $owner,
      age: $age,
      gender: $gender,
      bred: $bred,
      sire: $sire,
      form: $form,
      races: $races,
      wins:$wins,
      places: $places,
      win_percentage: $win_percentage,
      place_percentage: $place_percentage,
      type: $type,
      distance: $distance,
      ground: $ground,
      track: $track,
      comments: $comments,
      link: $link,
    ) {
      horse_name
    }
  }
`

export const UPDATE_HORSE_MUTATION = gql`
  mutation updateHorseMutation(
    $current_name: String!,  
    $horse_name: String!,
    $trainer: String!,
    $regular_jockey: String!,
    $owner: String!,
    $age: String!,
    $gender: String!,
    $bred: String!,
    $sire: String!,
    $form: String,
    $races: String,
    $wins: String,
    $places: String,
    $win_percentage: String,
    $place_percentage: String,
    $type: String,
    $distance: String,
    $ground: String,
    $track: String,
    $comments: String,
    $link: String,
  ) {
    updateHorse(
      current_name: $current_name,
      horse_name: $horse_name,
      trainer: $trainer,
      regular_jockey: $regular_jockey,
      owner: $owner,
      age: $age,
      gender: $gender,
      bred: $bred,
      sire: $sire,
      form: $form,
      races: $races,
      wins:$wins,
      places: $places,
      win_percentage: $win_percentage,
      place_percentage: $place_percentage,
      type: $type,
      distance: $distance,
      ground: $ground,
      track: $track,
      comments: $comments,
      link: $link,
    ) {
      horse_name
    }
  }
`

export const ENTRIES_BY_RACE_QUERY = gql`
  query EntriesByRaceName($race_name: String!){ 
    entriesByRace(race_name: $race_name) {
      horse_name,
      number
      weight,
      jockey,
      trends,
      tipped,
      bets
    }
  }
`

export const ADD_ENTRY_MUTATION = gql`
mutation addEntryMutation (
    $race_name: String!,       
    $horse_name: String!, 
    $number: String,
    $weight: String,
    $jockey: String,
    $trends: String,
    $tipped: String,
    $bets: String) {
    addEntry(
        race_name: $race_name
        horse_name: $horse_name, 
        number: $number
        weight: $weight,
        jockey: $jockey,
        trends: $trends,
        tipped: $tipped,
        bets: $bets
    ) {
        race_name
        horse_name
    }
}
`

export const UPDATE_ENTRY_MUTATION = gql`
  mutation updateEntryMutation (
    $race_name: String!,       
    $horse_name: String!, 
    $number: String,
    $weight: String,
    $jockey: String,
    $trends: String,
    $tipped: String,
    $bets: String) {
    updateEntry(
        race_name: $race_name
        horse_name: $horse_name, 
        number: $number,
        weight: $weight,
        jockey: $jockey,
        trends: $trends,
        tipped: $tipped,
        bets: $bets
    ) {
        race_name
        horse_name
    }
}
`

export const RACES_QUERY = gql`
  query { 
    races {
      race_name,
      race_fullname,
      type,
      grade,
      distance,
      course,
      age_limit
    }
  }
`

export const ENTRIES_QUERY = gql`
  query { 
    entries {
      race_name,
      horse_name,
      number
      weight,
      jockey,
      trends,
      tipped,
      bets
    }
  }
`
export const RACE_BY_NAME_QUERY = gql`
  query RaceByName($race_name: String!){ 
    raceByName(race_name: $race_name) {
      race_name,
      race_fullname,
      type,
      grade,
      distance,
      course,
      age_limit
    }
  }
`

export const TRENDS_QUERY = gql`
  query TrendsByRace($race_name: String!){
    trendsByRace(race_name: $race_name){  
        trend_
    }
  }
`

export const NOTES_QUERY = gql`
  query {
    notes{ 
        id 
        note_,
        type
    }
  }
`

export const ADD_NOTE_MUTATION = gql`
mutation addNoteMutation (
    $note: String!,       
    $type: String!) {
    addNote(
        note_: $note,
        type: $type
    ) {
        note_
    }
}
`

export const UPDATE_NOTE_MUTATION = gql`
mutation updateNoteMutation (
    $id: ID!,
    $note: String!,       
    $type: String!) {
    updateNote(
        id: $id,
        note_: $note,
        type: $type
    ) {
        note_
    }
}
`

export const ACCOUNTS_QUERY = gql`
  query {
    accounts{  
        account_name,
        username,
        balance,
        url
    }
  }
`

export const BETS_QUERY = gql`
  query {
    bets{ 
        id, 
        race_name,
        horse_name, 
        type,
        places,
        price,
        amount,
        to_return,
        date,
        time
    }
  }
`

export const ADD_BET_MUTATION = gql`
mutation AddBetMutation(
    $race_name: String!
    $horse_name: [String!]
    $type: String!
    $places: String!
    $price: String!
    $amount: String!
    $to_return: String!
    $date: String!
    $time: String!) {
    addBet(
      race_name: $race_name
      horse_name: $horse_name, 
      type: $type
      places: $places,
      price: $price,
      amount: $amount,
      to_return: $to_return,
      date: $date,
      time: $time
    ) {
      race_name
    }
}
`

export const UPDATE_BET_MUTATION = gql`
mutation UpdateBetMutation(
    $id: ID!,
    $race_name: String!
    $horse_name: [String!]
    $type: String!
    $places: String!
    $price: String!
    $amount: String!
    $to_return: String!
    $date: String!
    $time: String!) {
    updateBet(
      id: $id,
      race_name: $race_name
      horse_name: $horse_name, 
      type: $type
      places: $places,
      price: $price,
      amount: $amount,
      to_return: $to_return,
      date: $date,
      time: $time
    ) {
      race_name
    }
}
`

export const TRACKS_QUERY = gql`
  query {
    tracks{
      id,  
      track_name,
      direction,
      topography,
      notes,
      length,
      surface,
      country
    }
  }
`

export const ADD_TRACK_MUTATION = gql`
mutation AddTrackMutation(
    $track_name: String!
    $direction: String
    $topography: String
    $notes: String
    $length: String
    $surface: String
    $country: String) {
      addTrack(
      track_name: $track_name
      direction: $direction, 
      topography: $topography
      notes: $notes,
      length: $length,
      surface: $surface,
      country: $country
    ) {
      track_name
    }
}
`

export const UPDATE_TRACK_MUTATION = gql`
mutation UpdateTrackMutation(
    $id: ID!,
    $track_name: String!
    $direction: String
    $topography: String
    $notes: String
    $length: String
    $surface: String
    $country: String) {
      updateTrack(
      id: $id,
      track_name: $track_name
      direction: $direction, 
      topography: $topography
      notes: $notes,
      length: $length,
      surface: $surface,
      country: $country
    ) {
      track_name
    }
}
`

export const WINNERS_BY_RACE_QUERY = gql`
  query WinnersByRaceName($race_name: String!){ 
    winnersByRace(race_name: $race_name) {
        year,
        horse_name,
        jockey,
        trainer,
        age,
        weight,
        distance,
        time,
        going,
        price,
        rating,
        form,
        runs,
        wins,
        cheltenham_runs,
        cheltenham_wins,
        distance_runs,
        distance_wins,
        hurdles_runs,
        hurdles_wins,
        chase_runs,
        chase_wins,
        last_run,
        since_last_run,
        last_run_result,
        grade_one_wins,
        grade_two_wins,
        grade_three_wins,
        video_url
    }
  }
`

export const ABBREVIATION_QUERY = gql`
  query {
    abbreviations{ 
        id 
        abbr,
        meaning
    }
  }
`