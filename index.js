const uuid = require('uuid/v4')
const axios = require('axios')
const GOOGLE_LOCATION_API_KEY = ''

const makeInstance = (baseURL, timeout) => {
  return axios.create({ baseURL, timeout })
}

const mapsApi = makeInstance('https://maps.googleapis.com/maps/api', 30 * 1000)

const sessionToken = uuid()
mapsApi.interceptors.request.use(config => {
  config.params.sessionToken = sessionToken
  config.params.key = GOOGLE_LOCATION_API_KEY
  return config
})

const placesAutocomplete = async (query, params, types) => {
  const res = await mapsApi.get('/place/autocomplete/json', {
    params: {
      input: query,
      ...params,
      types: types.join(',')
    }
  })
  return res.data.predictions
}

const main = async () => {
  const predictions = await placesAutocomplete('Shoreacres,TX', {
    components: 'country:us'
  }, ['(regions)'])
  console.log('predictions', predictions)
}

main()
