import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  // Resolve references to draft documents so project card refs (card2, card3) show when case studies are unpublished
  perspective: 'drafts',
})
