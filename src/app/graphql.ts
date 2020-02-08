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
        race_name,
        horse_name, 
        type,
        price,
        amount
    }
  }
`