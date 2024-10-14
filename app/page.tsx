'use client';
import MenuBar from './ui/menu_bar';
import Sidebar from './ui/sidebar/sidebar';
import { useCallback, useEffect, useState } from 'react';
import firedb, { NewsEvent } from './lib/firebase';
import getCollectionsFromDates from './lib/utils';
import dynamic from 'next/dynamic';
import DatePicker from './ui/datepicker/datepicker';

const OmniMap = dynamic(() => import('./ui/map'), { ssr: false });

export default function App() {
  const [eventsData, setEventsData] = useState<NewsEvent[]>()
  const [activeSegment, setActiveSegment] = useState<string>("across the atlantic")
  const [dateStart, setDateStart] = useState<Date>(new Date(2024, 8, 30))
  const [dateEnd, setDateEnd] = useState<Date>(new Date(2024, 9, 13))
   

  const getDatesCallback = useCallback(() => {
    let dates

    if (dateStart && dateEnd) {
      dates = getCollectionsFromDates(dateStart, dateEnd)
    } else {
      dates = getCollectionsFromDates(new Date(2024, 8, 30), new Date())
    }

    const newsData: NewsEvent[] = []

    Promise.all(dates.map(d => firedb.fetchEvents(d).then(r => newsData.push(...r)))).then(() => {
      setEventsData(newsData);
    })
  }, [dateStart, dateEnd])
  
  useEffect(() => {
    getDatesCallback(); 
  }, [getDatesCallback])

  return (
    <div style={{width: "100vw", height: "100vh", overflow: "hidden"}}>
      <MenuBar />
      <div style={{display: "flex"}}>
        <Sidebar segment={activeSegment} newsEvents={(eventsData ?? []).filter((newsEvent) => newsEvent.segment.toLowerCase() == activeSegment?.toLowerCase())}/>
        <OmniMap updateSegmentCallback={(segment: string) => setActiveSegment(segment)} newsEvents={eventsData ?? []}/>
        <DatePicker onChangeHandler={(index, value) => {
          if (index == 0) setDateStart(value)
          else setDateEnd(value)
        }}/>
      </div>
    </div>
  );
}
