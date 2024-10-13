'use client';
import MenuBar from './ui/menu_bar';
import Sidebar from './ui/sidebar/sidebar';
import OmniMap from './ui/map';
import { useEffect, useState } from 'react';
import firedb, { NewsEvent } from './lib/firebase';
import getCollectionsFromDates from './lib/utils';
import DatePicker from './ui/datepicker/datepicker';

export default function App() {
  const [eventsData, setEventsData] = useState<NewsEvent[]>()
  const [activeSegment, setActiveSegment] = useState<string>("across the atlantic")
  const [dateRange, setDateRange] = useState<Date[]>([new Date(2024, 8, 30), new Date()])
   
  useEffect(() => {
    var dates

    if (dateRange.length > 0) {
      dates = getCollectionsFromDates(dateRange[0], dateRange[1])
    } else {
      dates = getCollectionsFromDates(new Date(2024, 8, 30), new Date())
    }

    const newsData: NewsEvent[] = []

    Promise.all(dates.map(d => firedb.fetchEvents(d).then(r => newsData.push(...r)))).then((_) => {
      setEventsData(newsData);
    })
  }, [dateRange])

  return (
    <div style={{width: "100vw", height: "100vh", overflow: "hidden"}}>
      <MenuBar />
      <div style={{display: "flex"}}>
        <Sidebar segment={activeSegment} newsEvents={(eventsData ?? []).filter((newsEvent) => newsEvent.segment.toLowerCase() == activeSegment?.toLowerCase())}/>
        <OmniMap updateSegmentCallback={(segment: string) => setActiveSegment(segment)} newsEvents={eventsData ?? []}/>
          <DatePicker onChangeHandler={setDateRange}/>
      </div>
    </div>
  );
}
