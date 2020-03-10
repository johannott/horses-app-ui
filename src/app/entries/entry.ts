export interface Entry {
    id: number,
    race_name: string,
    horse_name: string,
    number: any,
    weight: string,
    jockey: string,
    trends: string,
    tipped: string,
    bets: string
  }

  export interface MergedEntry {
    id: number,
    race_name: string,
    horse_name: string,
    number: any,
    weight: string,
    jockey: string,
    trends: string,
    tipped: string,
    bets: string,
    age: number,
    bred: string,
    sire: string,
    form: string,
    races: string,
    wins: string,
    places: string,
    win_percentage: string,
    place_percentage: string,
    ground: string,
    comments: string
  }