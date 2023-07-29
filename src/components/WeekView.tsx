import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

interface Task {
  title: string;
  date: string;
  startHour: number;
  endHour: number;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const colors = ['green', 'red', 'yellow', 'lime', 'sky', 'teal', 'voilet', 'cyan', 'fuchsia']

const WeekView: React.FC<{ sampleData: Task[] }> = ({ sampleData }) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - currentDay);

  const [startOfWeek, setStartOfWeek] = useState(startDate);
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    // Calculate the end date based on the startOfWeek
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    setEndDate(endOfWeek);
  }, [startOfWeek]);

  const formatHeaderDate = (date: Date): string => {
    return date.getDate().toString();
  };

 

  const formatDate = (date: Date): string => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined);
  };

  const handleNextWeek = () => {
    const nextWeekStart = new Date(startOfWeek);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    setStartOfWeek(nextWeekStart);
  };

  const handlePreviousWeek = () => {
    const previousWeekStart = new Date(startOfWeek);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    setStartOfWeek(previousWeekStart);
  };

  const formatCurrentWeek = () => {
    const startDateStr = formatDate(startOfWeek);
    const endDateStr = formatDate(endDate);
    return `${startDateStr} - ${endDateStr}`;
  };

  return (
    <div className="p-12">
      <div className="flex justify-center  text-my-grey items-center mb-4">
        <button
          className="rounded-full drop-shadow-lg bg hover:drop-shadow-none mr-8 focus:outline-none"
          onClick={handlePreviousWeek}
        >
          <img className='h-12 w-12' src='./btn-left.png' />
        </button>
        <div className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: formatCurrentWeek() }}></div>
        <button
          className="rounded-full drop-shadow-lg hover:drop-shadow-none ml-8 focus:outline-none"
          onClick={handleNextWeek}
        >
          <img className='h-12 w-12' src='./btn-right.png' />
        </button>
      </div>
      <table className="w-11/12 mx-auto min-w-[770px] overflow-x-scroll table-fixed">
        <thead className=''>
          <tr className=''>
            <th></th>
            {Array.from({ length: 7 }).map((_, day) => {
              const date = new Date(startOfWeek);
              date.setDate(date.getDate() + day);
              return (
                <th
                  key={day}
                  className={clsx(
                    'text-center text-base font-medium px-4 py-2 border',
                    day === currentDay ? ' text-my-grey bg-slate-50' : ' text-my-grey bg-white shadow-md'
                  )}
                >
                  <div>{days[day]}</div>
                  <div className="text-2xl text-slate-700 font-semibold  italic">{formatHeaderDate(date)}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 24 }).map((_, hour) => (
            <tr key={hour}>
              <td className="text-center bg-gray-100  px-2 py-1 text-gray-800">
                <img className='w-6 h-6 -z-0 opacity-0' src='./clock-icon.png' alt="Clock Icon" />
                <div className="text-xs">{`${hour}:00`}</div>
              </td>
              {Array.from({ length: 7 }).map((_, day) => {
                const date = new Date(startOfWeek);
                date.setDate(date.getDate() + day);
                const dateString = date.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"

                const currentTasks = sampleData.filter(
                  (task) => task.date === dateString && task.startHour <= hour && task.endHour > hour
                );

                return (
                  <td key={`${day}-${hour}`} className="border px-2 py-1 relative">
                    {currentTasks.map((currentTask) => (
                      <div
                        key={`${currentTask.title}-${currentTask.startHour}`}
                        className={`text-sm rounded-md font-serif text-center absolute w-full flex items-center bg-cyan-300  text-black justify-center cursor-pointer p-1`}
                        style={{
                          top: `${(currentTask.startHour - hour) * 50 + 5}px`,
                          height: `${(currentTask.endHour - currentTask.startHour) * 50 - 10}px`,
                          right: '5px',
                          
                        }}
                      >

                        {currentTask.title} ({currentTask.startHour}:00 - {currentTask.endHour}:00)
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeekView;
