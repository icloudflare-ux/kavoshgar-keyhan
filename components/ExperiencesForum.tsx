
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare } from 'lucide-react';

interface Post {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    likes_count: number;
    // For simplicity, we'll fetch username from a hypothetical profiles table
    author_username: string; 
}

const ExperiencesForum: React.FC = () => {
    const { user, isAuthenticated, openAuthModal } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        // NOTE: This assumes you have a public view or RPC function `get_forum_posts` 
        // that joins with a profiles table to get usernames.
        // For now, we'll mock the username part.
        const { data, error } = await supabase
            .from('experiences')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (error) {
            setError('خطا در دریافت تجربیات. لطفاً بعداً دوباره تلاش کنید.');
            console.error('Error fetching posts:', error.message);
        } else {
            // Mocking username
            const processedData = data.map(p => ({...p, author_username: `کاربر ${p.user_id.substring(0, 6)}`}));
            setPosts(processedData);
        }
        setIsLoading(false);
    };

    const handlePostSubmit = async () => {
        if (!newPostContent.trim() || !user) return;
        
        setIsSubmitting(true);
        const { error } = await supabase
            .from('experiences')
            .insert({ 
                content: newPostContent, 
                user_id: user.id,
                // `is_approved` defaults to false in the database for admin review
            });

        if (error) {
            setError('خطا در ارسال تجربه. لطفاً دوباره تلاش کنید.');
            console.error('Error submitting post:', error.message);
        } else {
            setNewPostContent('');
            alert('تجربه شما برای بازبینی ارسال شد و پس از تأیید نمایش داده خواهد شد.');
        }
        setIsSubmitting(false);
    };
    
    const handleLike = async (postId: number) => {
        if (!isAuthenticated) {
            openAuthModal();
            return;
        }
        // This is a simplified like system. A real one would prevent multiple likes from the same user.
        // We use an RPC call to the database to increment the count atomically.
        const { error } = await supabase.rpc('increment_likes', { post_id_arg: postId });

        if (error) {
            console.error('Error liking post:', error.message);
        } else {
            // Optimistically update UI
            setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
        }
    };

    return (
        <section id="forum">
             <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
                {"تالار گفتگوی تجربیات"}
            </h3>
            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
                {"فضایی برای به اشتراک گذاشتن تجربیات شما در زمینه پاکسازی، رؤیاهای صادقه و سایر مسائل ماورایی."}
            </p>
            <Card>
                <div className="mb-8">
                    <h4 className="font-lalezar text-2xl text-indigo-300 mb-3">{"تجربه خود را به اشتراک بگذارید"}</h4>
                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <textarea 
                                value={newPostContent}
                                onChange={e => setNewPostContent(e.target.value)}
                                placeholder="تجربه خود را اینجا بنویسید..."
                                rows={5}
                                className="w-full bg-slate-800/50 border-slate-600 rounded-lg p-3"
                            />
                            <button onClick={handlePostSubmit} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-600">
                                {isSubmitting ? <Spinner small /> : 'ارسال'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                            <p className="font-tanha text-lg text-gray-300 mb-4">{"برای اشتراک‌گذاری تجربه، لطفاً وارد حساب کاربری خود شوید."}</p>
                            <button onClick={openAuthModal} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg">{"ورود / ثبت‌نام"}</button>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {isLoading ? <div className="flex justify-center p-8"><Spinner /></div> : 
                     error ? <p className="text-red-400 text-center">{error}</p> :
                     posts.map(post => (
                        <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-3">
                                <p className="font-bold text-indigo-300">{post.author_username}</p>
                                <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString('fa-IR')}</p>
                            </div>
                            <p className="font-tanha text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-700/50">
                                <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors">
                                    <Heart size={18} />
                                    <span>{post.likes_count}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                                    <MessageSquare size={18} />
                                    <span>{"پاسخ"}</span>
                                </button>
                            </div>
                        </motion.div>
                     ))
                    }
                </div>
            </Card>
        </section>
    );
};

export default ExperiencesForum;
