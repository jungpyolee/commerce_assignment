import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Link, List, ListInput, ListItem, Toggle } from 'framework7-react';
import event1 from '../assets/images/event1.png';
import event2 from '../assets/images/event2.png';
import event3 from '../assets/images/event3.png';
import event4 from '../assets/images/event4.png';
import event5 from '../assets/images/event5.png';

export default function EventTab() {
  const [onGoing, setOnGoing] = useState(true);
  let slide = [event1, event2, event3, event4, event5];

  return (
    <div>
      <div className="p-4 mb-5 h-5">
        <div className="flex justify-between ">
          {onGoing ? <div>진행중인 이벤트 {slide.length}건</div> : <div>종료 0건</div>}{' '}
          <div className=" text-xs w-20 h-6  flex ">
            <div
              onClick={() => setOnGoing(true)}
              className={
                onGoing
                  ? 'w-12 h-6 bg-gray-600 text-white rounded-l flex justify-center items-center'
                  : 'w-12 h-6 text-gray-600 border rounded-l flex justify-center items-center'
              }
            >
              {' '}
              진행중
            </div>
            <div
              onClick={() => setOnGoing(false)}
              className={
                !onGoing
                  ? 'w-8 h-6 bg-gray-600 text-white rounded-r flex justify-center items-center'
                  : 'w-8 h-6 text-gray-600 flex border rounded-r justify-center items-center'
              }
            >
              {' '}
              종료
            </div>
          </div>
        </div>
      </div>

      <div>
        {onGoing &&
          slide.map((i) => {
            return <img key={i} src={i} className="max-w-full w-full h-40  rounded-2xl px-2 py-1" alt="itemImage" />;
          })}
      </div>
    </div>
  );
}
