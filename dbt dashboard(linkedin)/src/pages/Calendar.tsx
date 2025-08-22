import React, { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

function prettySupabaseTime(time?: string) {
  if (!time) return 'Not scheduled';
  const match = time.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})[T ]([0-9]{2}):([0-9]{2}):([0-9]{2})/);
  if (!match) return time;
  const [, year, month, day, hourStr, minute] = match;
  let hour = parseInt(hourStr, 10);
  let ampm = 'AM';
  if (hour >= 12) {
    ampm = 'PM';
    if (hour > 12) hour -= 12;
  }
  if (hour === 0) hour = 12;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[parseInt(month, 10) - 1]} ${year}, ${hour}:${minute} ${ampm}`;
}

const CalendarPage = () => {
  const [posts, setPosts] = useState([]);
  const [previewPost, setPreviewPost] = useState(null);
  useEffect(() => {
    supabase
      .from('schedulepost')
      .select('*')
      .order('time_of_posting', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setPosts(data || []);
      });
  }, []);

  const approvedPosts = posts.filter(post => post.status === 'approved');
  const approvedDates = approvedPosts.map(post => post.time_of_posting ? parseISO(post.time_of_posting) : null).filter(Boolean);

  // Custom day content for calendar: show a dot if there's an approved post on that day
  function renderDay(day) {
    const hasPost = approvedDates.some(date => isSameDay(date, day));
    return (
      <div className="relative flex items-center justify-center w-full h-full">
        <span>{day.getDate()}</span>
        {hasPost && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500" />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto">
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Calendar</h1>
      </div>
      <div className="flex-1 flex flex-row items-start justify-center p-8 gap-8">
        {/* Content Planner on the left */}
        <div className="flex-1 flex flex-col items-start justify-start w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Content Plan</h2>
          <p className="text-gray-600 mb-6">Plan and view your approved content for the week</p>
          <div className="grid grid-cols-2 grid-rows-2 gap-8 w-full">
            {posts.filter(post => post.status === 'approved').slice(0, 4).length > 0 ? (
              posts.filter(post => post.status === 'approved').slice(0, 4).map(post => (
                <Card key={post.id} className="border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer aspect-square flex flex-col justify-center items-center min-h-[260px] min-w-[260px] max-h-[400px] max-w-[400px]" onClick={() => setPreviewPost(post)}>
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full w-full">
                    <div className="font-semibold text-blue-700 text-base mb-4 text-center">{prettySupabaseTime(post.time_of_posting)}</div>
                    <div className="text-gray-900 font-medium text-lg mb-4 text-center line-clamp-6">{post.post}</div>
                    {post.image_markdown && (
                      <div className="mb-2 w-full flex justify-center">
                        {post.image_markdown.startsWith('![') ? (
                          <span dangerouslySetInnerHTML={{ __html: post.image_markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src=\"$2\" alt=\"$1\" style=\"max-width:100%;max-height:160px;object-fit:contain;display:block;margin:auto;border-radius:0.5rem;box-shadow:0 1px 4px rgba(0,0,0,0.08);\" />') }} />
                        ) : (
                          <img src={post.image_markdown} alt="Post" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain', display: 'block', margin: 'auto', borderRadius: '0.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 row-span-2 text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <p className="text-xl font-medium">No approved posts scheduled</p>
                <p className="text-sm">Approved posts will appear here with their scheduled date and image</p>
              </div>
            )}
          </div>
          {/* Preview Dialog */}
          <Dialog open={!!previewPost} onOpenChange={open => !open && setPreviewPost(null)}>
            <DialogContent className="max-w-lg w-full bg-white border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Post Preview</DialogTitle>
              </DialogHeader>
              {previewPost && (
                <div className="mt-2 w-full flex flex-col items-center justify-center" style={{ flex: 1, minHeight: 0 }}>
                  <div className="text-gray-900 text-base whitespace-pre-line mb-4 w-full" style={{ fontFamily: 'inherit', wordBreak: 'break-word', maxWidth: '100%', fontSize: '1rem', lineHeight: 1.5, overflowWrap: 'anywhere', textAlign: 'center', maxHeight: '28vh', overflowY: 'auto' }}>{previewPost.post}</div>
                  {previewPost.image_markdown && (
                    <div className="mb-2 w-full flex justify-center" style={{ maxHeight: '40vh', width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                      {previewPost.image_markdown.startsWith('![') ? (
                        <span dangerouslySetInnerHTML={{ __html: previewPost.image_markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src=\"$2\" alt=\"$1\" style=\"max-width:100%;max-height:38vh;object-fit:contain;display:block;margin:auto;border-radius:0.5rem;box-shadow:0 1px 4px rgba(0,0,0,0.08);\" />') }} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                      ) : (
                        <img src={previewPost.image_markdown} alt="Post" style={{ maxWidth: '100%', maxHeight: '38vh', objectFit: 'contain', display: 'block', margin: 'auto', borderRadius: '0.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
                      )}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">Scheduled: {prettySupabaseTime(previewPost.time_of_posting)}</div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        {/* Calendar on the right, vertically centered with content planner */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 min-w-[340px] max-w-[400px] flex-shrink-0 flex items-center justify-center">
          <CalendarComponent
            components={{
              DayContent: ({ date }) => renderDay(date)
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 