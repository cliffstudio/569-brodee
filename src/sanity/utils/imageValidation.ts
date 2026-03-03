/**
 * Validates that an image file size is 500KB or less
 * @param Rule - Sanity validation rule
 * @returns Custom validation function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const imageSizeValidation = (Rule: any) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Rule.custom(async (value: any, context: any) => {
    if (!value?.asset?._ref) {
      return true // Allow empty/undefined values (handle required separately)
    }

    // Get the client from context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getClient = (context as any)?.getClient
    if (!getClient) {
      // If client is not available, skip validation (might happen in some contexts)
      return true
    }

    try {
      const client = getClient({ apiVersion: '2024-01-01' })

      // Fetch the asset document
      const assetId = value.asset._ref
      const asset = await client.getDocument(assetId)

      if (!asset || !asset.size) {
        return true // If asset doesn't exist or has no size, skip validation
      }

      // 500KB in bytes
      const maxSize = 500 * 1024
      const fileSize = asset.size

      if (fileSize > maxSize) {
        const sizeInKB = Math.round(fileSize / 1024)
        return `Image size (${sizeInKB}KB) exceeds the maximum allowed size of 500KB. Please compress or resize the image.`
      }

      return true
    } catch {
      return true
    }
  })

/**
 * Validates that an image file size is 1MB or less (for social/share images)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const imageSizeValidation1MB = (Rule: any) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Rule.custom(async (value: any, context: any) => {
    if (!value?.asset?._ref) {
      return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getClient = (context as any)?.getClient
    if (!getClient) {
      return true
    }

    try {
      const client = getClient({ apiVersion: '2024-01-01' })
      const assetId = value.asset._ref
      const asset = await client.getDocument(assetId)

      if (!asset || !asset.size) {
        return true
      }

      const maxSize = 1024 * 1024 // 1MB
      const fileSize = asset.size

      if (fileSize > maxSize) {
        const sizeInMB = (fileSize / (1024 * 1024)).toFixed(1)
        return `Image size (${sizeInMB}MB) exceeds the maximum allowed size of 1MB. Please compress or resize the image.`
      }

      return true
    } catch {
      // If there's an error fetching the asset, don't block validation
      // This can happen during initial upload before asset is fully processed
      return true
    }
  })
