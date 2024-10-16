export default function getCollectionsFromDates(start: Date, end: Date) {
    const collections = []
    const cur = new Date(start.getTime())
    
    while (cur < end) {
        cur.setDate(cur.getDate() + 1)
        collections.push(formatDate(cur))
    }

    return collections
}

function formatDate(date: Date) {
    let month = '' + (date.getMonth() + 1)
    let day = '' + date.getDate()
    const year = date.getFullYear()

    if (month.length < 2) 
        month = '0' + month
    if (day.length < 2) 
        day = '0' + day

    return [day, month, year].join('')
}