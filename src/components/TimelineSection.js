import React, { Component } from 'react';
import {Timeline, TimelineEvent} from 'react-event-timeline';
import timelineData from '../timeline-data.json';
import './TimelineSection.css';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import styled from 'styled-components';

const moment = extendMoment(Moment);

const Line = styled.div`
  display: flex;
  height: 0;
  width: 77%;
  border: 1px solid #aaa;
  position: absolute;
  top: -11px;
  left: 126%;
  &:before {
    content: "";
    width: 10px;
    height: 10px;
    background: #aaa;
    border-radius: 50%;
    display: flex;
    position: absolute;
    top: -5px;
    left: -5px;
  }
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: #aaa;
  border-radius: 100%;
  margin-bottom: 4px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
`

const TopDot = styled.div`
  width: 10px;
  height: 10px;
  background: #aaa;
  position: absolute;
  top: 0;
  right: 5%;
  bottom: 0;
  margin: 0 auto;
  border-radius: 100%;
`;

const BottomDot = styled.div`
  width: 10px;
  height: 10px;
  background: #aaa;
  position: absolute;
  top: 100%;
  right: 5%;
  bottom: 0;
  margin: 0 auto;
  border-radius: 100%;
`;


class TimelineSection extends Component {

  constructor() {
    super();
    this.state = {
      filterTimelineData: [],
      timelines: [],
      timelineEndDate: moment().subtract(10, 'y'),
    }
    this.handleIconClick = this.handleIconClick.bind(this);
  }

  componentWillMount() {
    const filterTimelineData = timelineData.sort((a,b) => {
      return moment(b.release_date).diff(moment(a.release_date));  
    });
    const timelineEndDate = moment(filterTimelineData[filterTimelineData.length - 1].release_date).subtract(1, 'y').format('L');
     
    this.setState({ filterTimelineData, timelineEndDate });
  }

  componentDidMount() {
    const { filterTimelineData } = this.state;
    this.handleIconClick(filterTimelineData[0]);
  }

  handleIconClick(td) {
    const { filterTimelineData } = this.state;

    filterTimelineData.map((filterData) => filterData.show = false);
    this.setState({ filterTimelineData });
    filterTimelineData.map((filterData) => {
      if(filterData.id === td.id || filterData.lead_actor.toLowerCase() === td.lead_actor.toLowerCase() || filterData.producer.toLowerCase() === td.producer.toLowerCase()) {
        filterData.show = true;
      }
      return filterData;
    });

    const showDates = filterTimelineData.filter(fd => fd.show).map(fd => moment(fd.release_date).format('YYYY'));

    let timelines = [showDates[0]];

    for(let i=0; i < showDates.length-1; i++) {
      if((+showDates[i] - +showDates[i+1]) >= 10) {
        timelines.push(showDates[i+1]);
      }
    }
    this.setState({ filterTimelineData, timelines });
  }

  renderTimelineEvent(data, idx) {
 //   const { filterTimelineData, timelines } = this.state;
        const iconStyle = { color: '#fff', cursor: 'pointer' };
        const bubbleStyle = { backgroundColor: data.show ? '#54a4d2' : '#8b8b8b', border: 'none' };
        const contentStyle = {boxShadow: data.show ? '#aaa 0px 1px 3px 0px' : 'none'};
         return (
          <TimelineEvent key={idx} 
           title=''
            icon={data ? <i className="fa fa-users" onClick={() => this.handleIconClick(data)}></i> : ''}
            style={{backgroundColor: "#fff", marginRight: '50%'}}
            titleStyle={{fontSize: '20px', fontWeight: "bold"}}
            iconStyle={iconStyle}
            bubbleStyle={bubbleStyle}
            contentStyle={contentStyle}
           >
           <div className="card">
            { data && data.show && <Line></Line> }
            {data && data.show && 
             <div>
              <h2>{data.movie_name}</h2>
              <div>Release Date: {data.release_date}</div>
              <div>Lead Actor: {data.lead_actor}</div>
              <div>Sub-Genre: {data.sub_genre}</div>
              <div>Producer: {data.producer}</div>
             </div>}
           </div>
           </TimelineEvent>)     
   
  }

  render() {

    const { timelineEndDate, timelines, filterTimelineData } = this.state;
    return (
    <div className="timelineDiv">
      {timelines.map((year, idx) => {        
        const filterByDate = timelines.length === idx+1 ? filterTimelineData.filter((d) => +moment(d.release_date).format('YYYY') <= +year) : filterTimelineData.filter((d) => +moment(d.release_date).format('YYYY') <= +year && +moment(d.release_date).format('YYYY') > +timelines[idx+1])
      
        return(<
          div key={idx}>
          <TopDot className='top'><i>Today</i></TopDot>
          <Timeline className='timeline' orientation="right">
            { 
              filterByDate.map((data, idx) => {
                return this.renderTimelineEvent(data, idx)
              })
            }
          </Timeline>
          <BottomDot className="bottom"><i>{timelineEndDate}</i></BottomDot>
          {timelines.length !== idx+1 && 
            <div>
            <div className="spacer"></div>
            <div class='dots'>
              <Dot></Dot>
              <Dot></Dot>
              <Dot></Dot>
              <Dot></Dot>
              <Dot></Dot>
            </div>
          </div>  
          }
        </div>)
      })}
    </div>
  )}

}

export default TimelineSection;