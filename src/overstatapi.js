import axios from "axios";

const overstatapi = axios.create({
    baseURL: "https://overstat.gg/api"
});



/**
 * Fetches match data from the Overstat API.
 *
 * @param {string} matchId - The ID of the match to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the match data.
 */
function getMatch(matchId) {
    return overstatapi.get(`/match/${matchId}`);
}


/**
 * Fetches the settings for a specific match.
 *
 * @param {string} matchId - The unique identifier of the match.
 * @returns {Promise<Object>} A promise that resolves to the match settings.
 */
function getMatchSettings(matchId) {
    return overstatapi.get(`/match/${matchId}/settings`);
}




/**
 * Searches for matches using the provided parameters.
 *
 * @param {number} start - The starting index for the search results.
 * @param {number} count - The number of results to return.
 * @param {string} name - The name of the match to search for.
 * @param {number} organizerId - The ID of the organizer.
 * @returns {Promise} - A promise that resolves to the search results.
 */
function searchMatch(start, count, name, organizerId) {
    // Start 0, Count 18 def 
    return overstatapi.get(`/match/search?start=${start}&count=${count}&name=${name}&organizer=${organizerId}`);
}


/**
 * Fetches the list of matches by organizer from the Overstat API.
 *
 * @returns {Promise<Object>} A promise that resolves to the response data containing the organizer match list.
 */
function getOrganizerMatchList() {
    return overstatapi.get(`/organizer_match_list`);
}


/**
 * Fetches live data for a given match.
 *
 * @param {string} gameId - The ID of the game to retrieve live data for.
 * @returns {Promise<Object>} A promise that resolves to the live data of the match in timeseries format.
 */
function getLiveData(gameId) {
    return overstatapi.get(`/stats/livedata/${gameId}?format=timeseries`);
}

/**
 * Fetches game details for a given match ID.
 *
 * @param {string} matchId - The ID of the match to retrieve game details for.
 * @returns {Promise<Object>} A promise that resolves to the game details like [{id: 56794, organizer: null, eventId: null, game: 1, match_start: 1731269468, mid: "68167622:10600:1731269187", map_name: "mp_rr_tropic_island_mu2", aim_assist_allowed: false, matchId: 9999, source: "statscode+livedata", livedata: 27984, livedata_checked: true},...]
 */
function getGames(matchId) {
    return overstatapi.get(`/games/${matchId}`);
}


/**
 * Fetches stacked statistics for a given match.
 *
 * @param {string} matchId - The ID of the match to retrieve statistics for.
 * @returns {Promise<Object>} A promise that resolves to the stacked statistics of the match.
 */
function getStatsStacked(matchId) {
    return overstatapi.get(`/stats/${matchId}/stacked`);
}


export default overstatapi;

export { getMatch, getMatchSettings, searchMatch, getOrganizerMatchList, getLiveData, getGames, getStatsStacked };