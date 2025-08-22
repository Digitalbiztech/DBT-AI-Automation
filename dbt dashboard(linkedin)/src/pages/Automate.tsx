import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  List,
  Calendar,
  Eye,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { Badge } from '@/components/ui/badge';

interface SchedulePost {
  id: number;
  post: string;
  image_url?: string;
  image_markdown?: string;
  time_of_posting: string;
  status: string;
}

function prettySupabaseTime(time?: string) {
  if (!time) return 'Not scheduled';
  // Match: YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm:ss
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

const Automate = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<SchedulePost[]>([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [previewPost, setPreviewPost] = useState<SchedulePost | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPost, setEditPost] = useState<SchedulePost | null>(null);
  const [editContent, setEditContent] = useState('');

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('schedulepost')
      .select('*')
      .order('time_of_posting', { ascending: false });
    if (error) {
      alert('Error fetching posts: ' + error.message);
    } else {
      console.log('Fetched posts:', data); // Debug log
      setPosts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from('schedulepost')
      .update({ status: newStatus })
      .eq('id', id);
    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      fetchPosts();
    }
    setIsLoading(false);
  };

  const updatePostStatus = (postId: number, newStatus: string, feedback: string = '') => {
    updateStatus(postId, newStatus);
    setRejectDialogOpen(false);
    setRejectFeedback('');
  };

  const openRejectDialog = (postId: number) => {
    setCurrentPostId(postId);
    setRejectDialogOpen(true);
  };

  const handleReject = () => {
    if (currentPostId) {
      updatePostStatus(currentPostId, 'pending', rejectFeedback);
    }
  };

  const handleEditClick = (post: SchedulePost) => {
    setEditPost(post);
    setEditContent(post.post);
    setEditDialogOpen(true);
  };
  const handleEditSave = async () => {
    if (!editPost) return;
    const { error } = await supabase
      .from('schedulepost')
      .update({ post: editContent })
      .eq('id', editPost.id);
    if (error) {
      alert('Error updating post: ' + error.message);
    } else {
      setEditDialogOpen(false);
      setEditPost(null);
      fetchPosts();
    }
  };

  const filteredPosts = posts.filter(post =>
    statusFilter === 'all' ? true : post.status === statusFilter
  );

  // Override Skeleton for Automate page to use a light background
  const LightSkeleton = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} className={["animate-pulse rounded-md bg-gray-200", props.className].filter(Boolean).join(" ")} />
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
          <LightSkeleton className="h-8 w-64" />
          <div className="flex space-x-3">
            <LightSkeleton className="h-10 w-24" />
            <LightSkeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <LightSkeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <LightSkeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const renderQueueItem = (post: SchedulePost, updateStatus: (id: number, newStatus: string) => void) => (
    <div key={post.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-white flex flex-row items-start gap-6">
      {/* Left: Text and actions */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <span className="font-medium text-gray-900 block mb-2">{post.post}</span>
          <div className="text-xs text-gray-500 mb-2">Scheduled: {prettySupabaseTime(post.time_of_posting)}</div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 mr-2">
            {post.status}
          </Badge>
          {post.status !== 'approved' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-green-600 bg-green-50 hover:bg-green-100 border-green-200"
                onClick={() => updateStatus(post.id, 'approved')}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
                onClick={() => updateStatus(post.id, 'declined')}
              >
                Decline
              </Button>
            </>
          )}
          {post.status !== 'pending' && (
            <Button variant="outline" size="sm" className="h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200" onClick={() => updateStatus(post.id, 'pending')}>
              Set Pending
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600" onClick={() => handleEditClick(post)}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Right: Image */}
      {post.image_url || post.image_markdown ? (
        <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[180px] max-w-[220px]">
          {post.image_url && (
            <img src={post.image_url} alt="Post" className="rounded shadow max-w-full max-h-48 object-contain mb-2" />
          )}
          {post.image_markdown && (() => {
            const match = post.image_markdown.match(/!\[.*?\]\((.*?)\)/);
            if (match) {
              return <img src={match[1]} alt="Post" className="rounded shadow max-w-full max-h-48 object-contain" />;
            } else {
              return <span className="text-xs bg-gray-50 p-2 rounded border font-mono whitespace-pre-wrap">{post.image_markdown}</span>;
            }
          })()}
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto">
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Approval</h1>
          <p className="text-gray-600 mt-1">Review and approve scheduled content</p>
        </div>
      </div>
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="queue" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
              <List className="h-4 w-4" />
              Publishing Queue
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
              <Calendar className="h-4 w-4" />
              Content Planner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="mt-6">
            {/* Search and Filter Controls */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              {/* Remove the platform filter dropdown from the UI */}
              <Button variant="default" className="bg-primary text-white hover:bg-primary/90">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Add status filter dropdown above posts list */}
            <div className="flex items-center gap-2 mb-4">
              <label className="text-sm text-gray-600">Status:</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm text-black bg-white"
                style={{ color: 'black' }}
                aria-label="Status filter"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            <Card className="border-gray-200 bg-white shadow-sm">
              <Tabs defaultValue="pending" className="w-full">
                <CardHeader className="pb-0">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="pending" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      Pending ({filteredPosts.filter(p => p.status === 'pending').length})
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      Approved ({filteredPosts.filter(p => p.status === 'approved').length})
                    </TabsTrigger>
                    <TabsTrigger value="declined" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
                      <XCircle className="h-4 w-4" />
                      Declined ({filteredPosts.filter(p => p.status === 'declined').length})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="pt-6">
                  <TabsContent value="pending" className="space-y-4">
                    {filteredPosts.filter(post => post.status === 'pending').length > 0 ? (
                      filteredPosts
                        .filter(post => post.status === 'pending')
                        .map(post => renderQueueItem(post, updateStatus))
                    ) : (
                      <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-xl font-medium">No pending posts</p>
                        <p className="text-sm">All posts have been reviewed</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="approved" className="space-y-4">
                    {filteredPosts.filter(post => post.status === 'approved').length > 0 ? (
                      filteredPosts
                        .filter(post => post.status === 'approved')
                        .map(post => renderQueueItem(post, updateStatus))
                    ) : (
                      <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-xl font-medium">No approved posts</p>
                        <p className="text-sm">No posts have been approved yet</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="declined" className="space-y-4">
                    {filteredPosts.filter(post => post.status === 'declined').length > 0 ? (
                      filteredPosts
                        .filter(post => post.status === 'declined')
                        .map(post => renderQueueItem(post, updateStatus))
                    ) : (
                      <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                        <XCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-xl font-medium">No declined posts</p>
                        <p className="text-sm">No posts have been declined yet</p>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </TabsContent>

          <TabsContent value="planner" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Weekly Content Plan</h2>
                <p className="text-gray-600 mt-1">Plan and schedule your content across all platforms</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {posts.filter(post => post.status === 'approved').length > 0 ? (
                  posts.filter(post => post.status === 'approved').map(post => (
                    <Card key={post.id} className="border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => setPreviewPost(post)}>
                      <CardContent className="p-4 flex flex-col items-center">
                        <div className="font-semibold text-blue-700 text-xs mb-2">{prettySupabaseTime(post.time_of_posting)}</div>
                        <div className="text-gray-900 font-medium text-base mb-2 text-center">{post.post}</div>
                        {post.image_markdown && (
                          <div className="mb-2 w-full flex justify-center">
                            {post.image_markdown.startsWith('![') ? (
                              <span dangerouslySetInnerHTML={{ __html: post.image_markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;max-height:256px;object-fit:contain;display:block;margin:auto;border-radius:0.5rem;box-shadow:0 1px 4px rgba(0,0,0,0.08);" />') }} />
                            ) : (
                              <img src={post.image_markdown} alt="Post" style={{ maxWidth: '100%', maxHeight: 256, objectFit: 'contain', display: 'block', margin: 'auto', borderRadius: '0.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) :
                  <div className="col-span-full text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xl font-medium">No approved posts scheduled</p>
                    <p className="text-sm">Approved posts will appear here with their scheduled date and image</p>
                  </div>
                }
              </div>
              {/* Preview Dialog */}
              <Dialog open={!!previewPost} onOpenChange={open => !open && setPreviewPost(null)}>
                <DialogContent
                  className="max-w-lg w-full bg-white border-gray-200"
                  style={{
                    maxHeight: '80vh',
                    minHeight: '40vh',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem',
                  }}
                >
                  <React.Fragment>
                    <DialogHeader>
                      <DialogTitle className="text-gray-900">Post Preview</DialogTitle>
                    </DialogHeader>
                    {previewPost && (
                      <div
                        className="mt-2 w-full flex flex-col items-center justify-center"
                        style={{ flex: 1, minHeight: 0 }}
                      >
                        <div
                          className="text-gray-900 text-base whitespace-pre-line mb-4 w-full"
                          style={{
                            fontFamily: 'inherit',
                            wordBreak: 'break-word',
                            maxWidth: '100%',
                            fontSize: '1rem',
                            lineHeight: 1.5,
                            overflowWrap: 'anywhere',
                            textAlign: 'center',
                            maxHeight: '28vh',
                            overflowY: 'auto',
                          }}
                        >
                          {previewPost.post}
                        </div>
                        {previewPost.image_markdown && (
                          <div
                            className="mb-2 w-full flex justify-center"
                            style={{ maxHeight: '40vh', width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
                          >
                            {previewPost.image_markdown.startsWith('![') ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: previewPost.image_markdown.replace(
                                    /!\[(.*?)\]\((.*?)\)/g,
                                    '<img src="$2" alt="$1" style="max-width:100%;max-height:38vh;object-fit:contain;display:block;margin:auto;border-radius:0.5rem;box-shadow:0 1px 4px rgba(0,0,0,0.08);" />'
                                  ),
                                }}
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                              />
                            ) : (
                              <img
                                src={previewPost.image_markdown}
                                alt="Post"
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '38vh',
                                  objectFit: 'contain',
                                  display: 'block',
                                  margin: 'auto',
                                  borderRadius: '0.5rem',
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                }}
                              />
                            )}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2">Scheduled: {prettySupabaseTime(previewPost.time_of_posting)}</div>
                      </div>
                    )}
                  </React.Fragment>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Reject Feedback Dialog */}
          <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogContent className="bg-white border-gray-200" aria-describedby="reject-feedback-desc">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Decline Post</DialogTitle>
                <DialogDescription id="reject-feedback-desc">
                  Please provide feedback on why this post was declined.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-gray-900">Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={rejectFeedback}
                    onChange={(e) => setRejectFeedback(e.target.value)}
                    placeholder="Provide specific feedback on why this post was not approved..."
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    Cancel
                  </Button>
                  <Button onClick={handleReject} disabled={!rejectFeedback.trim()} className="bg-blue-600 hover:bg-blue-700">
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={open => { if (!open) setEditDialogOpen(false); }}>
            <DialogContent className="max-w-lg w-full bg-white border-gray-200" aria-describedby="edit-post-desc">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Edit Post</DialogTitle>
                <DialogDescription id="edit-post-desc">Edit the content of your post below.</DialogDescription>
              </DialogHeader>
              <div className="mt-2">
                <textarea
                  className="w-full border rounded p-2 text-gray-900"
                  rows={6}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="Edit your post content here"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSave} disabled={!editContent.trim()}>
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Tabs>
      </div>
    </div>
  );
};

export default Automate; 