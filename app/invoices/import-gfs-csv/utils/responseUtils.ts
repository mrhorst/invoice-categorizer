function formatJsonResponse(jsonResponse: any) {
  const formattedArray = []
  try {
    for (const [key, value] of Object.entries(jsonResponse)) {
      // Check if the value is an object
      if (typeof value === 'object' && value !== null) {
        // Convert the object to a string
        formattedArray.push(`${key}: ${JSON.stringify(value)}`)
      } else {
        // For non-object values, just format them directly
        formattedArray.push(`${key}: ${value}`)
      }
    }

    // Join all the formatted pairs with " / " as the separator
    const formattedString = formattedArray.join('\n')

    // console.log('formattedString in responseUtils: ' + formattedString)
    return formattedString
  } catch (error) {
    console.error(error)
    return 'Error.'
  }
}

export { formatJsonResponse }
