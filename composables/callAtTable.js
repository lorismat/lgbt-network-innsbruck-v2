import axios from 'axios'

// get records
// https://airtable.com/developers/web/api/introduction

export const callAtTable = (token, app, table, offset) => {
  return axios.get(`https://api.airtable.com/v0/${app}/${table}`,
    { 
      headers: { Authorization: "Bearer " + token },
      params: { offset: offset }
    }
  )
}
