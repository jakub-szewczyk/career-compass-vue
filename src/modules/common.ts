export const greeting = (date = new Date()) => {
  const hours = date.getHours()
  if (hours < 5 || hours >= 17) return 'Good evening'
  if (hours < 12) return 'Good morning'
  return 'Good afternoon'
}
