import axios from 'axios'

export const callAtTable = (token, app, table, offset) => {
  return axios.get(`https://api.airtable.com/v0/${app}/${table}`,
    { 
      headers: { Authorization: "Bearer " + token },
      params: { offset: offset }
    }
  )
}
