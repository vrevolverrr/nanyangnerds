import { NewsEvent } from "./firebase";

export function getAggregateRisk(segment: string, events: NewsEvent[]): number {
    const K = 0.4

    const relavantEvents = events.filter((newsEvent) => newsEvent.segment.toLowerCase() == segment.toLowerCase())

    if (relavantEvents.length == 0) return 0

    const averageRisk = relavantEvents.reduce((acc, cur) => acc + cur.risk, 0) / relavantEvents.length
    const weightedAggr = (relavantEvents.length / (relavantEvents.length + K)) * averageRisk
    
    return parseFloat(weightedAggr.toFixed(2))
}
