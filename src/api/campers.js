import { http } from './http'

export async function fetchCampersApi() {
  const { data } = await http.get('/campers')
  // API returns { total, items }
  return data?.items ?? []
}

export async function fetchCamperByIdApi(id) {
  const { data } = await http.get(`/campers/${id}`)
  return data
}

